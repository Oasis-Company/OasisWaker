"""Authentication routes — signup, login, refresh, GitHub OAuth, API keys."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.auth.oauth import get_github_access_token, get_github_user_info
from app.database import get_session
from app.models.user import User
from app.schemas.auth import (
    ApiKeyCreated,
    ApiKeyCreate,
    ApiKeyRead,
    GithubAuthRequest,
    LoginRequest,
    RefreshRequest,
    SignupRequest,
    TokenResponse,
    UserRead,
)
from app.services.auth_service import AuthService
from app.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post(
    "/signup",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    data: SignupRequest,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> TokenResponse:
    """Register a new user with email and password.

    Returns a fresh access token and refresh token on success.
    """
    try:
        user, access_token, refresh_token = await AuthService.register_user(
            db, data.email, data.password, data.full_name
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    data: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> TokenResponse:
    """Authenticate with email and password.

    Returns a fresh access token and refresh token on success.
    """
    result = await AuthService.authenticate_user(
        db, data.email, data.password
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user, access_token, refresh_token = result
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_tokens(
    data: RefreshRequest,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> TokenResponse:
    """Get a new access token (and new refresh token) using a refresh token."""
    result = await AuthService.refresh_token(db, data.refresh_token)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user, access_token, refresh_token = result
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/github/callback", response_model=TokenResponse)
async def github_callback(
    data: GithubAuthRequest,
    db: Annotated[AsyncSession, Depends(get_session)],
) -> TokenResponse:
    """Handle GitHub OAuth callback.

    Exchanges the authorization code for an access token, fetches the
    user's profile, and creates or updates the user in the database.
    Returns a fresh OasisWaker access/refresh token pair.
    """
    if not settings.github_client_id or not settings.github_client_secret:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="GitHub OAuth is not configured on this server",
        )

    access_token = await get_github_access_token(data.code)
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GitHub authorization code",
        )

    github_info = await get_github_user_info(access_token)
    if github_info is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to fetch user information from GitHub",
        )

    user, access_token, refresh_token = await AuthService.create_or_update_oauth_user(
        db, github_info
    )
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.get("/me", response_model=UserRead)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserRead:
    """Get information about the currently authenticated user."""
    return UserRead.model_validate(current_user)


@router.post("/api-keys", response_model=ApiKeyCreated)
async def create_api_key(
    data: ApiKeyCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> ApiKeyCreated:
    """Create a new API key for the current user.

    Returns the full key exactly once — the client must store it immediately.
    Only the bcrypt hash is stored in the database.
    """
    api_key, full_key = await AuthService.create_api_key(db, current_user, data.name)
    return ApiKeyCreated(
        id=api_key.id,
        name=api_key.name,
        key_prefix=api_key.key_prefix,
        last_used_at=api_key.last_used_at,
        expires_at=api_key.expires_at,
        created_at=api_key.created_at,
        full_key=full_key,
    )


@router.get("/api-keys", response_model=list[ApiKeyRead])
async def list_api_keys(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> list[ApiKeyRead]:
    """List all active API keys for the current user.

    Full keys are not included for security — only the 8-character prefix.
    """
    keys = await AuthService.list_api_keys(db, current_user)
    return [
        ApiKeyRead(
            id=k.id,
            name=k.name,
            key_prefix=k.key_prefix,
            last_used_at=k.last_used_at,
            expires_at=k.expires_at,
            created_at=k.created_at,
        )
        for k in keys
    ]


@router.delete("/api-keys/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_api_key(
    key_id: str,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_session)],
) -> None:
    """Revoke (soft-delete) an API key. Revoked keys cannot be used."""
    success = await AuthService.revoke_api_key(db, current_user, key_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"API key '{key_id}' not found",
        )