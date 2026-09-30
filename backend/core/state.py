import uuid
from typing import List, Dict, Any

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

def add_kanban_task(task: Dict[str, Any], max_items: int = 20) -> Dict[str, Any]:
    """Adds a task to the front of the Kanban task board and trims excess."""
    if "id" not in task:
        task["id"] = f"task-{uuid.uuid4().hex[:6]}"
    if "updated_at" not in task:
        task["updated_at"] = "Baru saja"
    KANBAN_TASKS.insert(0, task)
    while len(KANBAN_TASKS) > max_items:
        KANBAN_TASKS.pop()
    return task
