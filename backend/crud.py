"""
数据库 CRUD 操作模块
提供用户相关的增删改查操作
"""

import sqlite3
from typing import Optional, Dict, Any

# 导入数据模型
from models import UserCreate, UserResponse


def get_user_by_account(db: sqlite3.Connection, account: str) -> Optional[Dict[str, Any]]:
    """
    根据账号查询用户
    
    Args:
        db: 数据库连接对象
        account: 用户账号
        
    Returns:
        Optional[Dict[str, Any]]: 用户字典（如果找到），否则返回 None
        
    示例：
        user = get_user_by_account(db, "zhangsan")
        if user:
            print(f"找到用户: {user['account']}")
    """
    try:
        cursor = db.execute(
            "SELECT id, account, password, created_at FROM users WHERE account = ?",
            (account,)
        )
        user = cursor.fetchone()
        
        if user:
            # 将 sqlite3.Row 转换为字典
            return dict(user)
        return None
        
    except sqlite3.Error as e:
        print(f"[ERROR] 查询用户失败: {e}")
        raise Exception(f"数据库查询错误: {e}")


def create_user(db: sqlite3.Connection, user_data: UserCreate) -> Dict[str, Any]:
    """
    创建新用户
    
    Args:
        db: 数据库连接对象
        user_data: 用户注册数据（包含账号、密码等）
        
    Returns:
        Dict[str, Any]: 新创建的用户字典
        
    Raises:
        Exception: 当账号已存在或数据库操作失败时抛出异常
        
    示例：
        new_user_data = UserCreate(
            account="zhangsan",
            password="123456",
            confirm_password="123456"
        )
        user = create_user(db, new_user_data)
        print(f"用户创建成功: {user['id']}")
    """
    try:
        # 检查账号是否已存在
        existing_user = get_user_by_account(db, user_data.account)
        if existing_user:
            raise ValueError(f"账号 '{user_data.account}' 已存在")
        
        # 插入新用户
        cursor = db.execute(
            """
            INSERT INTO users (account, password) 
            VALUES (?, ?)
            """,
            (user_data.account, user_data.password)
        )
        
        # 获取新创建的用户ID
        user_id = cursor.lastrowid
        
        # 查询并返回完整用户信息
        cursor = db.execute(
            "SELECT id, account, created_at FROM users WHERE id = ?",
            (user_id,)
        )
        new_user = cursor.fetchone()
        
        if new_user:
            print(f"[OK] 用户创建成功: ID={user_id}, 账号={user_data.account}")
            return dict(new_user)
        else:
            raise Exception("用户创建后查询失败")
            
    except ValueError as e:
        print(f"[WARN] 用户创建失败: {e}")
        raise e
    except sqlite3.IntegrityError as e:
        error_msg = str(e)
        if "UNIQUE constraint failed" in error_msg:
            raise ValueError(f"账号 '{user_data.account}' 已被注册")
        print(f"[ERROR] 数据库完整性错误: {e}")
        raise Exception(f"数据库错误: {error_msg}")
    except sqlite3.Error as e:
        print(f"[ERROR] 创建用户失败: {e}")
        raise Exception(f"数据库操作错误: {e}")


def verify_password(db: sqlite3.Connection, account: str, password: str) -> bool:
    """
    验证用户密码是否正确
    
    Args:
        db: 数据库连接对象
        account: 用户账号
        password: 待验证的密码
        
    Returns:
        bool: 密码正确返回 True，否则返回 False
        
    示例：
        is_valid = verify_password(db, "zhangsan", "123456")
        if is_valid:
            print("密码验证通过")
        else:
            print("账号或密码错误")
    """
    try:
        # 查询用户
        user = get_user_by_account(db, account)
        
        if not user:
            print(f"[WARN] 用户不存在: {account}")
            return False
        
        # 验证密码（明文比较，生产环境应使用哈希）
        is_valid = user["password"] == password
        
        if is_valid:
            print(f"[OK] 密码验证成功: {account}")
        else:
            print(f"[FAIL] 密码验证失败: {account}")
            
        return is_valid
        
    except Exception as e:
        print(f"[ERROR] 密码验证异常: {e}")
        return False


def get_all_users(db: sqlite3.Connection, skip: int = 0, limit: int = 100) -> list:
    """
    获取所有用户列表（分页）
    
    Args:
        db: 数据库连接对象
        skip: 跳过的记录数（用于分页）
        limit: 返回的最大记录数
        
    Returns:
        list: 用户字典列表
        
    示例：
        users = get_all_users(db, skip=0, limit=10)
        for user in users:
            print(user['account'])
    """
    try:
        cursor = db.execute(
            """
            SELECT id, account, created_at 
            FROM users 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
            """,
            (limit, skip)
        )
        users = cursor.fetchall()
        
        # 转换为字典列表
        return [dict(user) for user in users]
        
    except sqlite3.Error as e:
        print(f"[ERROR] 查询用户列表失败: {e}")
        raise Exception(f"数据库查询错误: {e}")


def delete_user(db: sqlite3.Connection, user_id: int) -> bool:
    """
    根据ID删除用户
    
    Args:
        db: 数据库连接对象
        user_id: 用户ID
        
    Returns:
        bool: 删除成功返回 True，否则返回 False
        
    示例：
        success = delete_user(db, 1)
        if success:
            print("用户删除成功")
    """
    try:
        cursor = db.execute(
            "DELETE FROM users WHERE id = ?",
            (user_id,)
        )
        
        if cursor.rowcount > 0:
            print(f"[OK] 用户删除成功: ID={user_id}")
            return True
        else:
            print(f"[WARN] 用户不存在: ID={user_id}")
            return False
            
    except sqlite3.Error as e:
        print(f"[ERROR] 删除用户失败: {e}")
        raise Exception(f"数据库操作错误: {e}")


def get_user_by_id(db: sqlite3.Connection, user_id: int) -> Optional[Dict[str, Any]]:
    """
    根据ID获取用户
    
    Args:
        db: 数据库连接对象
        user_id: 用户ID
        
    Returns:
        Optional[Dict[str, Any]]: 用户字典（如果找到），否则返回 None
        
    示例：
        user = get_user_by_id(db, 1)
        if user:
            print(f"找到用户: {user['account']}")
    """
    try:
        cursor = db.execute(
            "SELECT id, account, nickname, phone, email, created_at FROM users WHERE id = ?",
            (user_id,)
        )
        user = cursor.fetchone()
        
        if user:
            return dict(user)
        return None
        
    except sqlite3.Error as e:
        print(f"[ERROR] 查询用户失败: {e}")
        raise Exception(f"数据库查询错误: {e}")


def update_user_profile(db: sqlite3.Connection, user_id: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    更新用户信息
    
    Args:
        db: 数据库连接对象
        user_id: 用户ID
        data: 要更新的用户信息
        
    Returns:
        Optional[Dict[str, Any]]: 更新后的用户字典（如果成功），否则返回 None
        
    示例：
        updated_user = update_user_profile(db, 1, {"nickname": "张三", "phone": "13800138000"})
        if updated_user:
            print(f"用户信息更新成功: {updated_user['nickname']}")
    """
    try:
        # 构建更新语句
        update_fields = []
        update_values = []
        
        if "nickname" in data:
            update_fields.append("nickname = ?")
            update_values.append(data["nickname"])
        if "phone" in data:
            update_fields.append("phone = ?")
            update_values.append(data["phone"])
        if "email" in data:
            update_fields.append("email = ?")
            update_values.append(data["email"])
        
        if not update_fields:
            # 没有需要更新的字段
            return get_user_by_id(db, user_id)
        
        # 执行更新
        update_query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
        update_values.append(user_id)
        
        cursor = db.execute(update_query, update_values)
        
        if cursor.rowcount > 0:
            print(f"[OK] 用户信息更新成功: ID={user_id}")
            return get_user_by_id(db, user_id)
        else:
            print(f"[WARN] 用户不存在: ID={user_id}")
            return None
            
    except sqlite3.Error as e:
        print(f"[ERROR] 更新用户信息失败: {e}")
        raise Exception(f"数据库操作错误: {e}")


def reset_password(db: sqlite3.Connection, account: str, new_password: str) -> bool:
    """
    重置密码
    
    Args:
        db: 数据库连接对象
        account: 用户账号
        new_password: 新密码
        
    Returns:
        bool: 重置成功返回 True，否则返回 False
        
    示例：
        success = reset_password(db, "zhangsan", "654321")
        if success:
            print("密码重置成功")
    """
    try:
        cursor = db.execute(
            "UPDATE users SET password = ? WHERE account = ?",
            (new_password, account)
        )
        
        if cursor.rowcount > 0:
            print(f"[OK] 密码重置成功: 账号={account}")
            return True
        else:
            print(f"[WARN] 用户不存在: 账号={account}")
            return False
            
    except sqlite3.Error as e:
        print(f"[ERROR] 重置密码失败: {e}")
        raise Exception(f"数据库操作错误: {e}")


def get_user_by_phone(db: sqlite3.Connection, phone: str) -> Optional[Dict[str, Any]]:
    """
    根据手机号查询用户
    
    Args:
        db: 数据库连接对象
        phone: 用户手机号
        
    Returns:
        Optional[Dict[str, Any]]: 用户字典（如果找到），否则返回 None
        
    示例：
        user = get_user_by_phone(db, "13800138000")
        if user:
            print(f"找到用户: {user['account']}")
    """
    try:
        cursor = db.execute(
            "SELECT id, account, nickname, phone, email, created_at FROM users WHERE phone = ?",
            (phone,)
        )
        user = cursor.fetchone()
        
        if user:
            return dict(user)
        return None
        
    except sqlite3.Error as e:
        print(f"[ERROR] 查询用户失败: {e}")
        raise Exception(f"数据库查询错误: {e}")


def reset_password_by_phone(db: sqlite3.Connection, phone: str, new_password: str) -> bool:
    """
    根据手机号重置密码
    
    Args:
        db: 数据库连接对象
        phone: 用户手机号
        new_password: 新密码
        
    Returns:
        bool: 重置成功返回 True，否则返回 False
        
    示例：
        success = reset_password_by_phone(db, "13800138000", "654321")
        if success:
            print("密码重置成功")
    """
    try:
        cursor = db.execute(
            "UPDATE users SET password = ? WHERE phone = ?",
            (new_password, phone)
        )
        
        if cursor.rowcount > 0:
            print(f"[OK] 密码重置成功: 手机号={phone}")
            return True
        else:
            print(f"[WARN] 用户不存在: 手机号={phone}")
            return False
            
    except sqlite3.Error as e:
        print(f"[ERROR] 重置密码失败: {e}")
        raise Exception(f"数据库操作错误: {e}")


# ═══ 社区 CRUD ═══

import json

def create_post(db, user_id: int, data) -> dict:
    cursor = db.execute(
        "INSERT INTO posts (user_id, title, content, images, tags, category) VALUES (?,?,?,?,?,?)",
        (user_id, data.title, data.content, data.images or '[]', data.tags or '[]', data.category or 'share')
    )
    post_id = cursor.lastrowid

    # 更新标签统计
    try:
        tags = json.loads(data.tags or '[]')
        for tag in tags:
            db.execute(
                "INSERT INTO tags (name, post_count) VALUES (?, 1) ON CONFLICT(name) DO UPDATE SET post_count = post_count + 1",
                (tag,)
            )
    except: pass

    return get_post_by_id(db, post_id, user_id)

def get_post_by_id(db, post_id: int, viewer_id: int = 0) -> dict:
    row = db.execute("""
        SELECT p.*, COALESCE(u.nickname, u.account) as author_name,
               (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as liked
        FROM posts p LEFT JOIN users u ON p.user_id = u.id
        WHERE p.id = ?
    """, (viewer_id, post_id)).fetchone()
    if not row: return None
    return dict(row)

def get_posts(db, page: int = 1, page_size: int = 20, category: str = '', tag: str = '', viewer_id: int = 0) -> dict:
    where = []
    params = []
    if category and category != 'all':
        where.append("p.category = ?"); params.append(category)
    if tag:
        where.append("p.tags LIKE ?"); params.append(f'%"{tag}"%')
    where_clause = ("WHERE " + " AND ".join(where)) if where else ""

    count = db.execute(f"SELECT COUNT(*) FROM posts p {where_clause}", params).fetchone()[0]
    offset = (page - 1) * page_size

    rows = db.execute(f"""
        SELECT p.*, COALESCE(u.nickname, u.account) as author_name,
               (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as liked
        FROM posts p LEFT JOIN users u ON p.user_id = u.id
        {where_clause}
        ORDER BY p.is_pinned DESC, p.created_at DESC
        LIMIT ? OFFSET ?
    """, [viewer_id] + params + [page_size, offset]).fetchall()

    return {
        "posts": [dict(r) for r in rows],
        "total": count,
        "page": page,
        "has_more": offset + page_size < count
    }

def update_post(db, post_id: int, user_id: int, data: dict) -> dict:
    sets = []; params = []
    for k in ['title','content','images','tags','category']:
        if k in data:
            sets.append(f"{k} = ?"); params.append(data[k])
    if not sets: return get_post_by_id(db, post_id, user_id)
    sets.append("updated_at = CURRENT_TIMESTAMP")
    params += [post_id, user_id]
    db.execute(f"UPDATE posts SET {', '.join(sets)} WHERE id = ? AND user_id = ?", params)
    return get_post_by_id(db, post_id, user_id)

def delete_post(db, post_id: int, user_id: int) -> bool:
    c = db.execute("DELETE FROM posts WHERE id = ? AND user_id = ?", (post_id, user_id))
    return c.rowcount > 0

def toggle_like(db, user_id: int, post_id: int) -> dict:
    existing = db.execute("SELECT id FROM likes WHERE user_id = ? AND post_id = ?", (user_id, post_id)).fetchone()
    if existing:
        db.execute("DELETE FROM likes WHERE id = ?", (existing['id'],))
        db.execute("UPDATE posts SET likes_count = MAX(0, likes_count - 1) WHERE id = ?", (post_id,))
        liked = False
    else:
        db.execute("INSERT INTO likes (user_id, post_id) VALUES (?,?)", (user_id, post_id))
        db.execute("UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?", (post_id,))
        liked = True
    post = get_post_by_id(db, post_id, user_id)
    return {"liked": liked, "likes_count": post['likes_count'] if post else 0}

def create_comment(db, user_id: int, post_id: int, data) -> dict:
    db.execute(
        "INSERT INTO comments (post_id, user_id, parent_id, content) VALUES (?,?,?,?)",
        (post_id, user_id, data.parent_id, data.content)
    )
    db.execute("UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?", (post_id,))
    return {"message": "评论成功"}

def get_comments(db, post_id: int) -> list:
    rows = db.execute("""
        SELECT c.*, COALESCE(u.nickname, u.account) as author_name
        FROM comments c LEFT JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ? ORDER BY c.created_at ASC
    """, (post_id,)).fetchall()
    comments = [dict(r) for r in rows]
    # 嵌套：parent_id → replies
    comment_map = {c['id']: {**c, 'replies': []} for c in comments}
    roots = []
    for c in comments:
        if c['parent_id'] and c['parent_id'] in comment_map:
            comment_map[c['parent_id']]['replies'].append(comment_map[c['id']])
        else:
            roots.append(comment_map[c['id']])
    return roots

def get_hot_tags(db, limit: int = 20) -> list:
    rows = db.execute("SELECT name, post_count FROM tags ORDER BY post_count DESC LIMIT ?", (limit,)).fetchall()
    return [dict(r) for r in rows]

# 测试代码
if __name__ == "__main__":
    from database import init_db, get_db
    
    # 初始化数据库
    init_db()
    
    # 测试 CRUD 操作
    with get_db() as db:
        # 创建测试用户
        test_user = UserCreate(
            account="testuser",
            password="123456",
            confirm_password="123456"
        )
        
        try:
            user = create_user(db, test_user)
            print(f"\n创建的用户: {user}")
            
            # 查询用户
            found_user = get_user_by_account(db, "testuser")
            print(f"查询到的用户: {found_user}")
            
            # 验证密码
            is_valid = verify_password(db, "testuser", "123456")
            print(f"密码验证结果: {is_valid}")
            
            # 获取所有用户
            all_users = get_all_users(db)
            print(f"\n所有用户数量: {len(all_users)}")
            
        except Exception as e:
            print(f"\n测试失败: {e}")
