from datetime import datetime, timedelta
from typing import Optional
from jwt import PyJWTError, encode, decode
from passlib.context import CryptContext
from fastapi import HTTPException, status
from database import get_db_connection
from models.user import User, TokenData

# JWT Configuration
SECRET_KEY = "your-secret-key-here"  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token. `data` may include standard claims like 'sub' and custom claims such as 'role'.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def authenticate_user(email: str, password: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user_row = cursor.fetchone()

        if not user_row:
            return False
        if not verify_password(password, user_row["hashed_password"]):
            return False

        # Return a User model including role (default to 'student' if column missing)
        role = user_row['role'] if 'role' in user_row.keys() and user_row['role'] else 'student'
        return User(
            id=user_row['id'],
            username=user_row['username'],
            email=user_row['email'],
            hashed_password=user_row['hashed_password'],
            role=role,
            created_at=datetime.fromisoformat(user_row['created_at']),
            updated_at=datetime.fromisoformat(user_row['updated_at'])
        )
    finally:
        conn.close()

async def get_current_user(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=payload.get('role'))
    except PyJWTError:
        raise credentials_exception

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM users WHERE email = ?", (token_data.email,))
        user_row = cursor.fetchone()

        if user_row is None:
            raise credentials_exception

        # Read role from DB (fallback to token role if DB missing column)
        role = None
        # sqlite3.Row supports keys() in this project; safe to access
        if 'role' in user_row.keys():
            role = user_row['role']
        if not role and token_data.role:
            role = token_data.role
        if not role:
            role = 'student'

        return User(
            id=user_row['id'],
            username=user_row['username'],
            email=user_row['email'],
            hashed_password=user_row['hashed_password'],
            role=role,
            created_at=datetime.fromisoformat(user_row['created_at']),
            updated_at=datetime.fromisoformat(user_row['updated_at'])
        )
    finally:
        conn.close()


def require_roles(*allowed_roles):
    """
    Returns a dependency function usable with Depends(require_roles('teacher', 'admin'))
    The inner function will return the current_user if authorized, otherwise raise 403.
    """
    from fastapi import Depends

    async def role_checker(current_user: User = Depends(get_current_user)):
        user_role = getattr(current_user, 'role', None)
        if not user_role:
            # Treat missing role as student
            user_role = 'student'
        if allowed_roles and user_role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
        return current_user

    return role_checker
