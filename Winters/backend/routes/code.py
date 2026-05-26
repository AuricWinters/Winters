"""
代码执行路由模块
提供在线代码执行、运行结果返回等代码相关接口

支持的编程语言：
- JavaScript/TypeScript: Node.js 执行
- Python: Python 解释器执行
- C: GCC 编译 + 执行
- Java: Javac 编译 + JVM 执行
- PHP: PHP 解释器执行

作者：后端架构师
版本：1.0.0
"""

from fastapi import APIRouter, HTTPException
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models import CodeExecuteRequest
from executor import execute_code

# 创建代码执行路由器，前缀为 /api/code
router = APIRouter(
    prefix="/api/code",
    tags=["代码执行"]  # 用于 Swagger 文档分组
)


@router.get("/status")
async def code_status():
    """
    代码执行服务状态检查接口
    返回代码执行模块的运行状态

    Returns:
        dict: 包含模块状态信息的字典

    示例响应：
        {
            "module": "代码执行模块",
            "status": "正常",
            "message": "代码执行服务已就绪"
        }
    """
    return {
        "module": "代码执行模块",
        "status": "正常",
        "message": "代码执行服务已就绪，支持多种编程语言执行"
    }


@router.post("/execute")
async def execute_code_endpoint(request: CodeExecuteRequest):
    """
    执行代码接口 (POST /api/code/execute)

    接收用户提交的代码，在安全的沙箱环境中执行，并返回执行结果。

    支持的编程语言：
    - JavaScript/TypeScript: 使用 Node.js 执行（需安装 Node.js）
    - Python: 使用 Python 解释器执行（需安装 Python 3.x）
    - C: 使用 GCC 编译后执行（需安装 MinGW-w64 或 GCC）
    - Java: 使用 Javac 编译 + JVM 执行（需安装 JDK，主类名必须是 Main）
    - PHP: 使用 PHP 解释器执行（需安装 PHP）

    安全特性：
    - 超时控制（默认10秒，可配置1-60秒）
    - 工作目录隔离（使用临时目录）
    - 临时文件自动清理
    - 完善的错误处理机制

    Args:
        request (CodeExecuteRequest): 包含代码、语言和超时时间的请求体

    Returns:
        dict: 执行结果字典，包含以下字段：
            - success (bool): 是否成功执行
            - output (str): 标准输出内容（如有）
            - error (str): 错误信息（如有错误时）

    Raises:
        HTTPException: 当请求参数验证失败或服务器内部错误时抛出

    示例请求体：
        POST /api/code/execute
        Content-Type: application/json

        {
            "code": "print('Hello, World!')",
            "language": "python",
            "timeout": 10
        }

    成功响应示例：
        {
            "success": true,
            "output": "Hello, World!\n",
            "error": ""
        }

    失败响应示例（语法错误）：
        {
            "success": false,
            "output": "",
            "error": "SyntaxError: invalid syntax..."
        }

    失败响应示例（超时）：
        {
            "success": false,
            "output": "",
            "error": "执行超时（超过 10 秒限制）"
        }
    """
    try:
        # 从请求中提取参数
        code = request.code
        language = request.language
        timeout = request.timeout
        stdin_input = request.stdin

        # 调用 executor 模块执行代码
        result = execute_code(
            code=code,
            language=language,
            timeout=timeout,
            stdin_input=stdin_input
        )

        # 返回执行结果
        return {
            "success": result["success"],
            "output": result["output"],
            "error": result["error"]
        }

    except Exception as e:
        # 捕获未预期的异常，返回500错误
        raise HTTPException(
            status_code=500,
            detail=f"代码执行过程中发生服务器内部错误: {str(e)}"
        )


@router.get("/languages")
async def get_supported_languages():
    """
    获取支持的编程语言列表接口 (GET /api/code/languages)

    返回当前系统支持的编程语言列表及默认配置信息。

    Returns:
        dict: 包含支持的语言列表和默认超时时间：
            - languages (list[str]): 支持的编程语言标识符列表
            - default_timeout (int): 默认超时时间（秒）
            - language_details (dict): 各语言的详细说明

    响应示例：
        {
            "languages": ["javascript", "typescript", "python", "c", "java", "php"],
            "default_timeout": 10,
            "language_details": {
                "javascript": {
                    "display_name": "JavaScript",
                    "runtime": "Node.js",
                    "description": "使用 Node.js 解释器执行 JavaScript 代码"
                },
                ...
            }
        }
    """
    return {
        "languages": [
            "javascript",
            "typescript",
            "python",
            "c",
            "java",
            "php"
        ],
        "default_timeout": 10,
        "language_details": {
            "javascript": {
                "display_name": "JavaScript",
                "runtime": "Node.js",
                "extensions": [".js"],
                "description": "使用 Node.js 解释器执行 JavaScript 代码"
            },
            "typescript": {
                "display_name": "TypeScript",
                "runtime": "Node.js",
                "extensions": [".ts"],
                "description": "使用 Node.js 直接执行 TypeScript 代码（需要 ts-node 或类似工具）"
            },
            "python": {
                "display_name": "Python",
                "runtime": "Python 3.x",
                "extensions": [".py"],
                "description": "使用 Python 解释器执行 Python 代码"
            },
            "c": {
                "display_name": "C",
                "runtime": "GCC (MinGW-w64)",
                "extensions": [".c"],
                "description": "使用 GCC 编译器编译并执行 C 代码"
            },
            "java": {
                "display_name": "Java",
                "runtime": "JDK/JVM",
                "extensions": [".java"],
                "description": "使用 Javac 编译 + JVM 执行 Java 代码（注意：public 类名必须是 Main）"
            },
            "php": {
                "display_name": "PHP",
                "runtime": "PHP CLI",
                "extensions": [".php"],
                "description": "使用 PHP 命令行解释器执行 PHP 代码"
            }
        }
    }
