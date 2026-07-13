"""Password hashing and verification using passlib + bcrypt."""

from __future__ import annotations

from passlib.context import CryptContext

_pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a bcrypt hash.

    Args:
        plain_password: The password to check.
        hashed_password: The stored bcrypt hash.

    Returns:
        ``True`` if the password matches the hash.
    """
    return _pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a plain-text password using bcrypt.

    Args:
        password: The password to hash.

    Returns:
        A bcrypt hash string.
    """
    return _pwd_context.hash(password)