import time
import uuid
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException

from core.state import add_kanban_task, KANBAN_TASKS
from crew.agents import AGENTS_METADATA
from crew.tasks import run_agent_task, process_inbound_whatsapp, process_management_reply
from models.chat import (
    ChatRequest,
    CallRequest,
    WhatsAppWebhookRequest,
    ManagementReplyWebhookRequest
)

logger = logging.getLogger("virtual_office.routers.chat")
router = APIRouter(prefix="/api", tags=["Chat & Webhooks"])


@router.post("/chat")
def chat_with_agent(req: ChatRequest):
    """
    Primary endpoint for delegating a brief/chat to any of the 5 agents.
    """
    agent_id = req.agent_id.lower()
    if agent_id not in AGENTS_METADATA:
        raise HTTPException(
            status_code=404,
            detail=f"Agent '{req.agent_id}' not found. Available: {list(AGENTS_METADATA.keys())}"
        )

    logger.info(f"Executing chat task for agent: {agent_id}, message: {req.message}")
    result = run_agent_task(agent_id, req.message)

    # Automatically create a Kanban task for visibility
    task_title = req.message if len(req.message) <= 45 else req.message[:42] + "..."
    new_task = add_kanban_task({
        "title": task_title,
        "agent_id": agent_id,
        "agent_name": AGENTS_METADATA[agent_id]["name"],
        "role_badge": AGENTS_METADATA[agent_id]["role_badge"],
        "status": "DONE",
    })

    result["task"] = new_task
    return result


@router.post("/call")
def handle_agent_call(req: CallRequest):
    """
    Endpoint for two-way audio/voice call sessions with all 5 agents.
    Provides immediate spoken conversational dialogue ready for TTS/STT pipelines.
    """
    agent_id = req.agent_id.lower()
    if agent_id not in AGENTS_METADATA:
        raise HTTPException(status_code=404, detail=f"Agent '{req.agent_id}' not found.")

    meta = AGENTS_METADATA[agent_id]
    session = req.session_id or f"call-{uuid.uuid4().hex[:8]}"

    spoken_replies = {
        "sherloc": [
            "Halo! Saya Sherloc dari Customer Care Orin. Ada keluhan kendaraan atau armada yang perlu saya bantu cek sekarang?",
            "Pesan Anda telah saya pahami dengan baik. Saya sedang mengecek status perangkat Anda di sistem Orin. Mohon ditunggu ya Pak/Bu.",
            "Terima kasih telah menghubungi Customer Care Orin. Layanan kami selalu siap 24 jam untuk memantau armada Anda."
        ],
        "watson": [
            "Salam. Watson di sini. Ada anomali telemetri atau error kode firmware ECU yang perlu saya diagnosis ke tim insinyur?",
            "Data log anomali telah saya amankan. Saya sedang mengoordinasikan instruksi perbaikannya ke grup WhatsApp lead engineers.",
            "Solusi teknis telah terverifikasi dan sudah saya arsipkan ke repositori Knowledge Base untuk referensi otomatis."
        ],
        "nara": [
            "Halo! Nara di sini. Sistem pemantauan unit online dan saya siap menerima laporan atau memeriksa unit yang bermasalah. Ada unit yang ingin dicek?",
            "Laporan diterima dengan jelas. Saya sedang mengarahkan peringatan otomatis ke teknisi. Ada hal lain yang perlu dipantau?",
            "Semua sensor telemetri aktif. Tingkat reliabilitas saat ini di angka 99.28 persen. Hubungi saya jika ada sinyal anomali."
        ],
        "velocia": [
            "Hai, Velocia bicara! Strategi apa yang ingin kita diskusikan hari ini? Saya siap memetakan funnel kampanye dan langkah eksekusinya.",
            "Ide yang sangat menarik! Saya catat poin utamanya dan segera berkoordinasi dengan Scout untuk menyiapkan materi data pendukung.",
            "Fokus kita adalah pertumbuhan dan konversi maksimal. Mari kita eksekusi rencana ini sekarang juga."
        ],
        "scout": [
            "Halo! Scout siap mendengarkan. Saya baru saja menyaring tren industri terbaru seputar AI dan otomasi virtual office. Topik apa yang ingin kita riset bersama?",
            "Menarik sekali. Data awal menunjukkan tren tersebut sedang mengalami lonjakan pencarian 120 persen. Saya siapkan draf ringkasannya segera.",
            "Catatan riset sudah tersimpan. Saya akan terus melacak perkembangan sumber berita kredibel untuk topik ini."
        ]
    }

    replies = spoken_replies.get(agent_id, ["Halo, saya mendengarkan Anda."])
    if req.message and len(req.message.strip()) > 0:
        reply_text = f"[{meta['name']} Call Response]: Saya mendengar Anda mengatakan '{req.message.strip()}'. {replies[1]}"
    else:
        reply_text = replies[0]

    return {
        "session_id": session,
        "agent_id": agent_id,
        "agent_name": meta["name"],
        "role": meta["role"],
        "call_status": "connected",
        "audio_stream_placeholder": f"/api/audio/stream/{session}",
        "reply_text": reply_text,
        "waveform_active": True,
        "timestamp": time.time()
    }


@router.post("/webhook/whatsapp")
def webhook_inbound_whatsapp(req: WhatsAppWebhookRequest):
    """
    Inbound WhatsApp Webhook.
    Sherloc acts as the Single Communicator:
    - Validates user (Pelanggan Orin vs Calon Pelanggan)
    - Checks KB or delegates to Nara (GPS) or escalates to Watson (ECU/firmware)
    - Returns formatted response for WhatsApp delivery.
    """
    phone = req.from_phone or req.phone or "+6281288991234"
    result = process_inbound_whatsapp(
        sender_phone=phone,
        sender_name=req.sender_name or "Pelanggan",
        message=req.message
    )

    task_status = "ON HOLD" if result.get("action") == "escalated" else "IN PROGRESS"
    new_task = add_kanban_task({
        "title": f"WA Inbound: {req.message[:38]}...",
        "agent_id": "sherloc",
        "agent_name": "Sherloc",
        "role_badge": "FRONTLINE CS",
        "status": task_status,
    })

    result["kanban_task"] = new_task
    return result


@router.post("/webhook/management-reply")
def webhook_management_reply(req: ManagementReplyWebhookRequest):
    """
    Webhook triggered when internal management/engineers reply in the WhatsApp group.
    Watson:
    - Translates technical instructions into customer-friendly format
    - Automatically harvests the Q&A pair into the Vector DB Knowledge Base
    - Hands off the solution back to Sherloc for customer delivery.
    """
    result = process_management_reply(
        ticket_id=req.ticket_id,
        reply_by=req.reply_by,
        reply_text=req.reply_text
    )

    # Update matching ticket in Kanban
    for task in KANBAN_TASKS:
        if req.ticket_id in task.get("title", ""):
            task["status"] = "DONE"
            task["updated_at"] = "Solusi terharvest"

    new_task = add_kanban_task({
        "title": f"Solusi {req.ticket_id} Terharvest (Watson)",
        "agent_id": "watson",
        "agent_name": "Watson",
        "role_badge": "TECH ESCALATION",
        "status": "DONE",
    })
    result["kanban_task"] = new_task
    return result
