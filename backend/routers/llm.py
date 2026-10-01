import time
import logging
from typing import Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from services.ollama_service import ollama_service

logger = logging.getLogger("virtual_office.routers.llm")
router = APIRouter(prefix="/api/llm", tags=["Local LLM Engine (Ollama)"])


class SwitchModelRequest(BaseModel):
    model: str


class TestPromptRequest(BaseModel):
    prompt: str
    model: Optional[str] = None
    system_prompt: Optional[str] = None


@router.get("/status")
def get_llm_status():
    """
    Returns live connectivity status, active model, and available models
    from the local Ollama server (e.g., http://172.17.0.1:11434).
    """
    health = ollama_service.check_health(force_refresh=True)
    return health


@router.post("/switch-model")
def switch_active_model(req: SwitchModelRequest):
    """
    Changes the active model for Ollama generation (e.g. gemma3:12b, llama3.2:latest, gemma3:4b).
    """
    if not req.model:
        raise HTTPException(status_code=400, detail="Parameter 'model' is required.")

    health = ollama_service.check_health()
    available_models = health.get("models", [])
    if available_models and req.model not in available_models:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{req.model}' not found in Ollama. Available: {available_models}"
        )

    ollama_service.set_active_model(req.model)
    logger.info(f"Ollama active model switched to: {req.model}")
    return {
        "status": "success",
        "message": f"Active model switched to {req.model}",
        "active_model": req.model
    }


@router.post("/test")
def test_llm_prompt(req: TestPromptRequest):
    """
    Sends a test prompt directly to the local Ollama LLM to verify inference speed and quality.
    """
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Parameter 'prompt' cannot be empty.")

    system_prompt = req.system_prompt or "Kamu adalah asisten AI ramah dari ekosistem Virtual Office ORIN."
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": req.prompt}
    ]

    result = ollama_service.generate_chat(
        messages=messages,
        model=req.model,
        max_tokens=300
    )

    if not result.get("success"):
        raise HTTPException(
            status_code=502,
            detail=f"Ollama generation failed: {result.get('error')}"
        )

    return result
