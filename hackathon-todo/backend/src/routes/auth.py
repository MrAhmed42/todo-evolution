from fastapi import APIRouter, HTTPException, status, Depends
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
from ..db import get_session
from ..models import User, UserBase
from ..config import get_settings
from ..auth import verify_jwt
from pydantic import BaseModel

router = APIRouter()

settings = get_settings()


class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str


class SignInRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str


class SignInResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class TokenData(BaseModel):
    user_id: str
    email: str


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)  # Default 15 minutes
    to_encode.update({"exp": expire.timestamp()})
    encoded_jwt = jwt.encode(to_encode, settings.better_auth_secret, algorithm="HS256")
    return encoded_jwt


@router.post("/auth/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(signup_data: SignUpRequest, session: Session = Depends(get_session)):
    """Create a new user account"""
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == signup_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Create new user
    user = User(
        email=signup_data.email,
        name=signup_data.name
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return UserResponse(id=user.id, email=user.email, name=user.name)


@router.post("/auth/signin", response_model=SignInResponse)
def signin(signin_data: SignInRequest, session: Session = Depends(get_session)):
    """Authenticate user and return JWT token"""
    # Find user by email
    user = session.exec(select(User).where(User.email == signin_data.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # In a real implementation, you would hash and verify passwords
    # For now, we'll just accept any password (this is just for the demo)
    # TODO: Implement proper password hashing in production

    # Create access token
    access_token_expires = timedelta(days=7)  # Token expires in 7 days
    access_token = create_access_token(
        data={"user_id": user.id, "email": user.email},
        expires_delta=access_token_expires
    )

    return SignInResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(id=user.id, email=user.email, name=user.name)
    )


@router.post("/auth/signout")
def signout():
    """Invalidate user session"""
    # In a real implementation, you might add the token to a blacklist
    # For now, we'll just return a success message
    return {"message": "Successfully signed out"}


@router.get("/auth/me", response_model=UserResponse)
def get_current_user(current_user: dict = Depends(verify_jwt), session: Session = Depends(get_session)):
    """Get current authenticated user info"""
    # Get user from database using the user_id from JWT
    user = session.exec(select(User).where(User.id == current_user["user_id"])).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists"
        )

    return UserResponse(id=user.id, email=user.email, name=user.name)