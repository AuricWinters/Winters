"""
工具函数模块
包含验证码生成、存储、验证和发送等功能
"""

import random
import time
from typing import Dict, Optional

# 内存存储验证码，格式: {phone: (code, expire_time)}
verification_codes: Dict[str, tuple] = {}

# 验证码有效期（秒）
CODE_EXPIRY = 300  # 5分钟


def generate_verification_code() -> str:
    """
    生成6位数字验证码
    
    Returns:
        str: 6位数字验证码
    """
    return ''.join(random.choices('0123456789', k=6))


def store_verification_code(phone: str, code: str) -> None:
    """
    存储验证码到内存
    
    Args:
        phone: 手机号码
        code: 验证码
    """
    # 计算过期时间
    expire_time = time.time() + CODE_EXPIRY
    verification_codes[phone] = (code, expire_time)


def verify_verification_code(phone: str, code: str) -> bool:
    """
    验证验证码是否有效
    
    Args:
        phone: 手机号码
        code: 验证码
    
    Returns:
        bool: 验证码是否有效
    """
    # 检查验证码是否存在
    if phone not in verification_codes:
        return False
    
    # 获取存储的验证码和过期时间
    stored_code, expire_time = verification_codes[phone]
    
    # 检查验证码是否过期
    if time.time() > expire_time:
        # 删除过期的验证码
        del verification_codes[phone]
        return False
    
    # 检查验证码是否匹配
    if stored_code != code:
        return False
    
    # 验证成功后删除验证码（防止重复使用）
    del verification_codes[phone]
    return True


def send_verification_code(phone: str, code: str) -> bool:
    """
    模拟发送验证码
    
    Args:
        phone: 手机号码
        code: 验证码
    
    Returns:
        bool: 发送是否成功
    """
    # 这里只是模拟发送，实际项目中需要调用短信服务商的API
    print(f"向 {phone} 发送验证码: {code}")
    return True


def mock_wechat_login(code: str) -> dict:
    """
    模拟微信登录
    
    Args:
        code: 微信授权码
    
    Returns:
        dict: 模拟的用户信息
    """
    # 模拟微信登录成功，返回用户信息
    # 实际项目中应该调用微信API获取用户信息
    return {
        "openid": f"wechat_{code}",
        "nickname": "微信用户",
        "avatar": "https://example.com/avatar/wechat.jpg"
    }


def mock_github_login(code: str) -> dict:
    """
    模拟 GitHub 登录
    
    Args:
        code: GitHub 授权码
    
    Returns:
        dict: 模拟的用户信息
    """
    # 模拟 GitHub 登录成功，返回用户信息
    # 实际项目中应该调用 GitHub API 获取用户信息
    return {
        "id": f"github_{code}",
        "login": f"github_user_{code}",
        "name": "GitHub 用户",
        "avatar_url": "https://example.com/avatar/github.jpg"
    }


def create_or_update_social_user(provider: str, provider_id: str, user_info: dict) -> dict:
    """
    创建或更新第三方用户
    
    Args:
        provider: 第三方登录提供商
        provider_id: 第三方用户ID
        user_info: 第三方用户信息
    
    Returns:
        dict: 用户信息
    """
    # 生成账号名：provider_provider_id
    account = f"{provider}_{provider_id}"
    
    # 提取昵称
    if provider == "wechat":
        nickname = user_info.get("nickname", "微信用户")
    elif provider == "github":
        nickname = user_info.get("name", user_info.get("login", "GitHub 用户"))
    else:
        nickname = f"{provider} 用户"
    
    # 模拟用户数据
    # 实际项目中应该操作数据库，创建或更新用户
    return {
        "account": account,
        "nickname": nickname,
        "provider": provider,
        "provider_id": provider_id
    }
