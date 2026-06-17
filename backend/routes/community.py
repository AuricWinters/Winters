"""AI 社区动态 API"""
from fastapi import APIRouter, Query, HTTPException
from database import get_db
from models import PostCreate, CommentCreate, LikeRequest
import crud

router = APIRouter(prefix="/api", tags=["community"])

# 这里固定 viewer_id=1（当前用户），后续接入真正的认证后改为从 session 获取
DEFAULT_USER_ID = 1

@router.get("/posts")
def list_posts(page: int = 1, category: str = '', tag: str = ''):
    with get_db() as db:
        return crud.get_posts(db, page=page, category=category, tag=tag, viewer_id=DEFAULT_USER_ID)

@router.get("/posts/{post_id}")
def get_post(post_id: int):
    with get_db() as db:
        post = crud.get_post_by_id(db, post_id, DEFAULT_USER_ID)
        if not post: raise HTTPException(404, "动态不存在")
        return post

@router.post("/posts")
def create_post(data: PostCreate):
    with get_db() as db:
        return crud.create_post(db, DEFAULT_USER_ID, data)

@router.put("/posts/{post_id}")
def update_post(post_id: int, data: dict):
    with get_db() as db:
        return crud.update_post(db, post_id, DEFAULT_USER_ID, data)

@router.delete("/posts/{post_id}")
def delete_post(post_id: int):
    with get_db() as db:
        ok = crud.delete_post(db, post_id, DEFAULT_USER_ID)
        if not ok: raise HTTPException(404, "动态不存在或无权删除")
        return {"message": "已删除"}

@router.post("/posts/{post_id}/like")
def toggle_like(post_id: int):
    with get_db() as db:
        return crud.toggle_like(db, DEFAULT_USER_ID, post_id)

@router.get("/posts/{post_id}/comments")
def list_comments(post_id: int):
    with get_db() as db:
        return crud.get_comments(db, post_id)

@router.post("/posts/{post_id}/comments")
def create_comment(post_id: int, data: CommentCreate):
    with get_db() as db:
        return crud.create_comment(db, DEFAULT_USER_ID, post_id, data)

@router.get("/tags")
def hot_tags():
    with get_db() as db:
        return crud.get_hot_tags(db)
