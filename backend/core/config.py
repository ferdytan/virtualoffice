import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Define base paths
BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads" / "models"

# Ensure data and upload directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Load environment variables cleanly, checking both backend/.env and root .env
env_paths = [
    BASE_DIR / ".env",
    ROOT_DIR / ".env"
]
for ep in env_paths:
    if ep.is_file():
        load_dotenv(dotenv_path=ep)

def get_env_cleaned(key: str, default: str = "") -> str:
    """Helper to safely get env vars, stripping Windows CRLF (\\r) and quotes."""
    val = os.getenv(key)
    if val is None:
        return default
    val = val.strip().strip("'\"").rstrip("\r")
    return val

# Server configuration
PORT = int(get_env_cleaned("PORT", "8000"))
HOST = get_env_cleaned("HOST", "0.0.0.0")
CORS_ORIGINS_STR = get_env_cleaned("CORS_ORIGINS", "*")
CORS_ORIGINS = [o.strip() for o in CORS_ORIGINS_STR.split(",") if o.strip()]

# LLM / CrewAI configuration
OPENAI_API_KEY = get_env_cleaned("OPENAI_API_KEY", "")
OPENAI_MODEL_NAME = get_env_cleaned("OPENAI_MODEL_NAME", "gpt-4o-mini")
ANTHROPIC_API_KEY = get_env_cleaned("ANTHROPIC_API_KEY", "")
GROQ_API_KEY = get_env_cleaned("GROQ_API_KEY", "")

# Ollama Local LLM Server Configuration
OLLAMA_BASE_URL = get_env_cleaned("OLLAMA_BASE_URL", "http://172.17.0.1:11434")
OLLAMA_MODEL = get_env_cleaned("OLLAMA_MODEL", "gemma3:12b")
LLM_PROVIDER = get_env_cleaned("LLM_PROVIDER", "ollama")  # "ollama" | "openai" | "fallback"

# Nara / Orin Telemetry configuration
# Supports NARA_API_KEY, ORIN_API_TOKEN, and ORIN_API_KEY aliases
DEFAULT_ORIN_API_URL = "https://admin-api.orin.id/api/devices/offline"
DEFAULT_ORIN_BEARER_TOKEN = "20639|AwZwUDmpoUa2E8XeVwTvzDNB7glEckVl2uyRPYl9"

ORIN_API_URL = (
    get_env_cleaned("ORIN_API_URL")
    or get_env_cleaned("NARA_API_URL")
    or DEFAULT_ORIN_API_URL
)

ORIN_API_TOKEN = (
    get_env_cleaned("NARA_API_KEY")
    or get_env_cleaned("ORIN_API_TOKEN")
    or get_env_cleaned("ORIN_API_KEY")
    or get_env_cleaned("NARA_TOKEN")
    or DEFAULT_ORIN_BEARER_TOKEN
)
