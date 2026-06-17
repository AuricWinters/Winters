"""
数据库配置模块
提供 SQLite 数据库连接和初始化功能
"""

import sqlite3
import os
from contextlib import contextmanager
from typing import Generator

# 数据库文件路径
DATABASE_PATH = os.path.join(os.path.dirname(__file__), "data", "winters.db")

# 确保数据目录存在
os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)


@contextmanager
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """
    获取数据库连接（上下文管理器）
    
    使用方式：
        with get_db() as db:
            cursor = db.execute("SELECT * FROM users")
    
    Returns:
        Generator[sqlite3.Connection]: 数据库连接生成器
    """
    conn = sqlite3.connect(DATABASE_PATH)
    try:
        # 启用外键约束
        conn.execute("PRAGMA foreign_keys = ON")
        # 返回行作为字典（方便访问）
        conn.row_factory = sqlite3.Row
        yield conn
        conn.commit()  # 无异常时提交事务
    except Exception as e:
        conn.rollback()  # 异常时回滚事务
        raise e
    finally:
        conn.close()


def init_db() -> None:
    """
    初始化数据库表结构
    在应用启动时调用，确保所有必要的表已创建
    """
    with get_db() as db:
        # 创建用户表
        db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 用户ID，自增主键
                account TEXT UNIQUE NOT NULL,           -- 用户账号，唯一且不能为空
                password TEXT NOT NULL,                 -- 用户密码，不能为空
                nickname TEXT,                          -- 用户昵称
                phone TEXT,                             -- 手机号码
                email TEXT,                             -- 电子邮箱
                created_at TEXT DEFAULT CURRENT_TIMESTAMP  -- 创建时间，默认当前时间戳
            )
        """)
        
        # 为已存在的表添加新字段（如果不存在）
        try:
            db.execute("ALTER TABLE users ADD COLUMN nickname TEXT")
        except sqlite3.OperationalError:
            pass  # 字段已存在
        
        try:
            db.execute("ALTER TABLE users ADD COLUMN phone TEXT")
        except sqlite3.OperationalError:
            pass  # 字段已存在
        
        try:
            db.execute("ALTER TABLE users ADD COLUMN email TEXT")
        except sqlite3.OperationalError:
            pass  # 字段已存在
        
        # 创建索引以提高查询性能（按账号查询）
        db.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_account 
            ON users(account)
        """)
        
        # 创建动态/帖子表
        db.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT,
                content TEXT NOT NULL,
                images TEXT DEFAULT '[]',
                tags TEXT DEFAULT '[]',
                category TEXT DEFAULT 'share',
                likes_count INTEGER DEFAULT 0,
                comments_count INTEGER DEFAULT 0,
                views_count INTEGER DEFAULT 0,
                is_pinned INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        # 创建评论表
        db.execute("""
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                post_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                parent_id INTEGER,
                content TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts(id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (parent_id) REFERENCES comments(id)
            )
        """)

        # 创建点赞表
        db.execute("""
            CREATE TABLE IF NOT EXISTS likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                post_id INTEGER NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id),
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (post_id) REFERENCES posts(id)
            )
        """)

        # 创建标签统计表
        db.execute("""
            CREATE TABLE IF NOT EXISTS tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                post_count INTEGER DEFAULT 0
            )
        """)

        print(f"[OK] 数据库初始化完成: {DATABASE_PATH}")


# 模块导入时自动初始化数据库（可选，也可在 main.py 中手动调用）
if __name__ == "__main__":
    init_db()
