"""API Key generation and verification."""

from __future__ import annotations

import secrets
import string

from passlib.context import CryptContext

_api_key_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

API_KEY_PREFIX = "ow_"


def generate_api_key() -> tuple[str, str, str]:
    """Generate a new API key with prefix.

    Returns:
        A tuple of ``(full_key, prefix, hashed_key)``.
        - ``full_key``: The full API key (shown to user once).
        - ``prefix``: The first 8 characters (``ow_`` + 5 chars, for display).
        - ``hashed_key``: The bcrypt hash of the full key (stored in DB).
    """
    random_part = "".join(secrets.choice(string.ascii_letters + string.digits) for _ in range(40))
    full_key = f"{API_KEY_PREFIX}{random_part}"
    prefix = full_key[:8]
    hashed_key = _api_key_context.hash(full_key)
    return full_key, prefix, hashed_key


def verify_api_key_hash(full_key: str, hashed_key: str) -> bool:
    """Verify a plain API key against its stored bcrypt hash.

    Args:
        full_key: The full API key to verify.
        hashed_key: The stored bcrypt hash.

    Returns:
        ``True`` if the key matches the hash.
    """
    return _api_key_context.verify(full_key, hashed_key)