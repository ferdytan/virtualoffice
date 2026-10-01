import os
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional

from core.config import (
    BASE_DIR,
    DATA_DIR,
    OPENAI_API_KEY,
    OPENAI_MODEL_NAME,
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
    LLM_PROVIDER,
    ORIN_API_TOKEN,
    ORIN_API_URL,
    get_env_cleaned
)

logger = logging.getLogger("virtual_office.config_manager")

SETTINGS_FILE = DATA_DIR / "settings.json"

# In-memory settings cache
_SETTINGS_CACHE: Optional[Dict[str, Any]] = None


def get_default_settings() -> Dict[str, Any]:
    """Provides defaults populated from environment variables."""
    return {
        "TELEGRAM_BOT_TOKEN": get_env_cleaned("TELEGRAM_BOT_TOKEN", ""),
        "TELEGRAM_OWNER_CHAT_ID": get_env_cleaned("TELEGRAM_OWNER_CHAT_ID", ""),
        "ORIN_API_TOKEN": ORIN_API_TOKEN or get_env_cleaned("ORIN_API_TOKEN", ""),
        "ORIN_API_URL": ORIN_API_URL or "https://admin-api.orin.id/api/devices/offline",
        "OPENAI_API_KEY": OPENAI_API_KEY or get_env_cleaned("OPENAI_API_KEY", ""),
        "OPENAI_MODEL_NAME": OPENAI_MODEL_NAME or get_env_cleaned("OPENAI_MODEL_NAME", "gpt-4o-mini"),
        "OLLAMA_BASE_URL": OLLAMA_BASE_URL or get_env_cleaned("OLLAMA_BASE_URL", "http://172.17.0.1:11434"),
        "OLLAMA_MODEL": OLLAMA_MODEL or get_env_cleaned("OLLAMA_MODEL", "gemma3:12b"),
        "LLM_PROVIDER": LLM_PROVIDER or get_env_cleaned("LLM_PROVIDER", "ollama"),
        "COO_AUTONOMY_LEVEL": get_env_cleaned("COO_AUTONOMY_LEVEL", "full"),  # full | supervised
        "NOTIFY_ON_TASK_DONE": True
    }


def load_settings(force_reload: bool = False) -> Dict[str, Any]:
    """Loads settings from settings.json, merging with defaults."""
    global _SETTINGS_CACHE
    if _SETTINGS_CACHE is not None and not force_reload:
        return _SETTINGS_CACHE

    settings = get_default_settings()

    if SETTINGS_FILE.is_file():
        try:
            with open(SETTINGS_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
                if isinstance(saved, dict):
                    settings.update(saved)
        except Exception as e:
            logger.error(f"Failed to read settings from {SETTINGS_FILE}: {e}")

    _SETTINGS_CACHE = settings
    return _SETTINGS_CACHE


def mask_secret(value: str) -> str:
    """Masks secret tokens (e.g. 123456789:ABC... -> 1234...wxyz)."""
    if not value or value.startswith("your_"):
        return ""
    val = str(value).strip()
    if len(val) <= 8:
        return "********"
    return f"{val[:4]}...{val[-4:]}"


def get_setting(key: str, default: Any = "") -> Any:
    """Gets a specific configuration parameter."""
    settings = load_settings()
    val = settings.get(key)
    if val is not None and str(val).strip() != "":
        return val
    # Fallback to env
    env_val = os.getenv(key)
    if env_val is not None and env_val.strip() != "":
        return env_val.strip().strip("'\"")
    return default


def save_settings(updates: Dict[str, Any]) -> Dict[str, Any]:
    """
    Saves new configuration values to settings.json atomically.
    Safely ignores masked secret inputs if unchanged.
    """
    global _SETTINGS_CACHE
    current = load_settings(force_reload=True).copy()

    secret_keys = ["TELEGRAM_BOT_TOKEN", "OPENAI_API_KEY", "ORIN_API_TOKEN"]

    for k, v in updates.items():
        if v is None:
            continue
        str_val = str(v).strip()
        # If user submitted a masked value or placeholder, do not overwrite the actual secret
        if k in secret_keys and ("..." in str_val or str_val == "********"):
            continue
        current[k] = v

    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        temp_file = SETTINGS_FILE.with_suffix(".tmp")
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(current, f, indent=2, ensure_ascii=False)
        temp_file.replace(SETTINGS_FILE)
        logger.info(f"Successfully persisted updated settings to {SETTINGS_FILE}")
    except Exception as e:
        logger.error(f"Failed to persist settings to {SETTINGS_FILE}: {e}")
        raise

    _SETTINGS_CACHE = current
    # Also sync relevant os.environ for libraries that read directly from environment
    if "OPENAI_API_KEY" in current and current["OPENAI_API_KEY"]:
        os.environ["OPENAI_API_KEY"] = current["OPENAI_API_KEY"]
    if "ORIN_API_TOKEN" in current and current["ORIN_API_TOKEN"]:
        os.environ["ORIN_API_TOKEN"] = current["ORIN_API_TOKEN"]

    return current


def get_masked_settings() -> Dict[str, Any]:
    """Returns all settings with masked secrets for safe frontend consumption."""
    raw = load_settings()
    masked = {}
    for k, v in raw.items():
        if k in ("TELEGRAM_BOT_TOKEN", "OPENAI_API_KEY", "ORIN_API_TOKEN"):
            masked[k] = mask_secret(v)
            masked[f"has_{k.lower()}"] = bool(v and not str(v).startswith("your_"))
        else:
            masked[k] = v
    return masked
