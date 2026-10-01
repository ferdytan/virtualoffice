import time
import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException

from core.state import add_kanban_task
from crew.tasks import generate_scout_article, SCOUT_ARTICLES_STORE
from crew.tools import harvest_news_topics, fetch_orin_style_guide
from models.scout import ScoutArticleRequest, ScoutArticleResponse

logger = logging.getLogger("virtual_office.routers.scout")
router = APIRouter(prefix="/api/scout", tags=["Scout Engine"])


@router.post("/generate-article", response_model=Dict[str, Any])
def generate_article_endpoint(req: ScoutArticleRequest):
    """
    Generates structured long-form strategic copywriting article
    based on harvested news topics and Orin brand guidelines.
    Synchronizes with Kanban board.
    """
    topic = req.topic or "curanmor"
    logger.info(f"Scout generating article for topic: '{topic}'")

    # Generate article
    article = generate_scout_article(
        topic=topic,
        custom_instructions=req.custom_instructions or "",
        target_product=req.target_product or ""
    )

    # Register Kanban Task in DONE (after in-progress processing)
    title_short = article.get("title", f"Artikel {topic}")
    if len(title_short) > 42:
        title_short = title_short[:39] + "..."

    kanban_task = add_kanban_task({
        "title": f"Artikel: {title_short}",
        "agent_id": "scout",
        "agent_name": "Scout",
        "role_badge": "CONTENT STRATEGIST",
        "status": "DONE",
        "updated_at": "Baru saja"
    })

    article_copy = dict(article)
    article_copy["kanban_task"] = kanban_task
    return article_copy


@router.get("/articles")
def list_scout_articles():
    """Returns all harvested and generated articles in Scout's repository."""
    return {
        "status": "success",
        "total": len(SCOUT_ARTICLES_STORE),
        "articles": SCOUT_ARTICLES_STORE
    }


@router.get("/harvested-topics")
def get_harvested_topics(query: str = "curanmor"):
    """Fetches real-time harvested news items from Detik, Suara Surabaya, Mojok, and Pilar Media."""
    data = harvest_news_topics(query)
    return data


@router.get("/style-guide")
def get_style_guide():
    """Returns official Orin tone of voice, product pillars, and copywriting rules."""
    return fetch_orin_style_guide()
