import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks, Request
from pydantic import BaseModel, Field

from services.config_manager import (
    load_settings,
    save_settings,
    get_masked_settings,
    get_setting
)
from services.telegram_service import (
    test_telegram_connection,
    send_telegram_message
)
from services.coo_orchestrator import process_owner_instruction

logger = logging.getLogger("virtual_office.routers.coo")
router = APIRouter(tags=["COO Orchestrator & Settings"])


class SettingsUpdateRequest(BaseModel):
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_OWNER_CHAT_ID: Optional[str] = None
    ORIN_API_TOKEN: Optional[str] = None
    ORIN_API_URL: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL_NAME: Optional[str] = None
    OLLAMA_BASE_URL: Optional[str] = None
    OLLAMA_MODEL: Optional[str] = None
    LLM_PROVIDER: Optional[str] = None
    COO_AUTONOMY_LEVEL: Optional[str] = None


class TelegramTestRequest(BaseModel):
    bot_token: Optional[str] = None
    owner_chat_id: Optional[str] = None


class COOInstructionRequest(BaseModel):
    instruction: str
    chat_id: Optional[str] = None


# ============================================================================
# 1. DYNAMIC CONFIGURATION & SETTINGS ENDPOINTS
# ============================================================================

@router.get("/api/settings")
def get_settings_endpoint():
    """
    Returns active configuration with masked secrets (safe for frontend UI).
    """
    return {
        "status": "success",
        "settings": get_masked_settings()
    }


@router.post("/api/settings")
def update_settings_endpoint(req: SettingsUpdateRequest):
    """
    Dynamically persists configuration updates to settings.json
    without requiring a manual backend server restart.
    """
    data = req.model_dump(exclude_unset=True)
    try:
        updated = save_settings(data)
        logger.info(f"Settings successfully updated dynamically: {list(data.keys())}")
        return {
            "status": "success",
            "message": "Pengaturan berhasil disimpan dan aktif seketika.",
            "settings": get_masked_settings()
        }
    except Exception as e:
        logger.error(f"Failed to update settings: {e}")
        raise HTTPException(status_code=500, detail=f"Gagal menyimpan pengaturan: {str(e)}")


@router.post("/api/settings/telegram/test")
async def test_telegram_endpoint(req: TelegramTestRequest):
    """
    Sends a test ping message to the Owner's Telegram to verify credentials.
    """
    result = await test_telegram_connection(
        bot_token=req.bot_token,
        owner_chat_id=req.owner_chat_id
    )
    if not result.get("ok"):
        raise HTTPException(status_code=400, detail=result.get("error", "Koneksi Telegram gagal."))

    return {
        "status": "success",
        "detail": result
    }


# ============================================================================
# 2. NATIVE TELEGRAM BOT WEBHOOK
# ============================================================================

@router.post("/api/webhook/telegram")
async def telegram_webhook_endpoint(request: Request, background_tasks: BackgroundTasks):
    """
    Native Telegram Webhook Gateway:
    - Receives messages directly from Telegram Bot API
    - Validates sender against TELEGRAM_OWNER_CHAT_ID (Security Whitelist)
    - Sends instantaneous acknowledgment to Telegram
    - Dispatches orchestration to COO in BackgroundTasks
    """
    try:
        body = await request.json()
    except Exception as e:
        logger.warning(f"Invalid JSON received on Telegram webhook: {e}")
        return {"ok": False, "error": "Invalid JSON"}

    message = body.get("message") or body.get("edited_message")
    if not message:
        # Telegram sometimes sends callback_query or my_chat_member, return 200 OK
        return {"ok": True, "notice": "No message payload to process"}

    chat_id = str(message.get("chat", {}).get("id", "")).strip()
    from_user = message.get("from", {})
    sender_name = from_user.get("first_name", "Owner")
    text = message.get("text", "").strip()

    owner_chat_id = str(get_setting("TELEGRAM_OWNER_CHAT_ID", "")).strip()

    # Security check: Whitelist Owner Chat ID
    if owner_chat_id and chat_id != owner_chat_id:
        logger.warning(
            f"Unauthorized Telegram webhook attempt! Chat ID {chat_id} (User: {sender_name}) "
            f"does not match configured owner chat ID: {owner_chat_id}"
        )
        # Inform unauthorized user politely
        background_tasks.add_task(
            send_telegram_message,
            chat_id,
            "⛔ *Akses Dibatasi*\nBot ini khusus dioperasikan secara privat oleh Direktur/Owner Orin.",
            "Markdown"
        )
        return {"ok": True, "status": "unauthorized_ignored"}

    logger.info(f"Telegram webhook received from Owner ({chat_id}): '{text}'")

    if not text:
        return {"ok": True, "notice": "Non-text message"}

    # Handle /start or greeting
    if text.startswith("/start"):
        welcome_text = (
            f"👔 *Selamat Datang di Virtual Office Orin, Pak {sender_name}!*\n\n"
            f"Saya adalah *COO Agent (Chief Operating Officer)*, asisten pimpinan dan orkestrator utama ekosistem ini.\n\n"
            f"Saya siap mendelegasikan tugas ke tim spesialis:\n"
            f"• 📡 *Nara*: Pemantauan unit offline & telemetri GPS\n"
            f"• ✍️ *Scout*: Riset berita kriminalitas/curanmor & penulisan konten\n"
            f"• 🛠️ *Watson*: Penanganan tiket eskalasi teknis & RAG Harvester\n"
            f"• 💬 *Sherloc*: Pelayanan frontline customer WhatsApp\n"
            f"• 📊 *Velocia*: Analisis tren pasar & strategi marketing\n\n"
            f"Ketik instruksi apa saja (contoh: _\"Cek status Nara dan suruh Scout cari bahan artikel curanmor\"_), dan saya akan langsung mengoordinasikannya."
        )
        background_tasks.add_task(send_telegram_message, chat_id, welcome_text, "Markdown")
        return {"ok": True, "action": "welcome_sent"}

    # Handle regular instruction: Send quick acknowledgment first
    ack_text = (
        f"🫡 *Instruksi diterima, Pak.*\n"
        f"Sedang saya koordinasikan ke tim spesialis. Progres dapat dipantau di Kanban Board, "
        f"dan laporan lengkap akan segera saya sampaikan ke sini..."
    )
    background_tasks.add_task(send_telegram_message, chat_id, ack_text, "Markdown")

    # Dispatch long-running CrewAI / agent orchestration in background
    background_tasks.add_task(process_owner_instruction, text, chat_id)

    return {
        "ok": True,
        "status": "dispatched",
        "instruction": text,
        "chat_id": chat_id
    }


# ============================================================================
# 3. DIRECT COO INSTRUCT ENDPOINT (For UI & API Testing)
# ============================================================================

@router.post("/api/coo/instruct")
async def direct_coo_instruct_endpoint(req: COOInstructionRequest, background_tasks: BackgroundTasks):
    """
    Direct endpoint to dispatch instructions to the COO Orchestrator.
    Can be called from the Web UI or test scripts.
    """
    instruction = req.instruction.strip()
    if not instruction:
        raise HTTPException(status_code=400, detail="Instruksi tidak boleh kosong.")

    chat_id = req.chat_id or get_setting("TELEGRAM_OWNER_CHAT_ID")

    # If chat_id is present, send initial ack
    if chat_id:
        background_tasks.add_task(
            send_telegram_message,
            chat_id,
            f"🫡 *Instruksi Web UI diterima:* \"{instruction}\"\nSedang diproses oleh COO...",
            "Markdown"
        )

    # Dispatch to background
    background_tasks.add_task(process_owner_instruction, instruction, chat_id)

    return {
        "status": "dispatched",
        "message": "Instruksi berhasil didelegasikan ke COO Orchestrator.",
        "instruction": instruction,
        "chat_id": chat_id
    }
