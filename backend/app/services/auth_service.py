"""Authentication business logic — user registration, login, API key management."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.api_key import generate_api_key
from app.auth.jwt import create_access_token, create_refresh_token, decode_token
from app.auth.password import get_password_hash, verify_password
from app.config import settings
from app.models.api_key import APIKey
from app.models.project import Project
from app.models.user import User


class AuthService:
    """Stateless service for authentication operations."""

    @staticmethod
    async def register_user(
        db: AsyncSession, email: str, password: str, full_name: str | None = None
    ) -> tuple[User, str, str]:
        """Register a new user and create a default project.

        Returns:
            A tuple of ``(user, access_token, refresh_token)``.

        Raises:
            ValueError: If the email is already registered.
        """
        # Check for existing user
        result = await db.execute(select(User).where(User.email == email))
        if result.scalar_one_or_none() is not None:
            raise ValueError(f"Email '{email}' is already registered")

        # Create user
        hashed = get_password_hash(password)
        user = User(
            email=email,
            hashed_password=hashed,
            full_name=full_name,
            storage_quota_bytes=settings.default_storage_quota_bytes,
        )
        db.add(user)
        await db.flush()

        # Create default project
        project = Project(
            user_id=user.id,
            name="Default",
            description="Default project — all nodes are assigned here by default",
            is_default=True,
        )
        db.add(project)
        await db.flush()

        # Generate tokens
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        return user, access_token, refresh_token

    @staticmethod
    async def authenticate_user(
        db: AsyncSession, email: str, password: str
    ) -> tuple[User, str, str] | None:
        """Authenticate a user with email and password.

        Returns:
            A tuple of ``(user, access_token, refresh_token)``, or ``None``
            if the credentials are invalid.
        """
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if user is None or not verify_password(password, user.hashed_password):
            return None

        if not user.is_active:
            return None

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        return user, access_token, refresh_token

    @staticmethod
    async def refresh_token(
        db: AsyncSession, token: str
    ) -> tuple[User, str, str] | None:
        """Refresh an access token using a valid refresh token.

        Returns:
            A tuple of ``(user, access_token, new_refresh_token)``, or
            ``None`` if the refresh token is invalid or expired.
        """
        payload = decode_token(token)
        if payload is None or payload.get("type") != "refresh":
            return None

        user_id = payload["sub"]
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if user is None or not user.is_active:
            return None

        access_token = create_access_token(user.id)
        new_refresh_token = create_refresh_token(user.id)
        return user, access_token, new_refresh_token

    @staticmethod
    async def create_or_update_oauth_user(
        db: AsyncSession, github_info: dict[str, Any]
    ) -> tuple[User, str, str]:
        """Create or update a user from GitHub OAuth data.

        Returns:
            A tuple of ``(user, access_token, refresh_token)``.
        """
        github_id = github_info["github_id"]
        result = await db.execute(
            select(User).where(User.github_id == github_id)
        )
        user = result.scalar_one_or_none()

        if user is None:
            # Create new user
            user = User(
                email=github_info.get("email") or f"github-{github_id}@placeholder.com",
                hashed_password="",  # OAuth users have no password
                full_name=github_info.get("name"),
                avatar_url=github_info.get("avatar_url"),
                github_id=github_id,
                storage_quota_bytes=settings.default_storage_quota_bytes,
            )
            db.add(user)
            await db.flush()

            # Create default project
            project = Project(
                user_id=user.id,
                name="Default",
                description="Default project",
                is_default=True,
            )
            db.add(project)
            await db.flush()
        else:
            # Update existing user's info
            if github_info.get("name"):
                user.full_name = github_info["name"]
            if github_info.get("avatar_url"):
                user.avatar_url = github_info["avatar_url"]
            await db.flush()

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        return user, access_token, refresh_token

    @staticmethod
    async def create_api_key(
        db: AsyncSession, user: User, name: str
    ) -> tuple[APIKey, str]:
        """Create a new API key for a user.

        Returns:
            A tuple of ``(api_key_record, full_key_string)``.
            The full key is only returned once.
        """
        full_key, prefix, hashed_key = generate_api_key()
        expires_at = datetime.now(timezone.utc) + timedelta(
            days=settings.api_key_expire_days
        )

        api_key = APIKey(
            user_id=user.id,
            name=name,
            key_prefix=prefix,
            hashed_key=hashed_key,
            expires_at=expires_at,
        )
        db.add(api_key)
        await db.flush()
        await db.refresh(api_key)

        return api_key, full_key

    @staticmethod
    async def list_api_keys(
        db: AsyncSession, user: User
    ) -> list[APIKey]:
        """List all active API keys for a user."""
        result = await db.execute(
            select(APIKey)
            .where(APIKey.user_id == user.id)
            .order_by(APIKey.created_at.desc())
        )
        return list(result.scalars().all())

    @staticmethod
    async def revoke_api_key(
        db: AsyncSession, user: User, key_id: str
    ) -> bool:
        """Revoke (soft-delete) an API key.

        Returns:
            ``True`` if the key was found and revoked, ``False`` otherwise.
        """
        result = await db.execute(
            select(APIKey).where(
                APIKey.id == key_id,
                APIKey.user_id == user.id,
            )
        )
        api_key = result.scalar_one_or_none()
        if api_key is None:
            return False

        api_key.is_active = False
        await db.flush()
        return True