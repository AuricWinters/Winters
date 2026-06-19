"""AI 社区动态 API"""
from fastapi import APIRouter, Query, HTTPException, Depends
from database import get_db
from models import PostCreate, CommentCreate, LikeRequest
import crud
from routes.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/api", tags=["community"])

@router.get("/posts")
def list_posts(page: int = 1, category: str = '', tag: str = '', user=Depends(get_optional_user)):
    viewer_id = user["user_id"] if user else 0
    with get_db() as db:
        return crud.get_posts(db, page=page, category=category, tag=tag, viewer_id=viewer_id)

@router.get("/posts/{post_id}")
def get_post(post_id: int, user=Depends(get_optional_user)):
    viewer_id = user["user_id"] if user else 0
    with get_db() as db:
        post = crud.get_post_by_id(db, post_id, viewer_id)
        if not post: raise HTTPException(404, "动态不存在")
        return post

@router.post("/posts")
def create_post(data: PostCreate, user=Depends(get_current_user)):
    with get_db() as db:
        return crud.create_post(db, user["user_id"], data)

@router.put("/posts/{post_id}")
def update_post(post_id: int, data: dict, user=Depends(get_current_user)):
    with get_db() as db:
        return crud.update_post(db, post_id, user["user_id"], data)

@router.delete("/posts/{post_id}")
def delete_post(post_id: int, user=Depends(get_current_user)):
    with get_db() as db:
        ok = crud.delete_post(db, post_id, user["user_id"])
        if not ok: raise HTTPException(404, "动态不存在或无权删除")
        return {"message": "已删除"}

@router.post("/posts/{post_id}/like")
def toggle_like(post_id: int, user=Depends(get_current_user)):
    with get_db() as db:
        return crud.toggle_like(db, user["user_id"], post_id)

@router.get("/posts/{post_id}/comments")
def list_comments(post_id: int):
    with get_db() as db:
        return crud.get_comments(db, post_id)

@router.post("/posts/{post_id}/comments")
def create_comment(post_id: int, data: CommentCreate, user=Depends(get_current_user)):
    with get_db() as db:
        return crud.create_comment(db, user["user_id"], post_id, data)

@router.get("/tags")
def hot_tags():
    with get_db() as db:
        return crud.get_hot_tags(db)
