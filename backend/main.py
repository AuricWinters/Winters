"""
FastAPI 后端主应用入口
提供 API 服务、CORS 跨域支持和路由挂载
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 导入数据库模块
import database

# 导入路由模块
from routes.auth import router as auth_router
from routes.code import router as code_router
from routes.user import router as user_router
from routes.websocket import router as ws_router
from routes.community import router as community_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    应用生命周期管理器
    在应用启动时初始化数据库
    """
    # 启动时：初始化数据库表结构
    print("\n[START] 正在启动 Winters Backend API...")
    database.init_db()
    print("[OK] 应用启动完成\n")
    
    yield  # 应用运行中
    
    # 关闭时：清理资源（如果需要）
    print("\n[STOP] 正在关闭 Winters Backend API...")


# 创建 FastAPI 应用实例（使用 lifespan 管理生命周期）
app = FastAPI(
    title="Winters Backend API",
    description="Winters 项目后端服务",
    version="0.5.3",
    lifespan=lifespan  # 注册生命周期管理器
)

# 配置 CORS 中间件，允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源（生产环境应限制为具体域名）
    allow_credentials=True,  # 允许携带凭证
    allow_methods=["*"],  # 允许所有 HTTP 方法
    allow_headers=["*"],  # 允许所有请求头
)

# 挂载路由模块
app.include_router(auth_router)
app.include_router(code_router)
app.include_router(user_router)  # 用户信息相关路由
app.include_router(ws_router)  # WebSocket 交互式代码执行路由
app.include_router(community_router)  # AI 社区动态路由


# 基本健康检查端点
@app.get("/")
async def health_check():
    """
    健康检查接口
    返回服务状态信息
    """
    return {
        "status": "running",
        "message": "Winters Backend API 服务正常运行",
        "version": "1.0.0"
    }


# 启动命令：uvicorn main:app --host 0.0.0.0 --port 8000 --reload
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
