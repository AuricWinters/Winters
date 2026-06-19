"""
数据模型定义模块
使用 Pydantic BaseModel 定义请求和响应的数据结构
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """
    用户基础模型
    包含用户的基本账号信息
    
    示例：
        {"account": "zhangsan"}
    """
    account: str = Field(
        ..., 
        min_length=3, 
        max_length=50,
        description="用户账号",
        example="zhangsan"
    )
    nickname: Optional[str] = Field(
        default=None,
        max_length=50,
        description="用户昵称",
        example="张三"
    )
    phone: Optional[str] = Field(
        default=None,
        pattern="^1[3-9]\d{9}$",
        description="手机号码",
        example="13800138000"
    )
    email: Optional[str] = Field(
        default=None,
        pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
        description="电子邮箱",
        example="zhangsan@example.com"
    )


class UserCreate(UserBase):
    """
    用户注册模型
    继承 UserBase，添加密码字段用于新用户注册
    
    示例：
        {
            "account": "zhangsan",
            "password": "123456",
            "confirm_password": "123456"
        }
    """
    password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        description="用户密码（至少6位）",
        example="123456"
    )
    confirm_password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        description="确认密码（必须与密码一致）",
        example="123456"
    )
    nickname: str = Field(None, max_length=50, description="用户昵称")
    phone: str = Field(None, max_length=20, description="手机号")
    email: str = Field(None, max_length=100, description="邮箱")


class UserLogin(UserBase):
    """
    用户登录模型
    用于用户登录验证
    
    示例：
        {
            "account": "zhangsan",
            "password": "123456"
        }
    """
    password: str = Field(
        ...,
        description="登录密码",
        example="123456"
    )


class UserResponse(BaseModel):
    """
    用户响应模型
    用于 API 响应，返回用户基本信息（不包含密码）
    
    示例：
        {
            "id": 1,
            "account": "zhangsan",
            "nickname": "张三",
            "phone": "13800138000",
            "email": "zhangsan@example.com",
            "created_at": "2024-01-01 12:00:00"
        }
    """
    id: int = Field(
        ...,
        description="用户唯一标识ID",
        example=1
    )
    account: str = Field(
        ...,
        description="用户账号",
        example="zhangsan"
    )
    nickname: Optional[str] = Field(
        default=None,
        description="用户昵称",
        example="张三"
    )
    phone: Optional[str] = Field(
        default=None,
        description="手机号码",
        example="13800138000"
    )
    email: Optional[str] = Field(
        default=None,
        description="电子邮箱",
        example="zhangsan@example.com"
    )
    created_at: str = Field(
        ...,
        description="账户创建时间",
        example="2024-01-01 12:00:00"
    )

    class Config:
        """Pydantic 配置"""
        from_attributes = True  # 允许从 ORM 对象创建（Pydantic V2）


class UserProfileUpdate(BaseModel):
    """
    用户信息更新模型
    用于用户更新个人信息
    
    示例：
        {
            "nickname": "张三",
            "phone": "13800138000",
            "email": "zhangsan@example.com"
        }
    """
    nickname: Optional[str] = Field(
        default=None,
        max_length=50,
        description="用户昵称",
        example="张三"
    )
    phone: Optional[str] = Field(
        default=None,
        pattern="^1[3-9]\d{9}$",
        description="手机号码",
        example="13800138000"
    )
    email: Optional[str] = Field(
        default=None,
        pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
        description="电子邮箱",
        example="zhangsan@example.com"
    )


class MessageResponse(BaseModel):
    """
    通用消息响应模型
    用于返回操作结果消息

    示例：
        {"message": "操作成功"}
    """
    message: str = Field(
        ...,
        description="响应消息",
        example="操作成功"
    )


class CodeExecuteRequest(BaseModel):
    """
    代码执行请求模型
    用于接收用户提交的代码执行请求

    示例：
        {
            "code": 'print("Hello, World!")',
            "language": "python",
            "timeout": 10
        }
    """
    code: str = Field(
        ...,
        min_length=1,
        max_length=50000,
        description="要执行的源代码（最大50KB）",
        example='print("Hello, World!")'
    )
    language: str = Field(
        ...,
        pattern="^(javascript|typescript|arkts|python|c|java|php)$",
        description="编程语言 (支持: javascript, typescript, arkts, python, c, java, php)",
        example="python"
    )
    timeout: int = Field(
        default=10,
        ge=1,
        le=60,
        description="执行超时时间（秒），范围1-60秒，默认10秒",
        example=10
    )
    stdin: Optional[str] = Field(
        default=None,
        max_length=10000,
        description="标准输入内容（用于 scanf、input() 等交互式输入，每行一个值）",
        example="85\n"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    'code': 'print("Hello, World!")',
                    'language': 'python',
                    'timeout': 10
                },
                {
                    'code': 'console.log("Hello from JavaScript!");',
                    'language': 'javascript',
                    'timeout': 15
                },
                {
                    'code': '''#include <stdio.h>
int main() {
    printf("Hello from C!\n");
    return 0;
}''',
                    'language': 'c',
                    'timeout': 20
                }
            ]
        }
    }


class SendCodeRequest(BaseModel):
    """
    验证码发送请求模型
    用于发送验证码到用户手机
    
    示例：
        {"phone": "13800138000"}
    """
    phone: str = Field(
        ...,
        pattern="^1[3-9]\d{9}$",
        description="手机号码",
        example="13800138000"
    )


class CodeLoginRequest(BaseModel):
    """
    验证码登录请求模型
    用于通过验证码登录
    
    示例：
        {
            "phone": "13800138000",
            "code": "123456"
        }
    """
    phone: str = Field(
        ...,
        pattern="^1[3-9]\d{9}$",
        description="手机号码",
        example="13800138000"
    )
    code: str = Field(
        ...,
        min_length=6,
        max_length=6,
        pattern="^\d{6}$",
        description="6位数字验证码",
        example="123456"
    )


class ResetPasswordRequest(BaseModel):
    """
    密码重置请求模型
    用于通过验证码重置密码
    
    示例：
        {
            "phone": "13800138000",
            "code": "123456",
            "new_password": "123456",
            "confirm_password": "123456"
        }
    """
    phone: str = Field(
        ...,
        pattern="^1[3-9]\d{9}$",
        description="手机号码",
        example="13800138000"
    )
    code: str = Field(
        ...,
        min_length=6,
        max_length=6,
        pattern="^\d{6}$",
        description="6位数字验证码",
        example="123456"
    )
    new_password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        description="新密码（至少6位）",
        example="123456"
    )
    confirm_password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        description="确认密码（必须与新密码一致）",
        example="123456"
    )


class SocialLoginRequest(BaseModel):
    """
    第三方登录请求模型
    用于第三方登录认证
    
    示例：
        {
            "provider": "wechat",
            "code": "123456"
        }
    """
    provider: str = Field(
        ...,
        pattern="^(wechat|github)$",
        description="第三方登录提供商",
        example="wechat"
    )
    code: str = Field(
        ...,
        description="第三方登录授权码",
        example="123456"
    )


# ═══ 社区模型 ═══

class PostCreate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=200)
    content: str = Field(..., min_length=1, max_length=50000)
    images: Optional[str] = Field(default='[]', max_length=5000)
    tags: Optional[str] = Field(default='[]', max_length=1000)
    category: Optional[str] = Field(default='share')

class PostResponse(BaseModel):
    id: int
    user_id: int
    title: Optional[str] = None
    content: str
    images: str = '[]'
    tags: str = '[]'
    category: str = 'share'
    likes_count: int = 0
    comments_count: int = 0
    views_count: int = 0
    is_pinned: int = 0
    created_at: str
    updated_at: str
    author_name: Optional[str] = None
    liked: bool = False
    class Config: from_attributes = True

class CommentCreate(BaseModel):
    parent_id: Optional[int] = None
    content: str = Field(..., min_length=1, max_length=2000)

class CommentResponse(BaseModel):
    id: int
    post_id: int
    user_id: int
    parent_id: Optional[int] = None
    content: str
    created_at: str
    author_name: Optional[str] = None
    replies: list = []
    class Config: from_attributes = True

class LikeRequest(BaseModel):
    post_id: int

class TagResponse(BaseModel):
    name: str
    post_count: int

class PostListResponse(BaseModel):
    posts: list
    total: int
    page: int
    has_more: bool

class SocialLoginResponse(BaseModel):
    """
    第三方登录响应模型
    用于返回第三方登录结果
    
    示例：
        {
            "user": {
                "id": 1,
                "account": "wechat_123456",
                "nickname": "微信用户",
                "created_at": "2024-01-01 12:00:00"
            },
            "message": "登录成功"
        }
    """
    user: UserResponse
    message: str = Field(
        ...,
        description="登录结果消息",
        example="登录成功"
    )
