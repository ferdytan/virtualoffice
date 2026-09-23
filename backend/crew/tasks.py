import os
import time
import logging
from typing import Dict, Any, Optional
from .agents import create_crewai_agent, AGENTS_METADATA

logger = logging.getLogger("virtual_office.tasks")

CREWAI_AVAILABLE = False
try:
    from crewai import Task, Crew, Process
    CREWAI_AVAILABLE = True
except ImportError:
    pass


def run_agent_task(agent_id: str, message: str) -> Dict[str, Any]:
    """
    Executes a task for the designated agent.
    If CrewAI & OPENAI_API_KEY are configured, it spins up a real CrewAI Crew.
    Otherwise, it executes an intelligent character-accurate response simulation.
    """
    agent_id = agent_id.lower()
    meta = AGENTS_METADATA.get(agent_id)
    if not meta:
        raise ValueError(f"Unknown agent_id: {agent_id}")

    # Check if live CrewAI can run
    agent_instance = create_crewai_agent(agent_id)
    if agent_instance and CREWAI_AVAILABLE:
        try:
            task = Task(
                description=f"User brief: '{message}'. Address this request according to your role as {meta['role']}.",
                expected_output="Jawaban komprehensif, terstruktur, dan actionable sesuai tugas peranmu.",
                agent=agent_instance
            )
            crew = Crew(
                agents=[agent_instance],
                tasks=[task],
                process=Process.sequential,
                verbose=True
            )
            result = crew.kickoff()
            return {
                "agent_id": agent_id,
                "agent_name": meta["name"],
                "role": meta["role"],
                "response": str(result),
                "is_live_crew": True,
                "timestamp": time.time()
            }
        except Exception as e:
            logger.warning(f"CrewAI execution failed ({e}), falling back to intelligent character response.")

    # Intelligent character fallback
    response_text = generate_character_response(agent_id, message)
    return {
        "agent_id": agent_id,
        "agent_name": meta["name"],
        "role": meta["role"],
        "response": response_text,
        "is_live_crew": False,
        "timestamp": time.time()
    }


def generate_character_response(agent_id: str, message: str) -> str:
    """
    Generates tailored, high-quality character responses for offline/demo operation.
    """
    msg_lower = message.lower()
    
    if agent_id == "nara":
        # CS & Offline Unit Reminder
        if "cek" in msg_lower or "unit" in msg_lower or "offline" in msg_lower or "status" in msg_lower:
            return (
                "🚨 **Laporan Pemantauan Unit (Nara - CS & Reminder)**\n\n"
                "Saya telah melakukan pemindaian telemetri menyeluruh:\n"
                "- **Total Unit Terpantau**: 48 Unit\n"
                "- **Unit Aktif & Normal**: 45 Unit (93.75%)\n"
                "- **Unit Terindikasi Offline**: 3 Unit\n"
                "  1. `Unit-JKT-04` (Offline sejak 18 menit lalu - Ping timeout)\n"
                "  2. `Unit-BDG-12` (Offline sejak 42 menit lalu - Fluktuasi daya)\n"
                "  3. `Unit-SBY-09` (Offline sejak 5 menit lalu - Heartbeat hilang)\n\n"
                "⚡ **Tindakan**: Notifikasi pengingat otomatis telah dikirimkan ke teknisi lapangan regional dan tiket eskalasi #CS-8924 sudah dibuka."
            )
        elif "notif" in msg_lower or "ingat" in msg_lower or "kirim" in msg_lower:
            return (
                "📩 **Pengiriman Pengingat Berhasil (Nara)**\n\n"
                "Pesan peringatan telah diteruskan ke grup respon darurat teknisi lapangan:\n"
                "• Kanal: WhatsApp Gateway & Push Notification System\n"
                "• Prioritas: High Priority Alert (Unit Down)\n"
                "• SLA Penanganan: Maksimal 30 menit ke depan.\n\n"
                "Saya akan terus memonitor sinyal recovery hingga semua unit kembali online hijau."
            )
        else:
            return (
                f"Halo! Saya **Nara** dari divisi *CS & Offline Unit Reminder*. 📡\n\n"
                f"Terkait permintaan Anda: *\"{message}\"*\n\n"
                "Semua sistem peringatan aktif. Saya siap membantu Anda melacak unit yang terputus, mengoordinasikan bantuan untuk klien, dan mengirimkan rekap harian kapan pun dibutuhkan!"
            )

    elif agent_id == "velocia":
        # Marketing Strategist & Lead
        if "kampanye" in msg_lower or "strategi" in msg_lower or "q4" in msg_lower or "promo" in msg_lower:
            return (
                "🎯 **Strategi Kampanye Pertumbuhan Terintegrasi (Velocia - Lead)**\n\n"
                "Berdasarkan analisis performa pasar terkini, berikut blueprint kampanye yang saya susun:\n\n"
                "1. **Core Narrative**: *\"The Autonomous Workspace\"* — menonjolkan efisiensi kolaborasi multi-agent AI di era kerja virtual.\n"
                "2. **Target Audience**: Tech Founders, Product Managers, & Scale-up CTOs.\n"
                "3. **Multi-Channel Funnel**:\n"
                "   • *Top Funnel*: Video demonstrasi interaktif 3D di LinkedIn & X.\n"
                "   • *Mid Funnel*: Whitepaper studi kasus mendalam (telah saya delegasikan ke Scout untuk riset data).\n"
                "   • *Bottom Funnel*: Free Trial Sandbox 14 hari dengan personalized onboarding.\n"
                "4. **Target KPI**: Pertumbuhan MQL +35% dan Customer Acquisition Cost (CAC) turun 18% dalam 6 pekan."
            )
        elif "delegasi" in msg_lower or "scout" in msg_lower or "riset" in msg_lower:
            return (
                "⚡ **Delegasi Riset Diteruskan ke Scout (Velocia)**\n\n"
                "Saya telah membuat brief riset resmi untuk Scout:\n"
                "• Topik: *Benchmark Adopsi AI Agent & Virtual Workspace 2026*\n"
                "• Output Diinginkan: 3 data tren utama, perbandingan use-case, dan 5 headline artikel rujukan.\n\n"
                "Status tugas di Kanban telah diperbarui ke `IN PROGRESS`. Scout sedang mengumpulkan materinya."
            )
        else:
            return (
                f"Hai! Saya **Velocia**, *Marketing Strategist & Lead*. 🚀\n\n"
                f"Mengenai arahan Anda: *\"{message}\"*\n\n"
                "Saya telah memetakan prioritas strategisnya. Tim marketing siap mengoptimalkan campaign messaging, menyiapkan funnel konversi, dan berkoordinasi langsung dengan Scout untuk kebutuhan data riset!"
            )

    elif agent_id == "scout":
        # News Researcher & Writer
        if "tren" in msg_lower or "ai" in msg_lower or "riset" in msg_lower or "berita" in msg_lower:
            return (
                "📰 **Executive Research Brief: Tren AI & Virtual Workspace (Scout)**\n\n"
                "Berikut rangkuman sintesis tren industri terhangat yang saya himpun:\n\n"
                "1. **Agentic Workforces in 3D Environments**:\n"
                "   Adopsi representasi spasial 3D untuk agen AI meningkatkan pemahaman kontekstual tim manusia hingga 40% dibanding bot teks konvensional.\n\n"
                "2. **Real-time Autonomous Decision Loops**:\n"
                "   Integrasi CrewAI dengan pemantauan IoT (seperti yang dilakukan Nara) menjadi standar baru dalam predictive maintenance.\n\n"
                "3. **Hyper-Personalized Content Generation**:\n"
                "   Strategi micro-targeting berbasis LLM memungkinkan kampanye marketing dibuat dinamis dalam hitungan menit.\n\n"
                "✍️ *Draf artikel editorial lengkap setebal 1.200 kata siap ditransformasikan ke format blog atau rilis pers!*"
            )
        elif "artikel" in msg_lower or "blog" in msg_lower or "tulis" in msg_lower or "draf" in msg_lower:
            return (
                "📝 **Draf Artikel Blog: 'Revolusi Virtual Office Berbasis AI' (Scout)**\n\n"
                "**Headline**: *Dari Dashboard Statis Menuju Kantor Virtual 3D: Bagaimana Kolaborasi Agen AI Mengubah Masa Depan Bisnis.*\n\n"
                "**Ringkasan Pembuka**:\n"
                "Di era di mana kecepatan respons menjadi pembeda utama, batas antara manusia dan AI kian menyatu dalam ruang kerja kolaboratif. "
                "Dengan arsitektur agen spesialis—mulai dari penjaga infrastruktur hingga arsitek strategi—organisasi kini dapat bergerak 10x lebih tangkas...\n\n"
                "✅ Draf telah ditandai `SCHEDULED` untuk review publikasi di Kanban!"
            )
        else:
            return (
                f"Salam! Saya **Scout**, *News Researcher & Writer*. 🔍\n\n"
                f"Menanggapi permintaan riset Anda: *\"{message}\"*\n\n"
                "Saya telah memverifikasi sumber data primer. Saya siap menyusun kompilasi data, artikel komprehensif, ataupun executive summary yang siap diteruskan ke Velocia dan tim kepemimpinan!"
            )

    return f"Pesan diterima oleh agen {agent_id.upper()}: '{message}'. Sedang memproses tugas..."
