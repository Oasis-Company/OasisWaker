"""FastAPI dependency injection for authentication and authorization.

Supports two authentication modes:
1. **JWT Bearer token** — via ``Authorization: Bearer <token>`` header.
2. **API Key** — via ``Authorization: Bearer <api_key>`` header.

The ``get_current_user`` dependency tries both strategies sequentially.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.api_key import verify_api_key_hash
from app.auth.jwt import decode_token
from app.database import get_session
from app.models.user import User

_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> User:
    """Resolve the current authenticated user from the request.

    Tries JWT Bearer token first, then API Key.  Raises 401 if neither
    is valid or present.

    Returns:
        The authenticated ``User`` ORM instance.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # ── Try JWT first ────────────────────────────────────────────────────
    payload = decode_token(token)
    if payload is not None and payload.get("type") == "access":
        user_id: str = payload["sub"]
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user is not None and user.is_active:
            return user

    # ── Then try API Key ─────────────────────────────────────────────────
    if token.startswith("ow_"):
        from app.models.api_key import APIKey

        prefix = token[:8]
        result = await db.execute(
            select(APIKey).where(
                APIKey.key_prefix == prefix,
                APIKey.is_active == True,  # noqa: E712
            )
        )
        api_key = result.scalar_one_or_none()
        if api_key is not None and verify_api_key_hash(token, api_key.hashed_key):
            # Check expiry (handle offset-naive SQLite datetime)
            now = datetime.now(timezone.utc)
            exp = api_key.expires_at
            if exp is not None:
                if exp.tzinfo is None:
                    exp = exp.replace(tzinfo=timezone.utc)
                if exp < now:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="API Key has expired",
                    )
            # Update last_used_at
            api_key.last_used_at = datetime.now(timezone.utc)
            await db.flush()

            # Fetch user
            result = await db.execute(
                select(User).where(User.id == api_key.user_id)
            )
            user = result.scalar_one_or_none()
            if user is not None and user.is_active:
                return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def require_auth(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Strict dependency — ensures the user is authenticated.

    Unlike ``get_current_user``, this can be used as a final gate
    when the caller needs to guarantee the user was resolved.
    """
    return current_user


async def verify_api_key(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> User | None:
    """Optional dependency — returns the user if a valid API Key is present.

    Returns ``None`` if no credentials are provided (does not raise).
    Useful for endpoints that optionally authenticate.
    """
    if credentials is None:
        return None

    token = credentials.credentials
    if not token.startswith("ow_"):
        return None

    from app.models.api_key import APIKey

    prefix = token[:8]
    result = await db.execute(
        select(APIKey).where(
            APIKey.key_prefix == prefix,
            APIKey.is_active == True,  # noqa: E712
        )
    )
    api_key = result.scalar_one_or_none()
    if api_key is None or not verify_api_key_hash(token, api_key.hashed_key):
        return None

    if api_key.expires_at is not None:
        exp = api_key.expires_at
        if exp.tzinfo is None:
            exp = exp.replace(tzinfo=timezone.utc)
        if exp < datetime.now(timezone.utc):
            return None

    api_key.last_used_at = datetime.now(timezone.utc)
    await db.flush()

    result = await db.execute(select(User).where(User.id == api_key.user_id))
    return result.scalar_one_or_none()