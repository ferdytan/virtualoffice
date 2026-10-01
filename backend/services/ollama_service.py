import os
import time
import logging
from typing import Dict, Any, List, Optional
import httpx
from openai import OpenAI

from core.config import OLLAMA_BASE_URL, OLLAMA_MODEL, LLM_PROVIDER
from crew.agents import AGENTS_METADATA

logger = logging.getLogger("virtual_office.services.ollama")


class OllamaService:
    """
    Dedicated Local LLM integration service supporting Ollama server
    (e.g., http://172.17.0.1:11434 or http://127.0.0.1:11434).
    Uses the native OpenAI-compatible API layer (/v1) or native /api endpoints.
    """

    def __init__(self):
        self.base_url = OLLAMA_BASE_URL.rstrip("/")
        self.active_model = OLLAMA_MODEL
        self.provider = LLM_PROVIDER
        self._cached_health: Optional[Dict[str, Any]] = None
        self._cached_health_time: float = 0.0

    @property
    def openai_base_url(self) -> str:
        return f"{self.base_url}/v1"

    def get_client(self) -> OpenAI:
        """Returns an OpenAI SDK client configured for the local Ollama instance."""
        return OpenAI(
            base_url=self.openai_base_url,
            api_key="ollama",  # Ollama doesn't require a secret key
            timeout=20.0,
            max_retries=0
        )

    def check_health(self, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Pings the Ollama server to retrieve status and installed models.
        Caches results for 10 seconds to avoid flooding localhost.
        """
        now = time.time()
        if not force_refresh and self._cached_health and (now - self._cached_health_time < 10.0):
            return self._cached_health

        try:
            with httpx.Client(timeout=4.0) as client:
                res = client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    raw_models = data.get("models", [])
                    models = [m.get("name") for m in raw_models if m.get("name")]
                    
                    health_info = {
                        "available": True,
                        "status": "online",
                        "provider": "ollama",
                        "base_url": self.base_url,
                        "active_model": self.active_model,
                        "models": models,
                        "models_count": len(models),
                        "timestamp": now
                    }
                    self._cached_health = health_info
                    self._cached_health_time = now
                    return health_info
                else:
                    return {
                        "available": False,
                        "status": "http_error",
                        "status_code": res.status_code,
                        "base_url": self.base_url,
                        "active_model": self.active_model,
                        "models": [],
                        "timestamp": now
                    }
        except Exception as e:
            logger.warning(f"Ollama health check unreachable at {self.base_url}: {e}")
            health_info = {
                "available": False,
                "status": "offline",
                "error": str(e),
                "base_url": self.base_url,
                "active_model": self.active_model,
                "models": [],
                "timestamp": now
            }
            self._cached_health = health_info
            self._cached_health_time = now
            return health_info

    def set_active_model(self, model_name: str) -> bool:
        """Sets the active Ollama model in memory."""
        self.active_model = model_name
        if self._cached_health:
            self._cached_health["active_model"] = model_name
        return True

    def generate_chat(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1500
    ) -> Dict[str, Any]:
        """
        Executes a chat completion query against the local Ollama server.
        """
        selected_model = model or self.active_model
        start_time = time.time()
        
        try:
            client = self.get_client()
            res = client.chat.completions.create(
                model=selected_model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            duration = round(time.time() - start_time, 2)
            content = res.choices[0].message.content or ""
            return {
                "success": True,
                "content": content,
                "model": selected_model,
                "duration_seconds": duration,
                "finish_reason": res.choices[0].finish_reason or "stop"
            }
        except Exception as e:
            duration = round(time.time() - start_time, 2)
            logger.error(f"Ollama chat completion failed with {selected_model}: {e}")
            return {
                "success": False,
                "error": str(e),
                "content": "",
                "model": selected_model,
                "duration_seconds": duration
            }

    def generate_agent_response(self, agent_id: str, message: str) -> Optional[str]:
        """
        Generates character-consistent dialogue for one of the Virtual Office AI agents
        (Sherloc, Watson, Nara, Velocia, Scout) using the local Ollama LLM.
        """
        health = self.check_health()
        if not health.get("available"):
            return None

        meta = AGENTS_METADATA.get(agent_id.lower())
        if not meta:
            return None

        system_prompt = (
            f"Anda adalah {meta['name']}, anggota tim di ekosistem Virtual Office AI ORIN.\n"
            f"Role Anda: {meta['role']}.\n"
            f"Tujuan Anda: {meta['goal']}.\n"
            f"Backstory & Persona: {meta['backstory']}\n\n"
            f"Panduan Jawaban:\n"
            f"- Jawab dalam Bahasa Indonesia yang profesional, ramah, terstruktur, dan solutif.\n"
            f"- Fokus pada domain tanggung jawab peran Anda.\n"
            f"- Berikan poin-poin yang jelas dan actionable.\n"
            f"- Jangan keluar dari karakter."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]

        result = self.generate_chat(messages, max_tokens=1000)
        if result.get("success") and result.get("content"):
            return result["content"].strip()
        return None

    def generate_scout_article_with_llm(
        self,
        topic: str,
        sources: List[Dict[str, Any]],
        problem_analysis: str,
        educational_solution: str,
        target_product: str,
        custom_instructions: str = ""
    ) -> Optional[str]:
        """
        Uses local Ollama (gemma3:12b) to write an original, high-converting article
        following the 5-Babak narrative flow without hard-recapping news.
        """
        health = self.check_health()
        if not health.get("available"):
            return None

        sources_summary = "\n".join([f"- [{s.get('source')}]: {s.get('title')}" for s in sources[:4]])

        system_prompt = (
            "Anda adalah Scout, Content Creator Manager & Strategic Copywriter di ORIN.\n"
            "Tugas Anda adalah menulis draf artikel/blog edukatif orisinal dengan sudut pandang solutif, "
            "analitis, dan menyisipkan soft-selling produk ORIN (GPS Tracker, Orin Tag, atau Capacitive Fuel Sensor) secara alami.\n\n"
            "ATURAN EDITORIAL KETAT:\n"
            "1. DILARANG membuat rangkuman berita mentah yang klise (misal: 'Kemarin terjadi pencurian di Surabaya').\n"
            "2. Wajib menggunakan ALUR 5-BABAK NARASI:\n"
            "   - Babak 1: Hook & Realita Lapangan (isu aktual & pola waktu rawan)\n"
            "   - Babak 2: Bedah Modus & Akar Masalah (mengapa kunci ganda fisik/nota manual mudah bobol)\n"
            "   - Babak 3: Pilar Edukasi Preventif Objektif (tips netral & solutif)\n"
            "   - Babak 4: Natural Opportunity & Soft-Selling ORIN (live tracking, remote cut-off, atau sensor BBM)\n"
            "   - Babak 5: Call-to-Action (CTA) bersahabat mengajak konsultasi di orin.id\n"
            "3. Format penulisan dalam Markdown yang rapi dengan subjudul jelas."
        )

        user_prompt = (
            f"Tuliskan artikel lengkap untuk topik: '{topic}'\n\n"
            f"Referensi Berita Aktual Terpantau:\n{sources_summary}\n\n"
            f"Analisis Celah/Masalah Lapangan:\n{problem_analysis}\n\n"
            f"Solusi Edukasi Preventif:\n{educational_solution}\n\n"
            f"Pilar Produk Orin yang Ditonjolkan:\n{target_product}\n\n"
            f"Instruksi Tambahan dari Brief:\n{custom_instructions or 'Fokus pada transparansi dan proteksi aktif.'}\n\n"
            f"Silakan buat naskah artikel lengkap (Judul, Subjudul, Babak 1 s/d 5) sekarang."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]

        result = self.generate_chat(messages, max_tokens=650)
        if result.get("success") and result.get("content"):
            return result["content"].strip()
        return None


# Global singleton instance
ollama_service = OllamaService()
