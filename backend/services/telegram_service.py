import logging
from typing import Optional, Dict, Any
import httpx

from services.config_manager import get_setting

logger = logging.getLogger("virtual_office.telegram")

TELEGRAM_API_BASE = "https://api.telegram.org"


async def send_telegram_message(
    chat_id: str,
    text: str,
    parse_mode: Optional[str] = "Markdown",
    bot_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Sends a message via the Telegram Bot API to a specific chat_id.
    Gracefully falls back to plain text if Markdown parsing fails.
    """
    token = bot_token or get_setting("TELEGRAM_BOT_TOKEN")
    if not token:
        logger.warning("Telegram Bot Token is not configured.")
        return {"ok": False, "error": "Bot token not configured"}

    if not chat_id:
        logger.warning("Telegram target chat_id is empty.")
        return {"ok": False, "error": "Target chat_id is empty"}

    url = f"{TELEGRAM_API_BASE}/bot{token}/sendMessage"
    payload: Dict[str, Any] = {
        "chat_id": str(chat_id).strip(),
        "text": text,
        "disable_web_page_preview": True
    }
    if parse_mode:
        payload["parse_mode"] = parse_mode

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            resp = await client.post(url, json=payload)
            data = resp.json()

            # If Markdown parsing failed, retry once without parse_mode
            if not resp.is_success and parse_mode and "can't parse entities" in str(data.get("description", "")).lower():
                logger.warning("Telegram Markdown parse error, retrying without parse_mode...")
                payload.pop("parse_mode", None)
                retry_resp = await client.post(url, json=payload)
                return retry_resp.json()

            return data
    except Exception as e:
        logger.error(f"Exception sending Telegram message to {chat_id}: {e}")
        return {"ok": False, "error": str(e)}


async def test_telegram_connection(
    bot_token: Optional[str] = None,
    owner_chat_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Validates bot credentials with getMe and sends a test verification message to Owner.
    """
    token = bot_token or get_setting("TELEGRAM_BOT_TOKEN")
    chat_id = owner_chat_id or get_setting("TELEGRAM_OWNER_CHAT_ID")

    if not token:
        return {"ok": False, "error": "TELEGRAM_BOT_TOKEN belum diisi."}
    if not chat_id:
        return {"ok": False, "error": "TELEGRAM_OWNER_CHAT_ID belum diisi."}

    # Step 1: Verify Bot Token via /getMe
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            me_resp = await client.get(f"{TELEGRAM_API_BASE}/bot{token}/getMe")
            me_data = me_resp.json()
            if not me_resp.is_success or not me_data.get("ok"):
                desc = me_data.get("description", "Token bot tidak valid.")
                return {"ok": False, "error": f"Bot verification failed: {desc}"}

            bot_user = me_data.get("result", {})
            bot_name = bot_user.get("first_name", "Virtual Office Bot")
            bot_username = bot_user.get("username", "")

    except Exception as e:
        return {"ok": False, "error": f"Koneksi ke Telegram API gagal: {str(e)}"}

    # Step 2: Send test message to Owner
    test_text = (
        f"🟢 *Koneksi Telegram Berhasil Terhubung!*\n\n"
        f"Halo Pak Direktur, bot *@{bot_username}* ({bot_name}) telah aktif terintegrasi "
        f"dengan *Virtual Office AI COO Orchestrator*.\n\n"
        f"Anda sekarang dapat mengirim instruksi langsung melalui chat ini untuk mendelegasikan tugas "
        f"ke tim spesialis (Nara, Scout, Watson, Sherloc, Velocia)."
    )

    send_res = await send_telegram_message(
        chat_id=chat_id,
        text=test_text,
        parse_mode="Markdown",
        bot_token=token
    )

    if send_res.get("ok"):
        return {
            "ok": True,
            "bot_name": bot_name,
            "bot_username": bot_username,
            "owner_chat_id": chat_id,
            "message": f"Pesan uji coba berhasil dikirim ke chat ID {chat_id} via @{bot_username}!"
        }
    else:
        err_msg = send_res.get("description") or send_res.get("error") or "Gagal mengirim pesan"
        return {
            "ok": False,
            "bot_name": bot_name,
            "bot_username": bot_username,
            "error": f"Bot valid (@{bot_username}), tetapi gagal mengirim pesan ke Chat ID {chat_id}: {err_msg}. Pastikan Anda telah menekan /start pada bot terlebih dahulu."
        }
