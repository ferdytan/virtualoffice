import time
import json
import asyncio
import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from core.state import KANBAN_TASKS
from models.task import TaskUpdateRequest

logger = logging.getLogger("virtual_office.routers.tasks")
router = APIRouter(prefix="/api", tags=["Tasks & Kanban"])


@router.get("/tasks")
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


@router.post("/tasks/update")
def update_task_status(req: TaskUpdateRequest):
    """Allows dragging/updating task status in Kanban board."""
    for task in KANBAN_TASKS:
        if task["id"] == req.id:
            task["status"] = req.status
            task["updated_at"] = "Baru saja"
            return {"status": "success", "task": task}
    raise HTTPException(status_code=404, detail=f"Task {req.id} not found")


@router.get("/crew/tasks/stream")
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
