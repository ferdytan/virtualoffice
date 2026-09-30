import os
import time
import logging
from fastapi import APIRouter, HTTPException, UploadFile, File

from core.config import UPLOAD_DIR
from crew.agents import AGENTS_METADATA
from models.agent import AvatarTypeRequest, AgentColorRequest

logger = logging.getLogger("virtual_office.routers.agents")
router = APIRouter(prefix="/api/agents", tags=["Agents"])


@router.get("")
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


@router.post("/{agent_id}/avatar-type")
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


@router.post("/{agent_id}/color")
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


@router.post("/{agent_id}/model")
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


@router.delete("/{agent_id}/model")
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
