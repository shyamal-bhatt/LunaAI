import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv  # type: ignore
from supabase import Client, create_client  # type: ignore


def _load_env() -> None:
    """Load environment variables from backend/supadb/.env if present."""
    env_path = Path(__file__).resolve().parent / ".env"
    load_dotenv(env_path)


def get_supabase_client() -> Client:
    """Create and return a configured Supabase client.

    Reads SUPABASE_URL and SUPABASE_KEY from environment variables.
    """
    _load_env()
    supabase_url: Optional[str] = os.getenv("SUPABASE_URL")
    # Prefer service role key on the backend to bypass RLS (server-side only!)
    service_key: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    anon_key: Optional[str] = os.getenv("SUPABASE_KEY")

    if not supabase_url or not (service_key or anon_key):
        raise RuntimeError("SUPABASE_URL and at least one of SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY must be set")

    key_in_use = service_key or anon_key
    if service_key is None:
        # Using anon key on backend may hit RLS; prefer service key in production
        print("[supabase] WARNING: Using anon key on backend; RLS may block writes. Set SUPABASE_SERVICE_ROLE_KEY.")

    return create_client(supabase_url, key_in_use)


# Module-level singleton for convenience
supabase: Client = get_supabase_client()