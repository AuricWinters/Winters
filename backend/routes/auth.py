"""
认证路由模块
提供用户注册、登录、Token 管理等认证相关接口
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
import sys, os, datetime
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import get_db
from models import UserCreate, UserLogin, UserResponse, MessageResponse, SendCodeRequest, CodeLoginRequest, ResetPasswordRequest, SocialLoginRequest, SocialLoginResponse
import crud
import utils

JWT_SECRET = os.environ.get("WINTERS_JWT_SECRET", "dev-secret-do-not-use-in-production")
JWT_ALGORITHM = "HS256"
security = HTTPBearer()

def create_token(user_id: int, account: str) -> str:
    payload = {"user_id": user_id, "account": account, "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return {"user_id": payload["user_id"], "account": payload["account"]}
    except:
        raise HTTPException(401, "无效的认证令牌")

def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """不强制登录，没有 token 返回 None"""
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return {"user_id": payload["user_id"], "account": payload["account"]}
    except:
        return None

# 创建认证路由器，前缀为 /api/auth
router = APIRouter(
    prefix="/api/auth",
    tags=["认证"]
)


@router.get("/status")
async def auth_status():
    """
    认证服务状态检查接口
    返回认证模块的运行状态
    """
    return {
        "module": "认证模块",
        "status": "正常",
        "message": "认证服务已就绪"
    }


@router.post("/register", response_model=MessageResponse)
async def register(user: UserCreate):
    """
    用户注册接口
    
    支持手机号或邮箱注册，验证密码一致性并检查账号唯一性。
    
    Args:
        user: 用户注册数据（包含账号、密码和确认密码）
        
    Returns:
        MessageResponse: 注册结果消息
        
    Raises:
        HTTPException: 
            - 400: 密码不一致或账号已存在
            
    示例请求:
        POST /api/auth/register
        {
            "account": "zhangsan",
            "password": "123456",
            "confirm_password": "123456"
        }
        
    示例响应:
        {"message": "注册成功"}
    """
    # 验证两次输入的密码是否一致
    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="两次输入的密码不一致"
        )
    
    # 获取数据库连接并执行注册逻辑
    with get_db() as db:
        # 检查账号是否已被注册
        existing_user = crud.get_user_by_account(db, user.account)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="该账号已被注册"
            )
        
        # 创建新用户
        crud.create_user(db, user)
    
    return MessageResponse(message="注册成功")


@router.post("/login")
async def login(user: UserLogin):
    """
    用户登录接口
    
    验证账号是否存在以及密码是否正确，返回用户基本信息。
    
    Args:
        user: 用户登录数据（包含账号和密码）
        
    Returns:
        UserResponse: 用户基本信息（不含密码）
        
    Raises:
        HTTPException:
            - 404: 账号不存在
            - 401: 密码错误
            
    示例请求:
        POST /api/auth/login
        {
            "account": "zhangsan",
            "password": "123456"
        }
        
    示例响应:
        {
            "id": 1,
            "account": "zhangsan",
            "created_at": "2024-01-01 12:00:00"
        }
    """
    with get_db() as db:
        # 查询用户是否存在
        db_user = crud.get_user_by_account(db, user.account)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="该账号不存在"
            )
        
        # 验证密码是否正确
        is_valid = crud.verify_password(db, user.account, user.password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="密码错误"
            )

        user_data = dict(db_user)
        user_data.pop("password", None)  # 不返回密码
        return {
            "token": create_token(db_user["id"], db_user["account"]),
            "user": user_data
        }


@router.post("/send-code", response_model=MessageResponse)
async def send_code(request: SendCodeRequest):
    """
    发送验证码接口
    
    向指定手机号发送6位数字验证码，用于登录或密码重置
    
    Args:
        request: 验证码发送请求数据（包含手机号）
        
    Returns:
        MessageResponse: 发送结果消息
        
    示例请求:
        POST /api/auth/send-code
        {"phone": "13800138000"}
        
    示例响应:
        {"message": "验证码发送成功"}
    """
    # 生成验证码
    code = utils.generate_verification_code()
    
    # 存储验证码
    utils.store_verification_code(request.phone, code)
    
    # 模拟发送验证码
    success = utils.send_verification_code(request.phone, code)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="验证码发送失败"
        )
    
    return MessageResponse(message="验证码发送成功")


@router.post("/login/code", response_model=UserResponse)
async def code_login(request: CodeLoginRequest):
    """
    验证码登录接口
    
    通过手机号和验证码进行登录
    
    Args:
        request: 验证码登录请求数据（包含手机号和验证码）
        
    Returns:
        UserResponse: 用户基本信息（不含密码）
        
    Raises:
        HTTPException:
            - 401: 验证码错误或已过期
            - 404: 用户不存在
            
    示例请求:
        POST /api/auth/login/code
        {
            "phone": "13800138000",
            "code": "123456"
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
    # 验证验证码
    if not utils.verify_verification_code(request.phone, request.code):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="验证码错误或已过期"
        )
    
    # 查询用户是否存在
    with get_db() as db:
        # 先尝试通过手机号查询用户
        db_user = crud.get_user_by_phone(db, request.phone)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="该手机号未注册"
            )
        
        # 返回 token
        user_data = dict(db_user)
        user_data.pop("password", None)
        return {"token": create_token(db_user["id"], db_user["account"]), "user": user_data}


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(request: ResetPasswordRequest):
    """
    密码重置接口（使用验证码）
    
    通过手机号和验证码重置密码
    
    Args:
        request: 密码重置请求数据（包含手机号、验证码、新密码和确认密码）
        
    Returns:
        MessageResponse: 密码重置结果消息
        
    Raises:
        HTTPException:
            - 400: 密码不一致
            - 401: 验证码错误或已过期
            - 404: 用户不存在
            
    示例请求:
        POST /api/auth/reset-password
        {
            "phone": "13800138000",
            "code": "123456",
            "new_password": "123456",
            "confirm_password": "123456"
        }
        
    示例响应:
        {"message": "密码重置成功"}
    """
    # 验证两次输入的密码是否一致
    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="两次输入的密码不一致"
        )
    
    # 验证验证码
    if not utils.verify_verification_code(request.phone, request.code):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="验证码错误或已过期"
        )
    
    # 查询用户是否存在
    with get_db() as db:
        # 先尝试通过手机号查询用户
        db_user = crud.get_user_by_phone(db, request.phone)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="该手机号未注册"
            )
        
        # 重置密码
        success = crud.reset_password_by_phone(db, request.phone, request.new_password)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="密码重置失败，用户不存在"
            )


@router.post("/change-password")
async def change_password(request: dict, user=Depends(get_current_user)):
    old_pw = request.get("old_password", "")
    new_pw = request.get("new_password", "")
    if not old_pw or not new_pw or len(new_pw) < 6:
        raise HTTPException(400, "密码至少6位")
    with get_db() as db:
        if not crud.verify_password(db, user["account"], old_pw):
            raise HTTPException(400, "旧密码错误")
        from crud import hash_password
        db.execute("UPDATE users SET password = ? WHERE id = ?", (hash_password(new_pw), user["user_id"]))
        db.commit()
    return {"message": "密码修改成功"}
        
    return MessageResponse(message="密码重置成功")


@router.post("/social/login", response_model=SocialLoginResponse)
async def social_login(request: SocialLoginRequest):
    """
    第三方登录接口
    
    通过第三方登录提供商进行登录
    
    Args:
        request: 第三方登录请求数据（包含提供商和授权码）
        
    Returns:
        SocialLoginResponse: 登录结果，包含用户信息和消息
        
    Raises:
        HTTPException:
            - 400: 无效的提供商
            - 401: 登录失败
            
    示例请求:
        POST /api/auth/social/login
        {
            "provider": "wechat",
            "code": "123456"
        }
        
    示例响应:
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
    # 验证提供商
    if request.provider not in ["wechat", "github"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的第三方登录提供商"
        )
    
    try:
        if request.provider == "wechat":
            user_info = utils.mock_wechat_login(request.code)
            account = f"wechat_{user_info.get('openid','')}"
        elif request.provider == "github":
            user_info = utils.mock_github_login(request.code)
            account = f"github_{user_info.get('id','')}"

        # 查找或创建用户
        with get_db() as db:
            db_user = crud.get_user_by_account(db, account)
            if not db_user:
                from crud import hash_password
                import secrets
                db.execute(
                    "INSERT INTO users (account, password, nickname, phone, email) VALUES (?, ?, ?, ?, ?)",
                    (account, hash_password(secrets.token_hex(16)), user_info.get("nickname",""), "", "")
                )
                db.commit()
                db_user = crud.get_user_by_account(db, account)

            user_data = dict(db_user)
            user_data.pop("password", None)
            return {
                "token": create_token(db_user["id"], db_user["account"]),
                "user": user_data
            }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"第三方登录失败: {str(e)}")


@router.get("/social/callback/{provider}")
async def social_callback(provider: str, code: str):
    """
    第三方登录回调接口（模拟）
    
    模拟第三方登录回调，实际项目中应该处理真实的回调逻辑
    
    Args:
        provider: 第三方登录提供商
        code: 第三方登录授权码
        
    Returns:
        dict: 回调结果
        
    Raises:
        HTTPException:
            - 400: 无效的提供商
            
    示例请求:
        GET /api/auth/social/callback/wechat?code=123456
        
    示例响应:
        {
            "provider": "wechat",
            "code": "123456",
            "message": "回调成功"
        }
    """
    # 验证提供商
    if provider not in ["wechat", "github"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的第三方登录提供商"
        )
    
    # 模拟回调处理
    # 实际项目中应该根据提供商进行相应的处理
    return {
        "provider": provider,
        "code": code,
        "message": "回调成功"
    }
