import os
import time
import uuid
import logging
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from crew.agents import AGENTS_METADATA, CREWAI_AVAILABLE
from crew.tasks import run_agent_task

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("virtual_office.server")

app = FastAPI(
    title="Virtual Office AI Backend",
    description="FastAPI + CrewAI backend for 3D Virtual Office multi-agent workspace.",
    version="1.0.0"
)

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

# Initial In-Memory Kanban Tasks
KANBAN_TASKS: List[Dict[str, Any]] = [
    {
        "id": "task-1",
        "title": "Heartbeat Ping Audit Unit Regional",
        "agent_id": "nara",
        "agent_name": "Nara",
        "role_badge": "REMINDER CS",
        "status": "IN PROGRESS",
        "updated_at": "Baru saja"
    },
    {
        "id": "task-2",
        "title": "Q4 Growth Campaign Blueprint",
        "agent_id": "velocia",
        "agent_name": "Velocia",
        "role_badge": "MARKETING STRATEGIST",
        "status": "SCHEDULED",
        "updated_at": "10 mnt lalu"
    },
    {
        "id": "task-3",
        "title": "Benchmark Tren AI Spatial Workspace 2026",
        "agent_id": "scout",
        "agent_name": "Scout",
        "role_badge": "RESEARCHER",
        "status": "DONE",
        "updated_at": "1 jam lalu"
    },
    {
        "id": "task-4",
        "title": "Eskalasi Tiket #CS-8924 Unit Offline",
        "agent_id": "nara",
        "agent_name": "Nara",
        "role_badge": "REMINDER CS",
        "status": "ON HOLD",
        "updated_at": "Menunggu teknisi"
    }
]


# Pydantic Request Models
class ChatRequest(BaseModel):
    agent_id: str = Field(..., description="ID of the agent: 'nara', 'velocia', or 'scout'")
    message: str = Field(..., description="Task brief or query message")


class CallRequest(BaseModel):
    agent_id: str = Field(..., description="ID of the agent: 'nara', 'velocia', or 'scout'")
    message: Optional[str] = Field(default="", description="Speech-to-text transcript or greeting")
    session_id: Optional[str] = Field(default=None, description="Optional call session ID")


class TaskUpdateRequest(BaseModel):
    id: str
    status: str = Field(..., description="SCHEDULED, ON HOLD, IN PROGRESS, or DONE")


@app.get("/")
def read_root():
    return {
        "service": "Virtual Office AI API",
        "status": "running",
        "version": "1.0.0",
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
        "timestamp": time.time()
    }


@app.get("/api/agents")
def get_agents():
    """Returns detailed profiles of Nara, Velocia, and Scout."""
    return {
        "agents": list(AGENTS_METADATA.values())
    }


@app.post("/api/chat")
def chat_with_agent(req: ChatRequest):
    """
    Primary endpoint for delegating a brief/chat to a CrewAI agent.
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
    if len(KANBAN_TASKS) > 12:
        KANBAN_TASKS.pop()

    result["task"] = new_task
    return result


@app.post("/api/call")
def handle_agent_call(req: CallRequest):
    """
    Endpoint for two-way audio/voice call sessions with an agent.
    Provides immediate spoken conversational dialogue ready for TTS/STT pipelines.
    """
    agent_id = req.agent_id.lower()
    if agent_id not in AGENTS_METADATA:
        raise HTTPException(status_code=404, detail=f"Agent '{req.agent_id}' not found.")

    meta = AGENTS_METADATA[agent_id]
    session = req.session_id or f"call-{uuid.uuid4().hex[:8]}"

    # Conversational direct speech responses suited for audio calls
    spoken_replies = {
        "nara": [
            "Halo! Nara di sini. Sistem pemantauan unit online dan saya siap menerima laporan atau memeriksa unit yang bermasalah. Ada unit yang ingin dicek?",
            "Laporan diterima dengan jelas. Saya sedang mengarahkan peringatan otomatis ke teknisi. Ada hal lain yang perlu dipantau?",
            "Semua sensor telemetri aktif. Tingkat reliabilitas saat ini di angka 94 persen. Hubungi saya jika ada sinyal anomali."
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

    # Pick response based on user input or cycle
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
