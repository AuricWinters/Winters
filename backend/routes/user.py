"""
用户路由模块
提供用户个人信息相关接口
"""

from fastapi import APIRouter, HTTPException, status
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import UserResponse, UserProfileUpdate, MessageResponse
import crud

# 创建用户路由器，前缀为 /api/user
router = APIRouter(
    prefix="/api/user",
    tags=["用户"]  # 用于 Swagger 文档分组
)


@router.get("/profile", response_model=UserResponse)
def get_profile(user_id: int):
    """
    获取个人信息接口
    
    根据用户ID获取个人详细信息
    
    Args:
        user_id: 用户ID
        
    Returns:
        UserResponse: 用户详细信息
        
    Raises:
        HTTPException:
            - 404: 用户不存在
            
    示例请求:
        GET /api/user/profile?user_id=1
        
    示例响应:
        {
            "id": 1,
            "account": "zhangsan",
            "nickname": "张三",
            "phone": "13800138000",
            "email": "zhangsan@example.com",
            "created_at": "2024-01-01 12:00:00"
        }
    """
    with get_db() as db:
        user = crud.get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        return UserResponse(
            id=user["id"],
            account=user["account"],
            nickname=user.get("nickname"),
            phone=user.get("phone"),
            email=user.get("email"),
            created_at=user["created_at"]
        )


@router.put("/profile", response_model=UserResponse)
def update_profile(user_id: int, profile_data: UserProfileUpdate):
    """
    更新个人信息接口
    
    更新用户的个人信息，包括昵称、手机号和邮箱
    
    Args:
        user_id: 用户ID
        profile_data: 要更新的个人信息
        
    Returns:
        UserResponse: 更新后的用户详细信息
        
    Raises:
        HTTPException:
            - 404: 用户不存在
            
    示例请求:
        PUT /api/user/profile?user_id=1
        {
            "nickname": "张三",
            "phone": "13800138000",
            "email": "zhangsan@example.com"
        }
        
    示例响应:
        {
            "id": 1,
            "account": "zhangsan",
            "nickname": "张三",
            "phone": "13800138000",
            "email": "zhangsan@example.com",
            "created_at": "2024-01-01 12:00:00"
        }
    """
    with get_db() as db:
        # 构建更新数据字典
        update_data = {}
        if profile_data.nickname is not None:
            update_data["nickname"] = profile_data.nickname
        if profile_data.phone is not None:
            update_data["phone"] = profile_data.phone
        if profile_data.email is not None:
            update_data["email"] = profile_data.email
        
        updated_user = crud.update_user_profile(db, user_id, update_data)
        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )
        return UserResponse(
            id=updated_user["id"],
            account=updated_user["account"],
            nickname=updated_user.get("nickname"),
            phone=updated_user.get("phone"),
            email=updated_user.get("email"),
            created_at=updated_user["created_at"]
        )
