from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Dict, Optional
from .config import get_settings

security = HTTPBearer()
settings = get_settings()

def verify_jwt(authorization: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """
    Verify JWT token and return user information.
    Handles 'Not enough segments' errors gracefully to prevent server crashes.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = authorization.credentials

    # FIX: Check if token has the 3 segments (header.payload.signature)
    # This prevents the 'ValueError: not enough values to unpack' crash
    if token.count('.') != 2:
        print(f"Malformed token received: {token}")
        raise credentials_exception

    try:
        # Decode JWT using the shared secret
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=["HS256"]
        )

        # Better Auth sometimes uses 'sub' for user_id, let's check both
        user_id: str = payload.get("user_id") or payload.get("sub")
        email: str = payload.get("email")

        if user_id is None:
            raise credentials_exception

        return {"user_id": user_id, "email": email}

    except JWTError as e:
        print(f"JWT Decoding Error: {str(e)}")
        raise credentials_exception
    except Exception as e:
        print(f"Unexpected Auth Error: {str(e)}")
        raise credentials_exception