"""JWT token creation and verification."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings


def create_access_token(subject: str) -> str:
    """Create a short-lived JWT access token.

    Args:
        subject: The user ID (or other unique identifier) to embed in the token.

    Returns:
        A signed JWT string with ``sub``, ``exp``, ``iat``, and ``type`` claims.
    """
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
        "iat": now,
        "type": "access",
    }
    return jwt.encode(
        payload, settings.secret_key, algorithm=settings.jwt_algorithm
    )


def create_refresh_token(subject: str) -> str:
    """Create a long-lived JWT refresh token.

    Args:
        subject: The user ID to embed in the token.

    Returns:
        A signed JWT string with ``sub``, ``exp``, ``iat``, and ``type`` claims.
    """
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "exp": now + timedelta(days=settings.refresh_token_expire_days),
        "iat": now,
        "type": "refresh",
    }
    return jwt.encode(
        payload, settings.secret_key, algorithm=settings.jwt_algorithm
    )


def decode_token(token: str) -> dict | None:
    """Decode and validate a JWT token.

    Args:
        token: The raw JWT string.

    Returns:
        The decoded payload dict, or ``None`` if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        return payload
    except JWTError:
        return None