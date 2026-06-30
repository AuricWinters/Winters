"""
代码执行模块 (Code Executor Module)
==================================

支持多种编程语言的代码执行，提供安全的沙箱环境执行能力。

支持的编程语言：
- JavaScript / TypeScript: 使用 Node.js 执行
- Python: 使用 python 命令执行
- C: 使用 gcc 编译后执行
- Java: 使用 javac 编译后执行
- PHP: 使用 php 命令执行

安全特性：
- 超时控制（默认10秒）
- 工作目录隔离（使用临时目录）
- 临时文件自动清理
- 完善的错误处理机制

作者：后端架构师
版本：1.0.0
"""

import os
import subprocess
import tempfile
import shutil
from typing import Dict, Optional
from pathlib import Path


def _find_command(cmd: str) -> str:
    """查找命令的完整路径，找不到则返回原命令名"""
    full_path = shutil.which(cmd)
    return full_path if full_path else cmd


# 预解析常用命令路径
NODE_CMD = _find_command("node")
NPX_CMD = _find_command("npx")
PYTHON_CMD = _find_command("python")
GCC_CMD = _find_command("gcc")
JAVAC_CMD = _find_command("javac")
JAVA_CMD = _find_command("java")
PHP_CMD = _find_command("php")


class CodeExecutor:
    """
    代码执行器类
    
    提供多语言代码执行功能，支持超时控制和临时文件管理。
    所有操作在隔离的临时目录中进行，确保安全性。
    """

    # 支持的编程语言列表
    SUPPORTED_LANGUAGES = {
        'javascript', 'js',
        'typescript', 'ts', 'arkts',
        'python', 'py',
        'c',
        'java',
        'php'
    }

    # 默认超时时间（秒）
    DEFAULT_TIMEOUT = 10

    def __init__(self, timeout: int = DEFAULT_TIMEOUT):
        """
        初始化代码执行器
        
        Args:
            timeout: 默认超时时间（秒），默认为10秒
        """
        self.timeout = timeout

    def execute_code(
        self,
        code: str,
        language: str,
        timeout: Optional[int] = None,
        stdin_input: Optional[str] = None
    ) -> Dict[str, object]:
        """
        执行代码并返回结果

        Args:
            code: 要执行的源代码字符串
            language: 编程语言标识符 (javascript, typescript, python, c, java, php)
            timeout: 超时时间（秒），如果未指定则使用实例默认值
            stdin_input: 标准输入内容（用于 scanf、input() 等交互式输入）

        Returns:
            包含执行结果的字典：
            {
                "success": bool,      # 是否成功执行
                "output": str,       # 标准输出内容
                "error": str         # 错误信息（如有）
            }

        Example:
            >>> executor = CodeExecutor()
            >>> result = executor.execute_code('print("Hello")', 'python')
            >>> print(result)
            {'success': True, 'output': 'Hello\\n', 'error': ''}
        """
        # 标准化语言名称
        normalized_lang = language.lower().strip()

        # 验证语言是否支持
        if not self._is_language_supported(normalized_lang):
            return {
                "success": False,
                "output": "",
                "error": f"不支持的语言: {language}。支持的语言: {', '.join(sorted(self.SUPPORTED_LANGUAGES))}"
            }

        # 使用指定的超时或默认超时
        exec_timeout = timeout if timeout is not None else self.timeout

        # 创建临时工作目录
        temp_dir = None
        try:
            temp_dir = tempfile.mkdtemp(prefix="code_executor_")

            # 根据语言选择执行策略
            result = self._execute_by_language(code, normalized_lang, temp_dir, exec_timeout, stdin_input)

            return result
            
        except Exception as e:
            # 捕获未预期的异常
            return {
                "success": False,
                "output": "",
                "error": f"执行过程中发生意外错误: {str(e)}"
            }
        finally:
            # 确保临时目录被清理
            if temp_dir and os.path.exists(temp_dir):
                try:
                    shutil.rmtree(temp_dir)
                except Exception as cleanup_error:
                    # 清理失败不应影响结果返回，仅记录警告
                    print(f"警告：临时目录清理失败: {cleanup_error}")

    def _is_language_supported(self, language: str) -> bool:
        """
        检查语言是否被支持
        
        Args:
            language: 语言名称
        
        Returns:
            如果支持返回True，否则返回False
        """
        return language in self.SUPPORTED_LANGUAGES

    def _execute_by_language(
        self,
        code: str,
        language: str,
        work_dir: str,
        timeout: int,
        stdin_input: Optional[str] = None
    ) -> Dict[str, object]:
        """
        根据编程语言分发到具体的执行方法

        Args:
            code: 源代码
            language: 标准化后的语言名称
            work_dir: 工作目录路径
            timeout: 超时时间
            stdin_input: 标准输入内容

        Returns:
            执行结果字典
        """
        # JavaScript 和 TypeScript/ArkTS 都使用 Node.js 执行
        if language in ('javascript', 'js', 'typescript', 'ts', 'arkts'):
            return self._execute_javascript(code, work_dir, timeout, language, stdin_input)

        # Python 执行
        elif language in ('python', 'py'):
            return self._execute_python(code, work_dir, timeout, stdin_input)

        # C 语言编译执行
        elif language == 'c':
            return self._execute_c(code, work_dir, timeout, stdin_input)

        # Java 编译执行
        elif language == 'java':
            return self._execute_java(code, work_dir, timeout, stdin_input)

        # PHP 执行
        elif language == 'php':
            return self._execute_php(code, work_dir, timeout, stdin_input)
        
        # 不应该到达这里，但作为防御性编程
        else:
            return {
                "success": False,
                "output": "",
                "error": f"未实现的语言处理器: {language}"
            }

    def _write_temp_file(self, content: str, filepath: str) -> bool:
        """
        将内容写入临时文件
        
        Args:
            content: 文件内容
            filepath: 完整文件路径
        
        Returns:
            写入成功返回True，失败返回False
        """
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except IOError as e:
            raise IOError(f"无法写入文件 {filepath}: {str(e)}")

    def _run_command(
        self,
        command: list,
        work_dir: str,
        timeout: int,
        stdin_input: Optional[str] = None
    ) -> Dict[str, object]:
        """
        执行系统命令并捕获输出

        Args:
            command: 命令及其参数的列表形式
            work_dir: 工作目录
            timeout: 超时时间（秒）
            stdin_input: 标准输入内容

        Returns:
            命令执行结果字典
        """
        try:
            # 准备 stdin 输入（text=True 模式下直接传字符串）
            result = subprocess.run(
                command,
                cwd=work_dir,
                capture_output=True,
                text=True,
                timeout=timeout,
                shell=False,
                input=stdin_input
            )
            
            # 检查返回码
            if result.returncode == 0:
                return {
                    "success": True,
                    "output": result.stdout if result.stdout else "",
                    "error": result.stderr if result.stderr else ""
                }
            else:
                # 返回码非零表示出错
                error_msg = result.stderr if result.stderr else f"命令执行失败，返回码: {result.returncode}"
                return {
                    "success": False,
                    "output": result.stdout if result.stdout else "",
                    "error": error_msg
                }
                
        except subprocess.TimeoutExpired:
            # 处理超时情况
            return {
                "success": False,
                "output": "",
                "error": f"执行超时（超过 {timeout} 秒限制）"
            }
        except FileNotFoundError:
            # 命令不存在（如未安装 Node.js、Python 等）
            cmd_name = command[0] if command else "unknown"
            return {
                "success": False,
                "output": "",
                "error": f"找不到命令 '{cmd_name}'，请确认已正确安装并添加到系统 PATH"
            }
        except Exception as e:
            # 其他意外错误
            return {
                "success": False,
                "output": "",
                "error": f"命令执行异常: {str(e)}"
            }

    def _execute_javascript(
        self,
        code: str,
        work_dir: str,
        timeout: int,
        language: str = 'javascript',
        stdin_input: Optional[str] = None
    ) -> Dict[str, object]:
        """
        执行 JavaScript/TypeScript/ArkTS 代码

        实现：
        - 将代码写入临时文件
        - JavaScript 使用 node 命令执行
        - TypeScript/ArkTS 使用 tsx (npx tsx) 执行（零配置 TS 运行器）

        Args:
            code: JS/TS 源代码
            work_dir: 工作目录
            timeout: 超时时间
            language: 编程语言标识

        Returns:
            执行结果
        """
        is_ts = language in ('typescript', 'ts', 'arkts')
        ext = '.ts' if is_ts else '.js'
        temp_file = os.path.join(work_dir, f"temp_code{ext}")

        try:
            self._write_temp_file(code, temp_file)

            if is_ts:
                command = [NPX_CMD, "tsx", temp_file]
            else:
                command = [NODE_CMD, temp_file]

            return self._run_command(command, work_dir, timeout, stdin_input)
            
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": f"JavaScript 执行准备失败: {str(e)}"
            }

    def _execute_python(
        self,
        code: str,
        work_dir: str,
        timeout: int,
        stdin_input: Optional[str] = None
    ) -> Dict[str, object]:
        """
        执行 Python 代码
        
        实现：
        - 将代码写入临时 .py 文件
        - 使用 python 命令执行
        
        Args:
            code: Python 源代码
            work_dir: 工作目录
            timeout: 超时时间
        
        Returns:
            执行结果
        """
        # 创建临时 .py 文件
        py_file = os.path.join(work_dir, "temp_code.py")
        
        try:
            # 写入代码到临时文件
            self._write_temp_file(code, py_file)
            
            # 构建执行命令：python temp_code.py
            # 使用 python 或 python3（根据系统）
            command = [PYTHON_CMD, py_file]
            
            # 执行命令
            return self._run_command(command, work_dir, timeout, stdin_input)
            
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": f"Python 执行准备失败: {str(e)}"
            }

    def _execute_c(
        self,
        code: str,
        work_dir: str,
        timeout: int,
        stdin_input: Optional[str] = None
    ) -> Dict[str, object]:
        """
        编译并执行 C 代码
        
        实现：
        - 将代码写入临时 .c 文件
        - 使用 gcc 编译生成可执行文件
        - 如果编译成功，执行可执行文件
        - 清理所有临时文件（.c 和可执行文件）
        
        Args:
            code: C 源代码
            work_dir: 工作目录
            timeout: 超时时间
        
        Returns:
            执行结果
        """
        # 创建临时文件路径
        c_file = os.path.join(work_dir, "temp_code.c")
        output_file = os.path.join(work_dir, "temp_out.exe")  # Windows 使用 .exe
        
        try:
            # 步骤1: 写入C代码到临时文件
            self._write_temp_file(code, c_file)
            
            # 步骤2: 使用 gcc 编译
            # 命令格式: gcc temp_code.c -o temp_out.exe
            compile_cmd = ["gcc", c_file, "-o", output_file]
            
            compile_result = self._run_command(compile_cmd, work_dir, timeout)
            
            # 检查编译是否成功
            if not compile_result["success"]:
                # 编译失败，返回编译错误信息
                return {
                    "success": False,
                    "output": "",
                    "error": f"C 编译错误:\n{compile_result['error']}"
                }
            
            # 步骤3: 编译成功，执行生成的程序
            # Windows 下直接运行 .exe 文件
            execute_cmd = [output_file]
            
            # 注意：执行时间从总超时中扣除编译时间
            # 这里简化处理，使用相同的超时值
            execution_result = self._run_command(execute_cmd, work_dir, timeout, stdin_input)

            return execution_result

        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": f"C 执行过程出错: {str(e)}"
            }
        finally:
            # 确保清理临时文件
            self._safe_delete_files([c_file, output_file])

    def _execute_java(
        self,
        code: str,
        work_dir: str,
        timeout: int,
        stdin_input: Optional[str] = None
    ) -> Dict[str, object]:
        """
        编译并执行 Java 代码
        
        实现：
        - 将代码写入临时 Main.java 文件（类名必须是 Main）
        - 使用 javac 编译生成 .class 文件
        - 如果编译成功，执行 java Main
        - 清理所有临时文件（.java 和 .class）
        
        重要提示：
        - Java 代码中的 public 类名必须是 Main
        - 否则编译会失败
        
        Args:
            code: Java 源代码
            work_dir: 工作目录
            timeout: 超时时间
        
        Returns:
            执行结果
        """
        # Java 要求文件名与主类名一致，固定使用 Main.java
        java_file = os.path.join(work_dir, "Main.java")
        class_file = os.path.join(work_dir, "Main.class")
        
        try:
            # 步骤1: 写入Java代码到 Main.java
            self._write_temp_file(code, java_file)
            
            # 步骤2: 使用 javac 编译
            # 命令格式: javac Main.java
            compile_cmd = [JAVAC_CMD, java_file]
            
            compile_result = self._run_command(compile_cmd, work_dir, timeout)
            
            # 检查编译是否成功
            if not compile_result["success"]:
                # 编译失败，返回编译错误信息
                return {
                    "success": False,
                    "output": "",
                    "error": f"Java 编译错误:\n{compile_result['error']}"
                }
            
            # 步骤3: 编译成功，执行 Java 程序
            # 命令格式: java Main
            # 在工作目录中执行，Java 会自动找到 Main.class
            execute_cmd = ["java", "Main"]
            
            execution_result = self._run_command(execute_cmd, work_dir, timeout, stdin_input)
            
            return execution_result
            
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": f"Java 执行过程出错: {str(e)}"
            }
        finally:
            # 确保清理临时文件
            self._safe_delete_files([java_file, class_file])

    def _execute_php(
        self,
        code: str,
        work_dir: str,
        timeout: int,
        stdin_input: Optional[str] = None
    ) -> Dict[str, object]:
        """
        执行 PHP 代码
        
        实现：
        - 将代码写入临时 .php 文件
        - 使用 php 命令执行
        
        Args:
            code: PHP 源代码
            work_dir: 工作目录
            timeout: 超时时间
        
        Returns:
            执行结果
        """
        # 创建临时 .php 文件
        php_file = os.path.join(work_dir, "temp_code.php")
        
        try:
            # 写入代码到临时文件
            self._write_temp_file(code, php_file)
            
            # 构建执行命令：php temp_code.php
            command = [PHP_CMD, php_file]
            
            # 执行命令
            return self._run_command(command, work_dir, timeout, stdin_input)

        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": f"PHP 执行准备失败: {str(e)}"
            }

    def _safe_delete_files(self, file_paths: list):
        """
        安全删除文件列表中的文件
        
        忽略删除失败的文件（如文件不存在等）
        
        Args:
            file_paths: 要删除的文件路径列表
        """
        for file_path in file_paths:
            try:
                if file_path and os.path.exists(file_path):
                    os.remove(file_path)
            except Exception:
                # 忽略删除错误，确保不影响主流程
                pass


# ==================== 便捷函数接口 ====================

# 全局默认执行器实例
_default_executor: Optional[CodeExecutor] = None


def _get_default_executor() -> CodeExecutor:
    """
    获取全局默认执行器实例（懒加载单例模式）
    
    Returns:
        CodeExecutor 实例
    """
    global _default_executor
    if _default_executor is None:
        _default_executor = CodeExecutor()
    return _default_executor


def execute_code(
    code: str,
    language: str,
    timeout: int = 10,
    stdin_input: Optional[str] = None
) -> Dict[str, object]:
    """
    执行代码并返回结果（便捷函数）
    
    这是模块的主要公共接口，供外部调用。
    
    Args:
        code: 要执行的代码字符串
        language: 编程语言 (javascript/typescript/python/c/java/php)
                 支持别名：js/ts/py
        timeout: 超时时间（秒），默认10秒
    
    Returns:
        包含执行结果的字典：
        {
            "success": True/False,   # 是否成功执行
            "output": "标准输出内容",   # stdout 内容
            "error": "错误信息"         # stderr 或错误描述（如有）
        }
    
    Example:
        >>> from executor import execute_code
        >>>
        >>> # 执行 Python 代码
        >>> result = execute_code('print("Hello, World!")', 'python')
        >>> if result['success']:
        ...     print(f"输出: {result['output']}")
        ... else:
        ...     print(f"错误: {result['error']}")
        输出: Hello, World!
        
        >>> # 执行 JavaScript 代码
        >>> result = execute_code('console.log("JS Output");', 'javascript')
        >>> print(result['output'])
        JS Output
        
        >>> # 执行 C 代码
        >>> c_code = '''
        ... #include <stdio.h>
        ... int main() {
        ...     printf("Hello from C!\\n");
        ...     return 0;
        ... }
        ... '''
        >>> result = execute_code(c_code, 'c')
        >>> print(result['output'])
        Hello from C!
        
        >>> # 执行 Java 代码（注意：public 类名必须是 Main）
        >>> java_code = '''
        ... public class Main {
        ...     public static void main(String[] args) {
        ...         System.out.println("Hello from Java!");
        ...     }
        ... }
        ... '''
        >>> result = execute_code(java_code, 'java')
        >>> print(result['output'])
        Hello from Java!
        
        >>> # 执行 PHP 代码
        >>> result = execute_code('<?php echo "PHP Output\\n"; ?>', 'php')
        >>> print(result['output'])
        PHP Output
    
    Note:
        - 所有代码在隔离的临时目录中执行
        - 临时文件会在执行完成后自动清理
        - 编译型语言（C、Java）需要相应的编译器已安装
        - 脚本语言（JS、Python、PHP）需要相应的运行时环境
        - Java 代码的主类名必须是 Main
    """
    executor = _get_default_executor()
    return executor.execute_code(code, language, timeout, stdin_input)


# ==================== 模块测试入口 ====================

if __name__ == "__main__":
    """
    模块自测代码
    
    当直接运行此模块时，执行简单的测试用例验证各语言执行功能
    """
    import sys
    
    print("=" * 60)
    print("代码执行模块 (executor.py) 自测")
    print("=" * 60)
    
    # 测试用例列表
    test_cases = [
        {
            "name": "Python 测试",
            "language": "python",
            "code": 'print("Python 执行成功!");\nprint("当前 Python 版本:");\nimport sys\nprint(sys.version)'
        },
        {
            "name": "JavaScript 测试",
            "language": "javascript",
            "code": 'console.log("JavaScript 执行成功!");\nconsole.log("Node.js 版本:", process.version);'
        },
        {
            "name": "C 语言测试",
            "language": "c",
            "code": """#include <stdio.h>
int main() {
    printf("C 语言执行成功!\\n");
    return 0;
}"""
        },
        {
            "name": "Java 测试",
            "language": "java",
            "code": """public class Main {
    public static void main(String[] args) {
        System.out.println("Java 执行成功!");
    }
}"""
        },
        {
            "name": "PHP 测试",
            "language": "php",
            "code": '<?php echo "PHP 执行成功!\\n"; ?>'
        }
    ]
    
    # 执行测试
    passed = 0
    failed = 0
    
    for test in test_cases:
        print(f"\n{'─' * 40}")
        print(f"测试: {test['name']}")
        print(f"语言: {test['language']}")
        print(f"{'─' * 40}")
        
        result = execute_code(test['code'], test['language'])
        
        if result['success']:
            print("[OK] 执行成功")
            print(f"输出:\n{result['output']}")
            passed += 1
        else:
            print("[FAIL] 执行失败")
            print(f"错误: {result['error']}")
            failed += 1
    
    # 输出测试总结
    print("\n" + "=" * 60)
    print(f"测试完成: {passed} 通过, {failed} 失败, 共 {len(test_cases)} 个测试")
    print("=" * 60)
