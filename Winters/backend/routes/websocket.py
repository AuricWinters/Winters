"""
WebSocket 交互式代码执行路由
提供实时双向通信的代码执行能力，模拟真实终端环境。

支持功能：
- 多语言代码执行（JavaScript、TypeScript、Python、C、Java、PHP）
- 实时输出推送（stdout/stderr 分离）
- 用户实时输入（stdin）
- 进程信号控制（SIGINT 中断）
- 自动超时控制
- 临时文件自动清理

消息协议：
- 客户端 -> 服务端:
    {"action": "execute", "code": "...", "language": "python", "timeout": 15}
    {"action": "input", "data": "用户输入内容"}
    {"action": "signal", "signal": "SIGINT"}

- 服务端 -> 客户端:
    {"type": "output", "data": "标准输出内容"}
    {"type": "error", "data": "错误信息或标准错误"}
    {"type": "exit", "code": 0, "data": "进程结束信息"}

作者：后端架构师
版本：1.0.0
"""

import asyncio
import json
import os
import subprocess
import tempfile
import shutil
import threading
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import sys

# 复用 executor.py 的命令查找函数和常量
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from executor import _find_command, CodeExecutor

# 创建路由实例
router = APIRouter()

# 存储活跃连接的进程 {websocket_id: {"process": process, "temp_dir": path}}
active_processes = {}


@router.websocket("/ws/code/execute")
async def websocket_code_execute(websocket: WebSocket):
    """
    WebSocket 交互式代码执行端点

    工作流程：
    1. 接受 WebSocket 连接
    2. 接收第一条 execute 指令（包含代码、语言、超时设置）
    3. 创建临时目录并准备执行环境
    4. 启动非阻塞子进程执行代码
    5. 启动后台线程读取 stdout 和 stderr
    6. 进入主循环接收用户输入和控制信号
    7. 进程结束后发送退出通知并清理资源

    Args:
        websocket: FastAPI WebSocket 连接对象
    """
    await websocket.accept()
    ws_id = id(websocket)

    try:
        # ========== 步骤1：接收执行指令 ==========
        data = await websocket.receive_text()
        msg = json.loads(data)

        # 验证第一条消息必须是 execute 指令
        if msg.get("action") != "execute":
            await websocket.send_json({
                "type": "error",
                "data": "第一条消息必须是 execute 指令"
            })
            return

        # 提取执行参数
        code = msg["code"]
        language = msg.get("language", "python")
        timeout = msg.get("timeout", 15)

        print(f"[WS] 新连接 #{ws_id}: language={language}, timeout={timeout}s")

        # ========== 步骤2：构建执行命令 ==========
        # 创建临时工作目录
        temp_dir = tempfile.mkdtemp(prefix="ws_executor_")

        # 构建执行命令（复用 executor.py 的逻辑）
        command, work_dir = build_execution_command(code, language, temp_dir)

        if command is None:
            await websocket.send_json({
                "type": "error",
                "data": f"不支持的语言: {language}"
            })
            return

        print(f"[WS] #{ws_id} 执行命令: {' '.join(command)}")

        # ========== 步骤3：创建非阻塞子进程 ==========
        # Windows 特殊处理：使用 CREATE_NO_PROCESS_GROUP 避免控制台窗口
        popen_kwargs = {
            "cwd": work_dir,
            "stdout": subprocess.PIPE,
            "stderr": subprocess.PIPE,
            "stdin": subprocess.PIPE,
            "text": True,
            "bufsize": 1,  # 行缓冲，保证实时性
        }

        # Windows 平台特殊配置
        if sys.platform == 'win32':
            popen_kwargs['creationflags'] = subprocess.CREATE_NO_WINDOW

        process = subprocess.Popen(command, **popen_kwargs)

        # 注册活跃进程
        active_processes[ws_id] = {
            "process": process,
            "temp_dir": temp_dir
        }

        # ========== 步骤4：使用 Queue 模式实现跨线程通信 ==========
        # 创建异步队列，用于线程→协程的安全消息传递
        output_queue = asyncio.Queue()

        def read_stdout():
            """后台线程：读取标准输出并放入队列"""
            try:
                while True:
                    line = process.stdout.readline()
                    if not line:
                        break
                    output_queue.put_nowait({"type": "output", "data": line})
            except Exception as e:
                print(f"[WS] #{ws_id} stdout 读取异常: {e}")
                try:
                    output_queue.put_nowait({"type": "error", "data": f"stdout读取异常: {e}"})
                except Exception:
                    pass

        def read_stderr():
            """后台线程：读取标准错误并放入队列"""
            try:
                while True:
                    line = process.stderr.readline()
                    if not line:
                        break
                    output_queue.put_nowait({"type": "error", "data": line})
            except Exception as e:
                print(f"[WS] #{ws_id} stderr 读取异常: {e}")

        # 启动守护线程（主进程结束时自动终止）
        output_thread = threading.Thread(target=read_stdout, daemon=True)
        error_thread = threading.Thread(target=read_stderr, daemon=True)
        output_thread.start()
        error_thread.start()

        print(f"[WS] #{ws_id} 进程已启动 (PID: {process.pid})")

        # 启动后台任务：从队列读取消息并发送到客户端
        async def forward_output():
            """异步任务：从队列取消息并通过 WebSocket 发送"""
            try:
                while True:
                    msg = await output_queue.get()
                    await websocket.send_json(msg)
            except Exception as e:
                print(f"[WS] #{ws_id} 输出转发异常: {e}")

        # 创建转发任务但不等待（让它在后台运行）
        forward_task = asyncio.create_task(forward_output())

        # ========== 步骤5：主循环 - 接收用户输入 ==========
        while True:
            try:
                data = await websocket.receive_text()
                msg = json.loads(data)

                action = msg.get("action")

                if action == "input":
                    # 用户输入数据，写入 stdin
                    input_data = msg.get("data", "")
                    import sys as _sys
                    _sys.stderr.write(f"[WS-DEBUG] Received input: {repr(input_data)}\n")
                    _sys.stderr.flush()
                    try:
                        process.stdin.write(input_data)
                        process.stdin.flush()
                        _sys.stderr.write(f"[WS-DEBUG] stdin write OK\n")
                        _sys.stderr.flush()
                    except (BrokenPipeError, OSError) as e:
                        _sys.stderr.write(f"[WS-DEBUG] stdin write ERROR: {e}\n")
                        _sys.stderr.flush()
                        # 进程已结束，无法写入
                        await websocket.send_json({
                            "type": "exit",
                            "code": -1,
                            "data": "进程已结束，无法输入"
                        })
                        break

                elif action == "signal":
                    # 发送信号控制进程
                    signal_type = msg.get("signal")
                    if signal_type == "SIGINT":
                        # 发送中断信号（Ctrl+C）
                        process.terminate()
                        await websocket.send_json({
                            "type": "output",
                            "data": "^C\n程序已中断\n"
                        })

            except WebSocketDisconnect:
                # 客户端主动断开连接
                print(f"[WS] #{ws_id} 客户端断开连接")
                break

        # ========== 步骤6：等待进程结束并发送退出通知 ==========
        # 取消输出转发任务
        forward_task.cancel()
        try:
            await forward_task
        except asyncio.CancelledError:
            pass

        # 等待子进程完成（最多等待3秒）
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            # 超时强制终止
            process.terminate()
            process.wait()

        exit_code = process.returncode

        await websocket.send_json({
            "type": "exit",
            "code": exit_code,
            "data": f"\n[进程结束，退出码: {exit_code}]\n"
        })

        print(f"[WS] #{ws_id} 进程已结束 (exit code: {exit_code})")

    except Exception as e:
        # 捕获未预期的异常
        print(f"[WS] #{ws_id} 发生异常: {e}")
        try:
            await websocket.send_json({
                "type": "error",
                "data": f"服务器内部错误: {str(e)}"
            })
        except Exception:
            pass

    finally:
        # ========== 步骤7：资源清理 ==========
        if ws_id in active_processes:
            proc_info = active_processes.pop(ws_id)
            proc = proc_info["process"]
            temp_dir = proc_info["temp_dir"]

            # 终止仍在运行的进程
            if proc.poll() is None:
                print(f"[WS] #{ws_id} 清理：终止残留进程")
                proc.terminate()
                try:
                    proc.wait(timeout=3)
                except subprocess.TimeoutExpired:
                    proc.kill()
                    proc.wait()

            # 删除临时目录
            if temp_dir and os.path.exists(temp_dir):
                try:
                    shutil.rmtree(temp_dir, ignore_errors=True)
                    print(f"[WS] #{ws_id} 临时目录已清理")
                except Exception as cleanup_error:
                    print(f"[WS] #{ws_id} 清理失败: {cleanup_error}")


def build_execution_command(code: str, language: str, temp_dir: str) -> tuple:
    """
    构建执行命令

    根据编程语言创建源代码文件并构建相应的执行命令。
    对于编译型语言（C、Java），会先进行编译。

    Args:
        code: 源代码字符串
        language: 编程语言标识符
        temp_dir: 临时工作目录路径

    Returns:
        tuple: (command_list, work_dir) 或 (None, None) 如果不支持该语言
               command_list 为 None 表示编译失败或不支持的语言

    支持的语言：
        - JavaScript (.js): node 命令
        - TypeScript/ArkTS (.ts): npx tsx 命令
        - Python (.py): python 命令
        - C (.c): gcc 编译后执行
        - Java (.java): javac 编译后执行
        - PHP (.php): php 命令
    """
    # 标准化语言名称
    lang_lower = language.lower().strip()

    # 语言类型判断
    is_ts = lang_lower in ('typescript', 'ts', 'arkts')
    is_js = lang_lower in ('javascript', 'js')
    is_python = lang_lower in ('python', 'py')

    # 查找可执行命令路径（复用 executor.py 的 _find_command）
    node_cmd = _find_command("node")
    npx_cmd = _find_command("npx")
    python_cmd = _find_command("python")
    gcc_cmd = _find_command("gcc")
    javac_cmd = _find_command("javac")
    java_cmd = _find_command("java")
    php_cmd = _find_command("php")

    # 文件扩展名映射
    ext_map = {
        'javascript': '.js', 'js': '.js',
        'typescript': '.ts', 'ts': '.ts', 'arkts': '.ts',
        'python': '.py', 'py': '.py',
        'c': '.c',
        'java': '.java',
        'php': '.php'
    }

    ext = ext_map.get(lang_lower, '.txt')
    temp_file = os.path.join(temp_dir, f"main{ext}")

    # 写入源代码到临时文件
    with open(temp_file, 'w', encoding='utf-8') as f:
        f.write(code)

    # ========== TypeScript/ArkTS 执行 ==========
    if is_ts:
        # 使用 tsx 零配置运行 TypeScript
        return [npx_cmd, "tsx", temp_file], temp_dir

    # ========== JavaScript 执行 ==========
    elif is_js:
        return [node_cmd, temp_file], temp_dir

    # ========== Python 执行 ==========
    elif is_python:
        return [python_cmd, '-u', temp_file], temp_dir

    # ========== C 语言编译执行 ==========
    elif lang_lower == 'c':
        out_file = os.path.join(temp_dir, "main.exe")  # Windows 使用 .exe

        # 编译 C 代码
        compile_result = subprocess.run(
            [gcc_cmd, temp_file, "-o", out_file],
            capture_output=True,
            text=True,
            cwd=temp_dir
        )

        if compile_result.returncode != 0:
            # 编译失败，返回 None 让调用方处理错误
            print(f"[WS] C 编译失败:\n{compile_result.stderr}")
            return None, None

        # 返回编译后的可执行文件路径
        return [out_file], temp_dir

    # ========== Java 编译执行 ==========
    elif lang_lower == 'java':
        # Java 要求类名为 Main
        java_file = os.path.join(temp_dir, "Main.java")

        # 重写文件为 Main.java
        with open(java_file, 'w', encoding='utf-8') as f:
            f.write(code)

        # 编译 Java 代码
        compile_result = subprocess.run(
            [javac_cmd, java_file],
            capture_output=True,
            text=True,
            cwd=temp_dir
        )

        if compile_result.returncode != 0:
            # 编译失败
            print(f"[WS] Java 编译失败:\n{compile_result.stderr}")
            return None, None

        # 返回 java Main 命令
        return [java_cmd, "Main"], temp_dir

    # ========== PHP 执行 ==========
    elif lang_lower == 'php':
        return [php_cmd, temp_file], temp_dir

    # ========== 不支持的语言 ==========
    else:
        print(f"[WS] 不支持的语言: {language}")
        return None, None


# ==================== 辅助功能 ====================

def get_active_connections_count() -> int:
    """
    获取当前活跃的 WebSocket 连接数量

    Returns:
        int: 活跃连接数
    """
    return len(active_processes)


def cleanup_all_processes():
    """
    强制清理所有活跃进程（用于应用关闭时）

    终止所有正在运行的子进程并删除临时目录
    """
    for ws_id, proc_info in list(active_processes.items()):
        proc = proc_info["process"]
        temp_dir = proc_info["temp_dir"]

        # 终止进程
        if proc.poll() is None:
            proc.terminate()
            try:
                proc.wait(timeout=2)
            except subprocess.TimeoutExpired:
                proc.kill()

        # 清理临时目录
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)

    # 清空字典
    active_processes.clear()
    print("[WS] 所有活跃进程已清理")


# ==================== 模块测试入口 ====================

if __name__ == "__main__":
    """
    WebSocket 路由模块自测

    测试 build_execution_command 函数是否正确生成各语言的执行命令
    """
    import asyncio

    print("=" * 60)
    print("WebSocket 路由模块 (websocket.py) 自测")
    print("=" * 60)

    # 测试用例
    test_cases = [
        {
            "name": "Python 测试",
            "language": "python",
            "code": 'print("Hello from WebSocket!")\nname = input("请输入姓名: ")\nprint(f"你好, {name}!")',
            "expected_prefix": ["python"]
        },
        {
            "name": "JavaScript 测试",
            "language": "javascript",
            "code": 'console.log("JS WebSocket Test");',
            "expected_prefix": ["node"]
        },
        {
            "name": "TypeScript 测试",
            "language": "typescript",
            "code": 'console.log("TS WebSocket Test");',
            "expected_prefix": ["npx", "tsx"]
        }
    ]

    passed = 0
    failed = 0

    for test in test_cases:
        print(f"\n{'─' * 40}")
        print(f"测试: {test['name']}")
        print(f"语言: {test['language']}")
        print(f"{'─' * 40}")

        # 创建临时目录测试
        temp_dir = tempfile.mkdtemp(prefix="ws_test_")

        try:
            command, work_dir = asyncio.get_event_loop().run_until_complete(
                build_execution_command(test['code'], test['language'], temp_dir)
            )

            if command is not None:
                print(f"[OK] 命令生成成功")
                print(f"命令: {' '.join(command)}")
                print(f"工作目录: {work_dir}")

                # 验证命令前缀
                if all(cmd in command[0:len(test['expected_prefix'])]
                       for cmd in test['expected_prefix']):
                    print("[OK] 命令格式正确")
                    passed += 1
                else:
                    print("[FAIL] 命令格式不匹配")
                    failed += 1
            else:
                print("[FAIL] 命令生成失败")
                failed += 1

        finally:
            # 清理临时目录
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir, ignore_errors=True)

    # 输出总结
    print("\n" + "=" * 60)
    print(f"测试完成: {passed} 通过, {failed} 失败, 共 {len(test_cases)} 个测试")
    print("=" * 60)
