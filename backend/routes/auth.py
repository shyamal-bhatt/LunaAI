from datetime import datetime, timedelta, timezone
import logging
from typing import Any, Dict, Optional, Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt  # pyright: ignore[reportMissingModuleSource]
from passlib.context import CryptContext  # pyright: ignore[reportMissingModuleSource]
from pydantic import BaseModel, EmailStr, Field

from supadb.client import supabase


logger = logging.getLogger(__name__)


# Password hashing configuration
# Use Argon2 (argon2id) which is modern, memory-hard, and avoids bcrypt backend issues
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
)


# JWT configuration
JWT_SECRET_KEY = "change-this-in-env"  # will be overridden by env if set
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60 * 24  # 24 hours


class SignupRequest(BaseModel):
    first_name: Annotated[str, Field(
        min_length=1,
        description="User's given name",
        examples=["Aanya"],
    )]
    last_name: Annotated[Optional[str], Field(
        default=None,
        description="User's family name (optional)",
        examples=["Sharma"],
    )]
    email: Annotated[EmailStr, Field(
        description="Email used as login identifier",
        examples=["aanya@example.com"],
    )]
    password: Annotated[str, Field(
        min_length=6,
        description="Plaintext password that will be bcrypt-hashed on the server",
        examples=["strongPass123"],
    )]


class LoginRequest(BaseModel):
    email: Annotated[EmailStr, Field(
        description="Registered email",
        examples=["aanya@example.com"],
    )]
    password: Annotated[str, Field(
        description="Plaintext password for verification",
        examples=["strongPass123"],
    )]


class UserPublic(BaseModel):
    user_id: Annotated[int, Field(description="Numeric primary key of the user", examples=[101])]
    user_email: Annotated[EmailStr, Field(description="User's registered email", examples=["aanya@example.com"])]
    first_name: Annotated[str, Field(description="User's given name", examples=["Aanya"])]
    last_name: Annotated[Optional[str], Field(default=None, description="User's family name", examples=["Sharma"])]
    created_at: Annotated[Optional[datetime], Field(default=None, description="Creation timestamp in UTC")]


class TokenResponse(BaseModel):
    access_token: Annotated[str, Field(description="JWT access token")]
    token_type: Annotated[str, Field(default="bearer", description="OAuth2 token type")] = "bearer"
    user: Annotated[UserPublic, Field(description="Authenticated user's public profile")]


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def get_password_hash(password: str) -> str:
    """Hash a plaintext password using Argon2 (argon2id)."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against its Argon2 hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token for a given subject payload.

    subject is typically {"sub": user_id, "email": user_email}
    """
    expire = datetime.now(tz=timezone.utc) + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode = {"exp": expire, **subject}
    secret = jwt_secret()
    token = jwt.encode(to_encode, secret, algorithm=JWT_ALGORITHM)
    return token


def jwt_secret() -> str:
    """Resolve JWT secret from environment with fallback."""
    import os

    return os.getenv("JWT_SECRET_KEY", JWT_SECRET_KEY)


def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate a JWT, returning its payload.

    Raises HTTPException if invalid/expired.
    """
    logger.debug("Decoding JWT | len=%s", len(token))
    try:
        payload = jwt.decode(token, jwt_secret(), algorithms=[JWT_ALGORITHM])
        logger.debug("JWT decoded | keys=%s", list(payload.keys()))
        return payload
    except JWTError as exc:
        logger.warning("JWT decode failed | error=%s", exc)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> UserPublic:
    """Dependency to retrieve current user from Authorization: Bearer token."""
    data = decode_access_token(token)
    logger.debug("Token payload | sub=%s email=%s", data.get("sub"), data.get("email"))

    # Fetch user to verify existence and build public model
    result = (
        supabase
        .table("Users")
        .select("user_id, user_email, first_name, last_name, created_at")
        .eq("user_id", data.get("sub"))
        .maybe_single()
        .execute()
    )
    if not result.data:
        logger.info("Token user not found | sub=%s", data.get("sub"))
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = UserPublic(**result.data)
    logger.debug("Resolved current user | user_id=%s email=%s", user.user_id, user.user_email)
    return user


@router.post("/signup", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest) -> UserPublic:
    """Create a user in Supabase.

    - Checks if email exists
    - Hashes password before storing
    - Returns the public user model
    """
    print(payload)
    logger.info("Signup attempt | email=%s", payload.email)

    # Check if user exists (use list response to avoid maybe_single edge-cases)
    logger.debug("Checking existing user | email=%s", payload.email)
    existing = (
        supabase
        .table("Users")
        .select("user_id")
        .eq("user_email", payload.email)
        .limit(1)
        .execute()
    )
    print(existing)
    logger.debug("Existing user lookup raw | result=%s", getattr(existing, "__dict__", existing))
    existing_rows = (existing.data or []) if hasattr(existing, "data") else []
    print(existing_rows)
    if existing_rows:
        logger.info("Signup rejected: email already exists | email=%s", payload.email)
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    hashed_pwd = get_password_hash(payload.password)
    logger.debug("Password hashed | hash_prefix=%s", hashed_pwd[:15])

    insert_data = {
        "user_email": str(payload.email),
        "user_pwd": hashed_pwd,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
    }
    logger.debug("Inserting user | insert_data_keys=%s", list(insert_data.keys()))
    print(insert_data)
    insert_res = (
        supabase
        .table("Users")
        .insert(insert_data)
        .execute()
    )
    logger.debug("Insert result raw | result=%s", getattr(insert_res, "__dict__", insert_res))
    if getattr(insert_res, "error", None):
        logger.error("Supabase insert failed | email=%s | error=%s", payload.email, insert_res.error)
        raise HTTPException(status_code=500, detail="Failed to create user")

    # Fetch the inserted user to return a clean public model
    fetch_res = (
        supabase
        .table("Users")
        .select("user_id, user_email, first_name, last_name, created_at")
        .eq("user_email", payload.email)
        .limit(1)
        .execute()
    )
    print(fetch_res)
    logger.debug("Fetch-after-insert raw | result=%s", getattr(fetch_res, "__dict__", fetch_res))
    rows = (fetch_res.data or []) if hasattr(fetch_res, "data") else []
    if not rows:
        logger.error("Inserted user not found after insert | email=%s", payload.email)
        raise HTTPException(status_code=500, detail="Failed to fetch created user")

    user = UserPublic(**rows[0])
    logger.info("Signup success | user_id=%s email=%s", user.user_id, user.user_email)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    """Authenticate user, verify password, and issue JWT.

    Returns access token and basic user profile.
    """
    logger.info("Login attempt | email=%s", payload.email)

    # Fetch user record (use list response for robustness)
    logger.debug("Fetching user by email | email=%s", payload.email)
    result = (
        supabase
        .table("Users")
        .select("user_id, user_email, user_pwd, first_name, last_name, created_at")
        .eq("user_email", payload.email)
        .limit(1)
        .execute()
    )
    logger.debug("Fetch result raw | result=%s", getattr(result, "__dict__", result))
    rows = (result.data or []) if hasattr(result, "data") else []
    if not rows:
        logger.info("Login failed: user not found | email=%s", payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_row = rows[0]
    logger.debug("Verifying password | user_id=%s", user_row.get("user_id"))
    if not verify_password(payload.password, user_row.get("user_pwd", "")):
        logger.info("Login failed: invalid password | email=%s", payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_public = UserPublic(
        user_id=user_row["user_id"],
        user_email=user_row["user_email"],
        first_name=user_row.get("first_name"),
        last_name=user_row.get("last_name"),
        created_at=user_row.get("created_at"),
    )

    token = create_access_token({"sub": str(user_public.user_id), "email": str(user_public.user_email)})
    logger.debug("Access token created | length=%s", len(token))
    logger.info("Login success | user_id=%s email=%s", user_public.user_id, user_public.user_email)

    return TokenResponse(access_token=token, user=user_public)


@router.post("/token", response_model=TokenResponse)
def token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> TokenResponse:
    """OAuth2 compatible token endpoint.

    Accepts application/x-www-form-urlencoded form with username/password fields.
    Returns a bearer token and user profile on success.
    """
    logger.info("Token request | username=%s", form_data.username)

    # Fetch user by email (username is email for our app)
    logger.debug("Fetching user by email (oauth) | email=%s", form_data.username)
    result = (
        supabase
        .table("Users")
        .select("user_id, user_email, user_pwd, first_name, last_name, created_at")
        .eq("user_email", form_data.username)
        .limit(1)
        .execute()
    )
    logger.debug("Fetch result (oauth) raw | result=%s", getattr(result, "__dict__", result))
    rows = (result.data or []) if hasattr(result, "data") else []
    if not rows:
        logger.info("Token request failed: user not found | email=%s", form_data.username)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_row = rows[0]
    if not verify_password(form_data.password, user_row.get("user_pwd", "")):
        logger.info("Token request failed: invalid credentials | email=%s", form_data.username)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_public = UserPublic(
        user_id=user_row["user_id"],
        user_email=user_row["user_email"],
        first_name=user_row.get("first_name"),
        last_name=user_row.get("last_name"),
        created_at=user_row.get("created_at"),
    )

    token_str = create_access_token({"sub": str(user_public.user_id), "email": str(user_public.user_email)})
    logger.debug("Access token (oauth) created | length=%s", len(token_str))
    logger.info("Token issued | user_id=%s email=%s", user_public.user_id, user_public.user_email)
    return TokenResponse(access_token=token_str, user=user_public)

