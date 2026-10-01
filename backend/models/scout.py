from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ScoutArticleRequest(BaseModel):
    topic: str = Field(default="curanmor", description="Topik target artikel (misal: 'curanmor', 'fuel_management', 'logistics_tips', dsb)")
    custom_instructions: Optional[str] = Field(default="", description="Instruksi tambahan sudut pandang atau tone khusus")
    target_product: Optional[str] = Field(default="", description="Pilihan fokus produk: 'orin_gps_tracker', 'orin_tag', atau 'orin_fuel_sensor'")


class ScoutArticleResponse(BaseModel):
    id: str
    title: str
    slug: str
    meta_description: str
    excerpt: str
    hook: Optional[str] = ""
    problem_analysis: Optional[str] = ""
    educational_solution: Optional[str] = ""
    soft_selling: Optional[str] = ""
    cta: Optional[str] = ""
    content_markdown: str
    keywords: List[str] = []
    category: str = "Keamanan Kendaraan"
    read_time: str = "4 menit baca"
    harvested_sources: List[Dict[str, str]] = []
    created_at: str = ""
    status: str = "success"
