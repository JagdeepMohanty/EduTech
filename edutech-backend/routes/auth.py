from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
import json
from database import get_db_connection
from models.user import User, UserCreate, UserLogin, Token
from schemas.auth import UserCreate as UserCreateSchema, UserLogin as UserLoginSchema
from utils.auth import authenticate_user, create_access_token, get_password_hash, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register", response_model=User)
async def register(user: UserCreateSchema):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")

        cursor.execute("SELECT id FROM users WHERE username = ?", (user.username,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Username already taken")

        # Hash the password
        hashed_password = get_password_hash(user.password)

        # Create user record (role defaults to 'student')
        created_at = datetime.utcnow().isoformat()
        updated_at = created_at
        role = user.role if getattr(user, 'role', None) else 'student'

        cursor.execute("""
            INSERT INTO users (username, email, hashed_password, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user.username, user.email, hashed_password, role, created_at, updated_at))

        user_id = cursor.lastrowid
        conn.commit()

        # Return created user
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user_row = cursor.fetchone()

        return User(
            id=user_row['id'],
            username=user_row['username'],
            email=user_row['email'],
            hashed_password=user_row['hashed_password'],
            role=user_row['role'] if 'role' in user_row.keys() else 'student',
            created_at=datetime.fromisoformat(user_row['created_at']),
            updated_at=datetime.fromisoformat(user_row['updated_at'])
        )
    finally:
        conn.close()

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # Include role in the token payload so frontend can read it (and backend can rely on it)
    access_token = create_access_token(
        data={"sub": user.email, "role": getattr(user, 'role', 'student')},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
