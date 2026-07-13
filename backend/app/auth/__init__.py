"""Authentication and authorization module.

Provides JWT token management, password hashing, OAuth integration,
API key authentication, and FastAPI dependency injection for route protection.
"""

from app.auth.dependencies import get_current_user, require_auth, verify_api_key
from app.auth.jwt import create_access_token, create_refresh_token, decode_token
from app.auth.password import get_password_hash, verify_password
from app.auth.oauth import get_github_access_token, get_github_user_info
from app.auth.api_key import generate_api_key, verify_api_key_hash

__all__ = [
    "get_current_user",
    "require_auth",
    "verify_api_key",
    "create_access_token",
    "create_refresh_token",
    "decode_token",
    "get_password_hash",
    "verify_password",
    "get_github_access_token",
    "get_github_user_info",
    "generate_api_key",
    "verify_api_key_hash",
]