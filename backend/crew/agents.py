import os
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("virtual_office.crew")

# Metadata profile for the three agents matching 2x2 face-to-face team pod
AGENTS_METADATA = {
    "nara": {
        "id": "nara",
        "name": "Nara",
        "role": "CS & Offline Unit Reminder",
        "role_badge": "REMINDER CS",
        "color": "#38bdf8",
        "color_name": "Sky Blue",
        "position": [1.08, 0, -1.89],
        "rotation": [0, 3.14159265, 0],
        "model": os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini"),
        "description": "Bertanggung jawab memantau dan memberi notifikasi unit offline secara real-time.",
        "goal": "Memantau status perangkat dan unit sistem, mendeteksi unit yang mengalami kendala/offline, serta mengirimkan notifikasi eskalasi cepat dan ramah.",
        "backstory": (
            "Nara adalah agen Customer Support yang teliti dan waspada. Dengan pemantauan "
            "telemetri waktu nyata, ia memastikan tidak ada unit operasional yang terabaikan "
            "saat mengalami gangguan atau kehilangan konektivitas."
        ),
        "quick_prompts": [
            "Cek unit offline yang membutuhkan eskalasi",
            "Kirim notifikasi pengingat ke teknisi lapangan",
            "Buat ringkasan status kesehatan unit hari ini"
        ]
    },
    "velocia": {
        "id": "velocia",
        "name": "Velocia",
        "role": "Marketing Strategist & Lead",
        "role_badge": "MARKETING STRATEGIST",
        "color": "#ef4444",
        "color_name": "Solid Red",
        "position": [1.58, 0, -3.69],
        "rotation": [0, 0, 0],
        "model": os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini"),
        "description": "Bertanggung jawab merancang strategi kampanye dan mendelegasikan riset.",
        "goal": "Merancang strategi kampanye promosi berdaya konversi tinggi, memimpin orchestrasi pertumbuhan pasar, dan mendelegasikan analisis tren kepada tim riset.",
        "backstory": (
            "Velocia adalah lead strategist yang dinamis, cepat mengambil keputusan, dan berorientasi pada data. "
            "Ia mengoordinasikan eksekusi kampanye multi-channel dan mengarahkan Scout untuk menggali data tren pendukung."
        ),
        "quick_prompts": [
            "Rancang strategi kampanye peluncuran fitur baru Q4",
            "Delegasikan brief riset kompetitor ke Scout",
            "Buat rencana A/B testing untuk landing page"
        ]
    },
    "scout": {
        "id": "scout",
        "name": "Scout",
        "role": "News Researcher & Writer",
        "role_badge": "RESEARCHER",
        "color": "#22c55e",
        "color_name": "Solid Green",
        "position": [3.35, 0, -3.69],
        "rotation": [0, 0, 0],
        "model": os.getenv("OPENAI_MODEL_NAME", "gpt-4o-mini"),
        "description": "Bertanggung jawab meriset tren industri dan menulis draf artikel/blog.",
        "goal": "Meneliti tren industri terdepan, memverifikasi wawasan teknologi & pasar terkini, dan menghasilkan draf tulisan serta artikel bernilai tinggi.",
        "backstory": (
            "Scout adalah agen riset analitis yang gemar menjelajah informasi global, "
            "menyaring sinyal pasar penting, dan merangkumnya menjadi konten editorial dan analisis mendalam."
        ),
        "quick_prompts": [
            "Riset 3 tren AI Agent terbaru minggu ini",
            "Tulis draf artikel blog: Masa Depan Virtual Office 3D",
            "Kompilasi studi kasus implementasi LLM di workflow industri"
        ]
    }
}

CREWAI_AVAILABLE = False
try:
    from crewai import Agent
    CREWAI_AVAILABLE = True
except ImportError:
    logger.warning("CrewAI is not installed or unavailable. Using fallback smart responses.")


def create_crewai_agent(agent_id: str) -> Optional[Any]:
    if not CREWAI_AVAILABLE:
        return None

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key.startswith("your_openai"):
        return None

    meta = AGENTS_METADATA.get(agent_id.lower())
    if not meta:
        return None

    try:
        agent = Agent(
            role=meta["role"],
            goal=meta["goal"],
            backstory=meta["backstory"],
            verbose=True,
            memory=True,
            allow_delegation=(agent_id.lower() == "velocia")
        )
        return agent
    except Exception as e:
        logger.error(f"Failed to instantiate CrewAI Agent {agent_id}: {e}")
        return None


def get_all_agents_metadata() -> Dict[str, Any]:
    return AGENTS_METADATA
