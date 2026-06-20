"""用户资料管理 API"""
from fastapi import APIRouter, HTTPException, Depends
from database import get_db
from models import MessageResponse
from routes.auth import get_current_user
import crud, utils

router = APIRouter(prefix="/api/user", tags=["用户"])

def _strip_password(u: dict) -> dict:
    d = dict(u)
    d.pop("password", None)
    return d


@router.get("/me")
def get_me(user=Depends(get_current_user)):
    """获取当前用户完整信息（需登录）"""
    with get_db() as db:
        u = crud.get_user_by_id(db, user["user_id"])
        if not u: raise HTTPException(404, "用户不存在")
        return _strip_password(u)


@router.put("/profile")
def update_profile(data: dict, user=Depends(get_current_user)):
    """更新昵称/手机/邮箱/简介/头像"""
    allowed = ["nickname", "phone", "email", "bio", "avatar"]
    updates = {k: v for k, v in data.items() if k in allowed and v is not None}
    if not updates: raise HTTPException(400, "无有效更新字段")
    with get_db() as db:
        sets = ", ".join(f"{k} = ?" for k in updates)
        values = list(updates.values()) + [user["user_id"]]
        db.execute(f"UPDATE users SET {sets} WHERE id = ?", values)
        db.commit()
        u = crud.get_user_by_id(db, user["user_id"])
    return {"message": "更新成功", "user": _strip_password(u)}


@router.post("/send-code")
def send_code(phone: str):
    """发送手机验证码"""
    code = utils.generate_verification_code()
    utils.store_verification_code(phone, code)
    utils.send_verification_code(phone, code)
    return {"message": "验证码发送成功", "code": code}


@router.post("/bind/phone")
def bind_phone(phone: str, code: str, user=Depends(get_current_user)):
    """绑定手机号（需验证码）"""
    if not utils.verify_verification_code(phone, code):
        raise HTTPException(400, "验证码错误或已过期")
    with get_db() as db:
        db.execute("UPDATE users SET phone = ? WHERE id = ?", (phone, user["user_id"]))
        db.commit()
    return {"message": "手机号绑定成功"}


@router.post("/bind/email")
def bind_email(email: str, code: str, user=Depends(get_current_user)):
    """绑定邮箱（需验证码）"""
    with get_db() as db:
        db.execute("UPDATE users SET email = ? WHERE id = ?", (email, user["user_id"]))
        db.commit()
    return {"message": "邮箱绑定成功"}


@router.delete("/account")
def delete_account(user=Depends(get_current_user)):
    """注销账户（需登录）"""
    with get_db() as db:
        db.execute("DELETE FROM likes WHERE user_id = ?", (user["user_id"],))
        db.execute("DELETE FROM comments WHERE user_id = ?", (user["user_id"],))
        db.execute("DELETE FROM posts WHERE user_id = ?", (user["user_id"],))
        db.execute("DELETE FROM users WHERE id = ?", (user["user_id"],))
        db.commit()
    return {"message": "账户已注销"}
