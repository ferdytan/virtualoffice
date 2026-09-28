import os
import sys
import time
import uuid
import json
import asyncio
import logging
from typing import Dict, Any, List, Optional, Union

# Ensure backend directory is in sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from crew.agents import AGENTS_METADATA, CREWAI_AVAILABLE
from crew.tools import (
    KNOWLEDGE_BASE,
    anti_ban_group_broadcast_tool,
    fetch_nara_offline_report,
    process_customer_unit_feedback
)
from crew.tasks import (
    run_agent_task,
    process_inbound_whatsapp,
    process_management_reply
)

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("virtual_office.server")

# Directory for custom user-uploaded 3D GLB character models
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads", "models")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="Virtual Office AI Backend - Phase 2 Ecosystem",
    description="FastAPI + CrewAI backend with Sherloc (Frontline Voice), Watson (Tech Escalation), Nara, Velocia, and Scout.",
    version="2.0.0"
)

# Mount uploads directory for serving custom GLB models
app.mount("/uploads", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "uploads")), name="uploads")

# Configure CORS
origins_str = os.getenv("CORS_ORIGINS", "*")
origins = [o.strip() for o in origins_str.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initial In-Memory Kanban Tasks reflecting Phase 2 Real-Time Specification:
# - IN PROGRESS: Sherloc responding live chat / Nara scanning units
# - ON HOLD: Watson waiting for reply from Management WA Group
# - DONE: Velocia analytics & Scout SOP guide drafts finished
KANBAN_TASKS: List[Dict[str, Any]] = [
    {
        "id": "task-sherloc-live",
        "title": "Live Inbound Chat WhatsApp Budi Santoso",
        "agent_id": "sherloc",
        "agent_name": "Sherloc",
        "role_badge": "FRONTLINE CS",
        "status": "IN PROGRESS",
        "updated_at": "Baru saja"
    },
    {
        "id": "task-nara-ping",
        "title": "Heartbeat Ping Audit Unit Regional",
        "agent_id": "nara",
        "agent_name": "Nara",
        "role_badge": "REMINDER CS",
        "status": "IN PROGRESS",
        "updated_at": "1 mnt lalu"
    },
    {
        "id": "task-watson-hold",
        "title": "Eskalasi Tiket #TIK-482 ke WA Group Management",
        "agent_id": "watson",
        "agent_name": "Watson",
        "role_badge": "TECH ESCALATION",
        "status": "ON HOLD",
        "updated_at": "Menunggu respon insinyur"
    },
    {
        "id": "task-velocia-done",
        "title": "Analisis Tren Chat Log & Strategi Bundling Q4",
        "agent_id": "velocia",
        "agent_name": "Velocia",
        "role_badge": "MARKETING STRATEGIST",
        "status": "DONE",
        "updated_at": "15 mnt lalu"
    },
    {
        "id": "task-scout-done",
        "title": "Draf Panduan Mandiri SOP Reset PIN & Geofence",
        "agent_id": "scout",
        "agent_name": "Scout",
        "role_badge": "RESEARCHER",
        "status": "DONE",
        "updated_at": "30 mnt lalu"
    },
    {
        "id": "task-watson-harvested",
        "title": "Harvesting Solusi Error E-402 ke Vector DB",
        "agent_id": "watson",
        "agent_name": "Watson",
        "role_badge": "TECH ESCALATION",
        "status": "DONE",
        "updated_at": "45 mnt lalu"
    }
]


# Pydantic Request Models
class ChatRequest(BaseModel):
    agent_id: str = Field(..., description="ID of the agent: 'sherloc', 'watson', 'nara', 'velocia', or 'scout'")
    message: str = Field(..., description="Task brief or query message")


class CallRequest(BaseModel):
    agent_id: str = Field(..., description="ID of the agent: 'sherloc', 'watson', 'nara', 'velocia', or 'scout'")
    message: Optional[str] = Field(default="", description="Speech-to-text transcript or greeting")
    session_id: Optional[str] = Field(default=None, description="Optional call session ID")


class TaskUpdateRequest(BaseModel):
    id: str
    status: str = Field(..., description="SCHEDULED, ON HOLD, IN PROGRESS, or DONE")


class AvatarTypeRequest(BaseModel):
    avatar_type: str = Field(..., description="Avatar type: 'default', 'boxhead', or 'custom'")


class AgentColorRequest(BaseModel):
    color: str = Field(..., description="Hex color code, e.g. #f59e0b")


class WhatsAppWebhookRequest(BaseModel):
    from_phone: Optional[str] = Field(None, alias="from", description="Customer WhatsApp phone number")
    phone: Optional[str] = Field(None, description="Alternative phone field")
    sender_name: Optional[str] = Field(default="Customer", description="Sender name")
    message: str = Field(..., description="Inbound text content")
    timestamp: Optional[str] = Field(default=None, description="Timestamp")


class ManagementReplyWebhookRequest(BaseModel):
    ticket_id: str = Field(..., description="Escalated ticket ID, e.g. TIK-481")
    reply_by: str = Field(default="Dimas (Lead Eng)", description="Name and title of the replying engineer")
    reply_text: str = Field(..., description="Technical resolution instruction")


class SafeBroadcastRequest(BaseModel):
    groups: Optional[List[str]] = Field(default=None, description="List of technician WhatsApp group names")
    message: Optional[str] = Field(default="Peringatan unit telemetri offline terdeteksi.", description="Broadcast message text")


class AnalyticsTriggerRequest(BaseModel):
    timeframe: Optional[str] = Field(default="last_7_days", description="Timeframe for analytics extraction")


class NaraFeedbackRequest(BaseModel):
    customer_id: int = Field(..., description="ID of the customer")
    wa_group_id: str = Field(..., description="WhatsApp group ID of the customer PRO group")
    sender_name: Optional[str] = Field(default="Customer", description="Name of the person replying in group")
    message: str = Field(..., description="Inbound text content in WhatsApp group")
    quoted_message: Optional[str] = Field(default=None, description="Original offline alert message quoted")


class NaraDispatchRequest(BaseModel):
    customer_ids: Optional[List[Union[int, str]]] = Field(default=None, description="Optional customer IDs to dispatch")
    force_audit: Optional[bool] = Field(default=False, description="Force Day 1 Full Audit mode")
    day_override: Optional[int] = Field(default=None, description="Override calendar day (1 for Full Audit, 2+ for Delta)")


class CustomerGroupMappingRequest(BaseModel):
    customer_id: Union[int, str] = Field(..., description="Customer Account ID (e.g. 30706, 'LNJ', etc.)")
    customer_name: Optional[str] = Field(default="", description="Customer Account Name (e.g. 'LNJ', 'PT RAMA')")
    wa_group_name: str = Field(..., description="WhatsApp Group Name (e.g. 'ONB LNJ')")
    wa_group_id: Optional[str] = Field(default=None, description="Optional WhatsApp Group JID")
    pic: Optional[str] = Field(default="PIC Operasional", description="Optional PIC name")




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
    openai_key_set = bool(os.getenv("OPENAI_API_KEY") and not os.getenv("OPENAI_API_KEY").startswith("your_"))
    return {
        "status": "ok",
        "backend": "connected",
        "crewai_available": CREWAI_AVAILABLE,
        "openai_configured": openai_key_set,
        "agents_count": len(AGENTS_METADATA),
        "timestamp": time.time()
    }


@app.get("/api/agents")
def get_agents():
    """Returns detailed profiles of all 5 agents (Sherloc, Watson, Nara, Velocia, Scout)."""
    agents = []
    for k, v in AGENTS_METADATA.items():
        agent_data = dict(v)
        agent_data["avatar_type"] = AGENTS_METADATA[k].get("avatar_type", "default")
        model_path = os.path.join(UPLOAD_DIR, f"{k}.glb")
        if os.path.exists(model_path):
            agent_data["custom_model_url"] = f"/uploads/models/{k}.glb?t={int(os.path.getmtime(model_path))}"
            agent_data["has_custom_model"] = True
        else:
            agent_data["has_custom_model"] = False
        agents.append(agent_data)
    return {
        "agents": agents
    }


@app.post("/api/agents/{agent_id}/avatar-type")
def set_agent_avatar_type(agent_id: str, req: AvatarTypeRequest):
    """Sets the avatar type for an agent ('default', 'boxhead', or 'custom')."""
    aid = agent_id.lower()
    if aid not in AGENTS_METADATA:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found.")

    valid_types = {"default", "boxhead", "custom"}
    if req.avatar_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Tipe avatar tidak valid: {req.avatar_type}.")

    AGENTS_METADATA[aid]["avatar_type"] = req.avatar_type
    logger.info(f"Avatar type for agent {aid} updated to: {req.avatar_type}")

    return {
        "status": "success",
        "agent_id": aid,
        "avatar_type": req.avatar_type,
        "message": f"Tipe avatar untuk {AGENTS_METADATA[aid]['name']} berhasil diubah ke {req.avatar_type}."
    }


@app.post("/api/agents/{agent_id}/color")
def set_agent_color(agent_id: str, req: AgentColorRequest):
    """Updates the custom primary theme color for an agent."""
    aid = agent_id.lower()
    if aid not in AGENTS_METADATA:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found.")

    color = req.color.strip()
    if not (color.startswith("#") and (len(color) == 7 or len(color) == 4)):
        raise HTTPException(status_code=400, detail="Format warna tidak valid. Gunakan format hex seperti #f59e0b")

    AGENTS_METADATA[aid]["color"] = color
    logger.info(f"Theme color for agent {aid} updated to: {color}")

    return {
        "status": "success",
        "agent_id": aid,
        "color": color,
        "message": f"Warna untuk {AGENTS_METADATA[aid]['name']} berhasil diubah ke {color}."
    }


@app.post("/api/agents/{agent_id}/model")
async def upload_agent_model(agent_id: str, file: UploadFile = File(...)):
    """Uploads a custom .glb or .gltf 3D character model for an agent."""
    aid = agent_id.lower()
    if aid not in AGENTS_METADATA:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found.")

    filename = file.filename or ""
    if not (filename.lower().endswith(".glb") or filename.lower().endswith(".gltf")):
        raise HTTPException(status_code=400, detail="Hanya file 3D berekstensi .glb atau .gltf yang didukung.")

    dest_path = os.path.join(UPLOAD_DIR, f"{aid}.glb")
    content = await file.read()
    with open(dest_path, "wb") as f:
        f.write(content)

    timestamp = int(time.time())
    url = f"/uploads/models/{aid}.glb?t={timestamp}"
    AGENTS_METADATA[aid]["custom_model_url"] = url
    AGENTS_METADATA[aid]["custom_model_name"] = filename
    logger.info(f"Custom 3D model uploaded for agent {aid}: {filename} ({len(content)} bytes)")

    return {
        "status": "success",
        "agent_id": aid,
        "custom_model_url": url,
        "custom_model_name": filename,
        "message": f"Model 3D {filename} berhasil diunggah untuk agen {AGENTS_METADATA[aid]['name']}."
    }


@app.delete("/api/agents/{agent_id}/model")
def delete_agent_model(agent_id: str):
    """Resets the agent's 3D model back to the authentic default avatar."""
    aid = agent_id.lower()
    if aid not in AGENTS_METADATA:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found.")

    dest_path = os.path.join(UPLOAD_DIR, f"{aid}.glb")
    if os.path.exists(dest_path):
        try:
            os.remove(dest_path)
        except Exception as e:
            logger.error(f"Error removing model file: {e}")

    AGENTS_METADATA[aid].pop("custom_model_url", None)
    AGENTS_METADATA[aid].pop("custom_model_name", None)
    logger.info(f"Custom model deleted for agent {aid}, reverted to default avatar")

    return {
        "status": "success",
        "agent_id": aid,
        "default_model": "/models/character.glb",
        "message": f"Karakter {AGENTS_METADATA[aid]['name']} berhasil dikembalikan ke avatar default."
    }


# =========================================================================
# PHASE 2 CORE ENDPOINTS: SHERLOC, WATSON, NARA, VELOCIA & SCOUT
# =========================================================================

@app.post("/api/webhook/whatsapp")
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

    # Update real-time Kanban status
    task_status = "ON HOLD" if result.get("action") == "escalated" else "IN PROGRESS"
    new_task = {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": f"WA Inbound: {req.message[:38]}...",
        "agent_id": "sherloc",
        "agent_name": "Sherloc",
        "role_badge": "FRONTLINE CS",
        "status": task_status,
        "updated_at": "Baru saja"
    }
    KANBAN_TASKS.insert(0, new_task)
    if len(KANBAN_TASKS) > 16:
        KANBAN_TASKS.pop()

    result["kanban_task"] = new_task
    return result


@app.post("/api/webhook/management-reply")
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

    # Update or resolve matching ticket in Kanban
    for task in KANBAN_TASKS:
        if req.ticket_id in task.get("title", ""):
            task["status"] = "DONE"
            task["updated_at"] = "Solusi terharvest"

    new_task = {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": f"Solusi {req.ticket_id} Terharvest (Watson)",
        "agent_id": "watson",
        "agent_name": "Watson",
        "role_badge": "TECH ESCALATION",
        "status": "DONE",
        "updated_at": "Baru saja"
    }
    KANBAN_TASKS.insert(0, new_task)
    result["kanban_task"] = new_task
    return result


@app.get("/api/crew/tasks/stream")
async def stream_crew_tasks():
    """
    Server-Sent Events (SSE) stream for real-time task status updates.
    Feeds live updates into the frontend KanbanBar.
    """
    async def event_generator():
        # Send initial data immediately
        init_payload = {
            "type": "init",
            "tasks": KANBAN_TASKS,
            "timestamp": time.time()
        }
        yield f"data: {json.dumps(init_payload)}\n\n"

        # Stream heartbeat & updates every 3 seconds
        while True:
            await asyncio.sleep(3.0)
            update_payload = {
                "type": "update",
                "tasks": KANBAN_TASKS,
                "timestamp": time.time()
            }
            yield f"data: {json.dumps(update_payload)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/analytics/trigger")
def trigger_downstream_analytics(req: Optional[AnalyticsTriggerRequest] = None):
    """
    Triggers downstream batch analytics from Sherloc's WhatsApp chat logs.
    - Velocia: extracts market intelligence keywords & commercial recommendations.
    - Scout: analyzes recurring customer issues and generates self-service SOP guides.
    """
    market_trends = [
        {"keyword": "Sensor BBM (Fuel Sensor)", "count": 54, "growth": "+32%", "sentiment": "Sangat Tinggi"},
        {"keyword": "GPS Tracker Mini / Portable Magnet", "count": 41, "growth": "+18%", "sentiment": "Tinggi"},
        {"keyword": "Promo Bundling Armada 5-10 Unit", "count": 36, "growth": "+25%", "sentiment": "Sangat Positif"},
        {"keyword": "Fitur Matikan Mesin Jarak Jauh (Immobilizer)", "count": 29, "growth": "+12%", "sentiment": "Stabil"}
    ]

    recurring_issues = [
        {"issue": "Lupa Password Akun & Reset PIN Portal Orin", "frequency": "38 tiket/minggu", "priority": "TINGGI", "sop_status": "Draf Selesai"},
        {"issue": "Ekspor Riwayat Rute Perjalanan > 30 Hari", "frequency": "24 tiket/minggu", "priority": "SEDANG", "sop_status": "Draf Selesai"},
        {"issue": "Notifikasi Geofence Tidak Masuk ke WhatsApp", "frequency": "17 tiket/minggu", "priority": "SEDANG", "sop_status": "Draf Selesai"}
    ]

    # Add finished tasks to Kanban
    KANBAN_TASKS.insert(0, {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": "Batch Mining Chat WhatsApp: Tren BBM +32%",
        "agent_id": "velocia",
        "agent_name": "Velocia",
        "role_badge": "MARKETING STRATEGIST",
        "status": "DONE",
        "updated_at": "Baru saja"
    })
    KANBAN_TASKS.insert(0, {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": "SOP Generator: 3 Panduan Mandiri Diterbitkan",
        "agent_id": "scout",
        "agent_name": "Scout",
        "role_badge": "RESEARCHER",
        "status": "DONE",
        "updated_at": "Baru saja"
    })

    return {
        "status": "success",
        "executed_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "velocia_market_intelligence": {
            "trends": market_trends,
            "strategic_recommendation": "Luncurkan promo bundling 'Orin Fleet Protect' dengan Fuel Sensor di kuartal IV."
        },
        "scout_recurring_issues": {
            "recurring_issues": recurring_issues,
            "cs_load_deflection_estimate": "35% pengurangan tiket repetitif"
        }
    }


@app.get("/api/knowledge-base")
def get_knowledge_base():
    """Returns the current Knowledge Base and harvested Vector DB entries."""
    return {
        "status": "success",
        "knowledge_base": KNOWLEDGE_BASE,
        "total_records": len(KNOWLEDGE_BASE)
    }


@app.post("/api/broadcast/safe")
def trigger_safe_broadcast(req: Optional[SafeBroadcastRequest] = None):
    """
    Executes Nara's Safe WhatsApp Group Broadcast with anti-banned jitter,
    typing simulator (composing status), and template rotation.
    """
    groups = req.groups if (req and req.groups) else [
        "Grup WhatsApp Teknisi Regional Jabodetabek",
        "Grup WhatsApp Respon Cepat Jawa Timur",
        "Grup WhatsApp Teknisi Jawa Barat"
    ]
    msg = req.message if (req and req.message) else "Peringatan 9 unit telemetri offline terdeteksi. Mohon cek tiket unit."
    result = anti_ban_group_broadcast_tool(groups=groups, message=msg)

    # Register Kanban task
    KANBAN_TASKS.insert(0, {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": f"Safe Broadcast 3 Grup Teknisi (Anti-Ban 0 Flags)",
        "agent_id": "nara",
        "agent_name": "Nara",
        "role_badge": "REMINDER CS",
        "status": "DONE",
        "updated_at": "Baru saja"
    })

    result["kanban_status"] = "DONE"
    return result


@app.get("/api/nara/test-run")
def run_nara_engine_test(
    force_audit: bool = False,
    day_override: Optional[int] = None,
    limit: int = 100,
    max_pages: Optional[int] = 1,
    simulate_dispatch: bool = False
):
    """
    Test run endpoint for Nara Engine:
    1. Fetches live telemetry from Orin Admin API (https://admin-api.orin.id/api/devices/offline).
    2. Applies CAM unit business rule (CAM > 72h offline threshold).
    3. Evaluates Calendar Cycle (Day 1 Full Audit vs Day 2+ Delta).
    4. Groups offline units by Customer PRO WhatsApp Group.
    5. Formats natural humanized messages (Watson anti-ban protection).
    6. Optionally runs simulated dispatch with 15-45s jitter & composing delay.
    """
    logger.info(f"Triggering Nara Engine test run: force_audit={force_audit}, day_override={day_override}, limit={limit}")
    try:
        report = fetch_nara_offline_report(
            force_audit=force_audit,
            limit=limit,
            max_pages=max_pages,
            day_override=day_override,
            dispatch_simulation=simulate_dispatch
        )
    except Exception as exc:
        logger.error(f"Error during Nara test run: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Gagal menjalankan Nara Engine: {str(exc)}")

    # Update real-time Kanban board
    report_mode = report.get("report_mode", "DELTA")
    summary = report.get("summary", {})
    new_task = {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": f"Nara Telemetri: {summary.get('total_valid_offline', 0)} Unit ({report_mode})",
        "agent_id": "nara",
        "agent_name": "Nara",
        "role_badge": "REMINDER CS",
        "status": "DONE",
        "updated_at": "Baru saja"
    }
    KANBAN_TASKS.insert(0, new_task)
    if len(KANBAN_TASKS) > 16:
        KANBAN_TASKS.pop()

    report["kanban_task"] = new_task
    return report


@app.post("/api/nara/dispatch")
def dispatch_nara_reports(req: Optional[NaraDispatchRequest] = None):
    """
    Dispatches compiled Nara reports to Customer PRO WhatsApp Groups via Watson Gateway:
    - Jitter delay: 15-45s between groups
    - Active 'composing' typing simulator
    - Notification hashing and anti-spam protection
    """
    force_audit = req.force_audit if req else False
    day_override = req.day_override if req else None
    customer_ids = req.customer_ids if req else None

    report = fetch_nara_offline_report(
        force_audit=force_audit,
        limit=100,
        day_override=day_override,
        dispatch_simulation=True,
        customer_ids=customer_ids
    )

    dispatch_res = report.get("dispatch_simulation") or {}

    new_task = {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": f"Watson Dispatch: {dispatch_res.get('total_groups_dispatched', 0)} Grup PRO (Anti-Ban)",
        "agent_id": "watson",
        "agent_name": "Watson",
        "role_badge": "TECH ESCALATION",
        "status": "DONE",
        "updated_at": "Baru saja"
    }
    KANBAN_TASKS.insert(0, new_task)

    return {
        "status": "success",
        "report_mode": report.get("report_mode"),
        "dispatch_result": dispatch_res,
        "kanban_task": new_task
    }


@app.post("/api/nara/feedback")
def handle_customer_group_feedback(req: NaraFeedbackRequest):
    """
    Watson to Nara Inbound Feedback Loop:
    When a customer group member replies to an offline warning message:
    - Watson routes context to Nara
    - Nara classifies intent (Technician Request, Workshop Maintenance, Battery Disconnected)
    - If workshop maintenance: pauses alerts for 7 days
    - Nara crafts professional technical reply for Watson to deliver
    """
    feedback_result = process_customer_unit_feedback(
        customer_id=req.customer_id,
        wa_group_id=req.wa_group_id,
        sender_name=req.sender_name or "Pelanggan",
        incoming_message=req.message,
        quoted_message=req.quoted_message
    )

    intent = feedback_result.get("intent_category", "GENERAL")
    new_task = {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": f"Feedback Respon: {req.sender_name} [{intent}]",
        "agent_id": "watson",
        "agent_name": "Watson",
        "role_badge": "TECH ESCALATION",
        "status": "DONE",
        "updated_at": "Baru saja"
    }
    KANBAN_TASKS.insert(0, new_task)
    feedback_result["kanban_task"] = new_task

    return {
        "status": "success",
        "feedback": feedback_result
    }


@app.post("/api/nara/customer-group")
def set_customer_group_mapping(req: CustomerGroupMappingRequest):
    """
    Sets or updates WhatsApp Group name for a customer account.
    Applies at the Customer Account level: all units under this customer account
    automatically inherit this WhatsApp group name and ID.
    """
    from services.offline_tracker import save_customer_group_mapping
    result = save_customer_group_mapping(
        customer_id=req.customer_id,
        customer_name=req.customer_name or f"Pelanggan #{req.customer_id}",
        wa_group_name=req.wa_group_name,
        wa_group_id=req.wa_group_id,
        pic=req.pic
    )

    new_task = {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": f"WA Group Mapped: {req.customer_name or req.customer_id} -> '{req.wa_group_name}'",
        "agent_id": "nara",
        "agent_name": "Nara",
        "role_badge": "REMINDER CS",
        "status": "DONE",
        "updated_at": "Baru saja"
    }
    KANBAN_TASKS.insert(0, new_task)
    result["kanban_task"] = new_task
    return result


@app.get("/api/nara/customer-groups")
def list_customer_group_mappings():
    """Lists all customer group mappings."""
    from services.offline_tracker import get_all_customer_group_mappings
    return {
        "status": "success",
        "mappings": get_all_customer_group_mappings()
    }




@app.post("/api/chat")
def chat_with_agent(req: ChatRequest):
    """
    Primary endpoint for delegating a brief/chat to any of the 5 agents.
    """
    agent_id = req.agent_id.lower()
    if agent_id not in AGENTS_METADATA:
        raise HTTPException(status_code=404, detail=f"Agent '{req.agent_id}' not found. Available: {list(AGENTS_METADATA.keys())}")

    logger.info(f"Executing chat task for agent: {agent_id}, message: {req.message}")
    result = run_agent_task(agent_id, req.message)

    # Automatically create/update a Kanban task for visibility
    task_title = req.message if len(req.message) <= 45 else req.message[:42] + "..."
    new_task = {
        "id": f"task-{uuid.uuid4().hex[:6]}",
        "title": task_title,
        "agent_id": agent_id,
        "agent_name": AGENTS_METADATA[agent_id]["name"],
        "role_badge": AGENTS_METADATA[agent_id]["role_badge"],
        "status": "DONE",
        "updated_at": "Baru saja"
    }
    KANBAN_TASKS.insert(0, new_task)
    if len(KANBAN_TASKS) > 16:
        KANBAN_TASKS.pop()

    result["task"] = new_task
    return result


@app.post("/api/call")
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


@app.get("/api/tasks")
def get_kanban_tasks():
    """Returns current Kanban tasks grouped into 4 columns."""
    columns = {
        "SCHEDULED": [],
        "ON HOLD": [],
        "IN PROGRESS": [],
        "DONE": []
    }
    for task in KANBAN_TASKS:
        status = task.get("status", "SCHEDULED")
        if status in columns:
            columns[status].append(task)
        else:
            columns["SCHEDULED"].append(task)

    return {
        "columns": columns,
        "total_tasks": len(KANBAN_TASKS)
    }


@app.post("/api/tasks/update")
def update_task_status(req: TaskUpdateRequest):
    """Allows dragging/updating task status in Kanban board."""
    for task in KANBAN_TASKS:
        if task["id"] == req.id:
            task["status"] = req.status
            task["updated_at"] = "Baru saja"
            return {"status": "success", "task": task}
    raise HTTPException(status_code=404, detail=f"Task {req.id} not found")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting Virtual Office AI Backend on http://{host}:{port}")
    uvicorn.run("server:app", host=host, port=port, reload=True)
