from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: int
    email: EmailStr
    username: str
    hashed_password: str
    role: Optional[str] = 'student'  # role can be 'student', 'teacher', 'admin', etc.
    created_at: datetime
    updated_at: datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    # role is optional and should typically default to 'student' for regular registrations
    role: Optional[str] = 'student'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
