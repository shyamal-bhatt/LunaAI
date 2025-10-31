from datetime import datetime
import logging
from typing import Optional, Annotated

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from supadb.client import supabase
from .auth import UserPublic  # reuse model

logger = logging.getLogger(__name__)

router = APIRouter()


class UpsertUserRequest(BaseModel):
    email: Annotated[EmailStr, Field(description="User email", examples=["aanya@example.com"])]
    first_name: Annotated[str, Field(description="Given name", examples=["Aanya"])]
    last_name: Annotated[Optional[str], Field(default=None, description="Family name", examples=["Sharma"])]
    password: Annotated[str, Field(description="Plaintext password to store (no hashing for debugging)", examples=["strongPass123"])]


@router.post("/upsert", response_model=UserPublic, status_code=status.HTTP_200_OK)
def upsert_user(payload: UpsertUserRequest) -> UserPublic:
    """Create a row in Users if it doesn't exist. Return existing otherwise.

    For debugging: stores plaintext password (no hashing).
    """
    logger.info("Users upsert | email=%s first_name=%s", payload.email, payload.first_name)

    # Check for existing user
    existing = (
        supabase.table("Users").select("user_id, user_email, first_name, last_name, created_at").eq("user_email", payload.email).limit(1).execute()
    )
    rows = (existing.data or []) if hasattr(existing, "data") else []
    if rows:
        user = UserPublic(**rows[0])
        logger.info("Users upsert hit existing | user_id=%s", user.user_id)
        return user

    # Store plaintext password (no hashing for debugging)
    logger.debug("Storing plaintext password | email=%s", payload.email)

    insert_data = {
        "user_email": str(payload.email),
        "user_pwd": payload.password,  # Plaintext password
        "first_name": payload.first_name,
        "last_name": payload.last_name,
    }
    logger.debug("Insert data prepared | keys=%s", list(insert_data.keys()))

    ins = supabase.table("Users").insert(insert_data).execute()
    logger.debug("Insert result raw | error=%s data=%s", getattr(ins, "error", None), getattr(ins, "data", None))
    
    # Check for Supabase errors - it returns error in the response object
    if hasattr(ins, "error") and ins.error is not None:
        error_msg = str(ins.error) if ins.error else "Unknown Supabase error"
        logger.error("Users upsert insert failed | email=%s | error=%s", payload.email, error_msg)
        raise HTTPException(status_code=500, detail=f"Failed to upsert user: {error_msg}")
    
    # Also check if data is None or empty - Supabase sometimes returns empty data on error
    if not hasattr(ins, "data") or ins.data is None or len(ins.data) == 0:
        logger.error("Users upsert insert returned no data | email=%s | result=%s", payload.email, ins)
        raise HTTPException(status_code=500, detail="Failed to upsert user: No data returned from database")

    # Fetch and return
    fetch = (
        supabase.table("Users").select("user_id, user_email, first_name, last_name, created_at").eq("user_email", payload.email).limit(1).execute()
    )
    rows2 = (fetch.data or []) if hasattr(fetch, "data") else []
    if not rows2:
        logger.error("Users upsert fetch missing | email=%s", payload.email)
        raise HTTPException(status_code=500, detail="Failed to fetch user")

    user = UserPublic(**rows2[0])
    logger.info("Users upsert created | user_id=%s email=%s", user.user_id, user.user_email)
    return user


class VerifyPasswordRequest(BaseModel):
    email: Annotated[EmailStr, Field(description="User email", examples=["aanya@example.com"])]
    password: Annotated[str, Field(description="Plaintext password to verify", examples=["strongPass123"])]


@router.post("/verify-password", response_model=UserPublic)
def verify_user_password(payload: VerifyPasswordRequest) -> UserPublic:
    """Verify password against Users table and return user if valid.

    For debugging: compares plaintext passwords (no hashing).
    This is used for legacy users who exist in Users table but not in Supabase Auth.
    Returns the user profile if password matches; raises 401 if invalid.
    """
    logger.info("Password verification against Users table | email=%s", payload.email)

    result = (
        supabase
        .table("Users")
        .select("user_id, user_email, user_pwd, first_name, last_name, created_at")
        .eq("user_email", payload.email)
        .limit(1)
        .execute()
    )
    rows = (result.data or []) if hasattr(result, "data") else []
    if not rows:
        logger.info("Password verification failed: user not found | email=%s", payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_row = rows[0]
    stored_pwd = user_row.get("user_pwd", "")
    
    # Plaintext comparison for debugging
    logger.debug("Password comparison | provided_len=%s stored_len=%s", len(payload.password), len(stored_pwd))
    if payload.password != stored_pwd:
        logger.info("Password verification failed: incorrect password | email=%s", payload.email)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user = UserPublic(
        user_id=user_row["user_id"],
        user_email=user_row["user_email"],
        first_name=user_row.get("first_name"),
        last_name=user_row.get("last_name"),
        created_at=user_row.get("created_at"),
    )
    logger.info("Password verification successful | user_id=%s email=%s", user.user_id, user.user_email)
    return user


