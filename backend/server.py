import os
import sys
import time
import logging

# Ensure backend directory is in sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Auto-reexec with local venv python if running with system python where fastapi is not installed
_VENV_PY_LINUX = os.path.join(BACKEND_DIR, "venv", "bin", "python")
_VENV_PY_WIN = os.path.join(BACKEND_DIR, "venv", "Scripts", "python.exe")
_VENV_PY = _VENV_PY_LINUX if os.path.isfile(_VENV_PY_LINUX) else (_VENV_PY_WIN if os.path.isfile(_VENV_PY_WIN) else None)

if _VENV_PY and os.path.abspath(sys.executable) != os.path.abspath(_VENV_PY):
    try:
        import fastapi
    except ImportError:
        # Re-execute with venv interpreter when server.py is run directly
        if __name__ == "__main__":
            os.execv(_VENV_PY, [_VENV_PY, os.path.abspath(__file__)] + sys.argv[1:])
        else:
            raise

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Ensure backend directory is in sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from core.config import (
    PORT,
    HOST,
    CORS_ORIGINS,
    UPLOAD_DIR,
    OPENAI_API_KEY
)
from core.state import KANBAN_TASKS  # Re-exported for backwards compatibility
from crew.agents import AGENTS_METADATA, CREWAI_AVAILABLE
from routers import (
    agents_router,
    nara_router,
    chat_router,
    tasks_router,
    tools_router,
    scout_router,
    llm_router,
    coo_router
)

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("virtual_office.server")

app = FastAPI(
    title="Virtual Office AI Backend - Phase 3 Ecosystem",
    description="Modular FastAPI + CrewAI backend with COO Orchestrator, Telegram Gateway, Sherloc, Watson, Nara, Velocia, and Scout.",
    version="3.0.0"
)

# Mount uploads directory for serving custom GLB models
app.mount("/uploads", StaticFiles(directory=os.path.join(BACKEND_DIR, "uploads")), name="uploads")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if "*" not in CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routers
app.include_router(agents_router)
app.include_router(nara_router)
app.include_router(chat_router)
app.include_router(tasks_router)
app.include_router(tools_router)
app.include_router(scout_router)
app.include_router(llm_router)
app.include_router(coo_router)


@app.get("/")
def read_root():
    return {
        "service": "Virtual Office AI API - Phase 2 Ecosystem",
        "status": "running",
        "version": "2.0.0",
        "agents": list(AGENTS_METADATA.keys())
    }


@app.get("/api/health")
def health_check():
    openai_key_set = bool(OPENAI_API_KEY and not OPENAI_API_KEY.startswith("your_"))
    return {
        "status": "ok",
        "backend": "connected",
        "crewai_available": CREWAI_AVAILABLE,
        "openai_configured": openai_key_set,
        "agents_count": len(AGENTS_METADATA),
        "timestamp": time.time()
    }


if __name__ == "__main__":
    import uvicorn
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    logger.info(f"Starting Virtual Office AI Backend on http://{HOST}:{PORT}")
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True, reload_dirs=[backend_dir])
