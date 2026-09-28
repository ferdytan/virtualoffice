import os
import time
import logging
from typing import Dict, Any, Optional, List
from .agents import create_crewai_agent, AGENTS_METADATA
from .tools import (
    check_orin_user_tool,
    check_gps_telemetry_tool,
    escalate_to_wa_group_tool,
    append_to_knowledge_base_tool,
    anti_ban_group_broadcast_tool,
    KNOWLEDGE_BASE
)

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
    Generates tailored, high-quality character responses for all 5 agents.
    """
    msg_lower = message.lower()

    if agent_id == "sherloc":
        # Frontline Voice & Single Communicator
        if "cek" in msg_lower or "validasi" in msg_lower or "pelanggan" in msg_lower or "nomor" in msg_lower:
            return (
                "🔍 **Verifikasi Status Pengguna (Sherloc - Frontline Voice)**\n\n"
                "Saya telah mencocokkan nomor kontak dengan Database Pelanggan Orin:\n"
                "- **Hasil Validasi**: Terverifikasi sebagai *Pelanggan Orin Aktif*\n"
                "- **Nama Kontak**: Budi Santoso (PT Logistik Jaya Abadi)\n"
                "- **Armada Terdaftar**: Toyota Hilux (Plat: `B 1842 KZA`)\n"
                "- **Paket Layanan**: Orin Fleet Pro 1 Tahun (Aktif s/d Des 2026)\n\n"
                "Saya telah menyiapkan template respons resmi dan siap meneruskan pengecekan sinyal unit ke Nara jika terindikasi offline."
            )
        elif "eskalasi" in msg_lower or "error" in msg_lower or "watson" in msg_lower or "e-402" in msg_lower:
            return (
                "🚨 **Eskalasi Isu Teknis Diteruskan ke Watson (Sherloc)**\n\n"
                "Pelanggan melaporkan indikasi error teknis ECU/Modem (Error code E-402):\n"
                "• **Tindakan Sherloc**: Tiket #TIK-481 telah diteruskan ke meja Watson.\n"
                "• **Balasan ke Customer**: *\"Pesan Anda telah kami terima dengan prioritas tinggi. Tim teknis Orin sedang menganalisis protokol reset sistem kendaraannya. Mohon tunggu sesaat ya Pak/Bu.\"*\n"
                "• **Protokol Single Communicator**: Watson tidak akan membalas customer langsung; balasan akan disalurkan kembali melalui saya."
            )
        elif "harga" in msg_lower or "paket" in msg_lower or "promo" in msg_lower or "biaya" in msg_lower:
            return (
                "💬 **Respon FAQ & Paket Layanan (Sherloc)**\n\n"
                "Informasi paket langsung saya ambil dari Knowledge Base Orin:\n"
                "- **Paket Orin Fleet Bundling (Armada 5+ Unit)**: Diskon 20% biaya lisensi tahunan.\n"
                "- **Instalasi**: Gratis pemasangan on-site oleh teknisi resmi wilayah Jabodetabek & Karawang.\n"
                "- **Fasilitas**: Akses web dashboard, mobile app iOS/Android, sensor bahan bakar (opsional), dan garansi unit 2 tahun.\n\n"
                "Pesan telah diformat dengan ramah dan siap dikirimkan ke WhatsApp calon pelanggan."
            )
        else:
            return (
                f"Halo! Saya **Sherloc**, *Frontline Voice & WhatsApp Communicator* resmi Virtual Office AI. 🎧\n\n"
                f"Mengenai pesan: *\"{message}\"*\n\n"
                "Sebagai satu-satunya garda terdepan komunikasi WhatsApp ke pelanggan, saya memvalidasi pengguna, menjawab FAQ, berkoordinasi dengan Nara untuk cek GPS, dan meneruskan kendala rumit ke Watson."
            )

    elif agent_id == "watson":
        # Technical Escalation & Knowledge Loop
        if "eskalasi" in msg_lower or "tiket" in msg_lower or "manajemen" in msg_lower or "bridge" in msg_lower:
            return (
                "🛠️ **Status Tiket Eskalasi Teknis (Watson - Tech Escalation Lead)**\n\n"
                "Saya memantau antrean eskalasi dari Sherloc:\n"
                "1. `TIK-481`: Lampu merah kedip & Error E-402 (Isuzu Giga D 9912 ABE) -> **Terjawab via WA Management** (SMS restart code 402)\n"
                "2. `TIK-482`: Modem lock pasca penyeberangan roaming -> **ON HOLD** (Menunggu respon di WA Group Lead Engineers)\n"
                "3. `TIK-483`: Fluktuasi sensor BBM >25% off-road -> **Terjawab via WA Management** (Moving-average filter 3 OTA)\n\n"
                "🔄 **Knowledge Loop**: Solusi yang sudah terverifikasi langsung dipanen (harvested) ke Vector DB untuk pembelajaran otomatis Sherloc."
            )
        elif "harvest" in msg_lower or "rag" in msg_lower or "knowledge" in msg_lower or "vector" in msg_lower:
            return (
                "📚 **Audit Repositori Knowledge Harvester (Watson)**\n\n"
                "- **Total Q&A Embeddings**: 4 Pasang Dokumen Terindeks\n"
                "- **Rata-rata Tingkat Keyakinan (Confidence)**: 96.8%\n"
                "- **Kategori Utama**: FIRMWARE, TELEMETRI SENSOR, NETWORK ROAMING, PAKET PROMO\n"
                "- **Sumber Data Terkini**: Jawaban langsung Dimas (Lead Engineer) di grup WhatsApp internal manajemen.\n\n"
                "Semua pasangan tanya-jawab telah disinkronkan ke Vector Store agar Sherloc dapat menjawab pertanyaan berulang secara instan!"
            )
        else:
            return (
                f"Salam. Saya **Watson**, *Technical Escalation & Knowledge Loop Lead*. 🔬\n\n"
                f"Menganalisis: *\"{message}\"*\n\n"
                "Saya bertugas mengurai anomali telemetri tingkat lanjut dari Sherloc, mengoordinasikannya ke grup WhatsApp pimpinan insinyur, dan memanen setiap jawaban solusi ke basis pengetahuan mandiri."
            )

    elif agent_id == "nara":
        # CS & Offline Unit Reminder + Safe Group Broadcast
        if "broadcast" in msg_lower or "anti-ban" in msg_lower or "grup" in msg_lower or "aman" in msg_lower:
            return (
                "🛡️ **Protokol Safe Group Broadcast Anti-Banned (Nara)**\n\n"
                "Eksekusi siaran peringatan unit offline ke grup teknisi telah dijalankan secara aman:\n"
                "• **Mekanisme Jitter**: Delay acak 15—45 detik antara pesan grup.\n"
                "• **Simulator Mengetik**: Mengirim paket status `composing` (3.5 detik) sebelum dispatch.\n"
                "• **Rotasi Template**: Variasi hash teks (Variant A, B, C) untuk mencegah auto-flag Meta.\n"
                "• **Target**: Grup Teknisi Jabodetabek, Jawa Timur, dan Jawa Barat (Status: 0 flagged).\n\n"
                "Seluruh 9 unit offline telah dialokasikan ke teknisi masing-masing tanpa resiko pemblokiran nomor WhatsApp."
            )
        elif "cek" in msg_lower or "unit" in msg_lower or "offline" in msg_lower or "status" in msg_lower or "ping" in msg_lower:
            try:
                from .tools import fetch_nara_offline_report
                report = fetch_nara_offline_report(limit=20)
                stats = report.get("fetch_statistics", {}).get("cam_stats", {})
                total_api = stats.get("total_fetched", 0)
                reportable = stats.get("total_reportable", 0)
                cam_suppressed = stats.get("cam_suppressed", 0)
                cam_total = stats.get("cam_total", 0)
                mode = report.get("report_mode", "DELTA")
                cust_reports = report.get("customer_reports", [])

                return (
                    f"🚨 **Laporan Pemantauan Telemetri (Nara Engine)**\n\n"
                    f"• **Siklus Kalender**: Mode *{mode}* (Hari ke-{report.get('calendar_day')})\n"
                    f"• **Unit Terdeteksi di API Orin**: {total_api} unit\n"
                    f"• **Filter Khusus Unit CAM**: {cam_suppressed} dari {cam_total} unit CAM disaring (Masa toleransi <= 72 jam)\n"
                    f"• **Unit Offline Terkualifikasi**: {reportable} unit\n"
                    f"• **Grup WhatsApp Customer PRO Dipetakan**: {len(cust_reports)} grup pelanggan\n\n"
                    f"⚡ **Status**: Laporan telah siap didispatch melalui nomor WhatsApp Watson dengan jitter acak 15–45 detik dan simulasi composing status untuk proteksi anti-ban."
                )
            except Exception as e:
                return (
                    "🚨 **Laporan Pemantauan Unit (Nara - CS & Reminder)**\n\n"
                    "Pemindaian telemetri real-time unit kendaraan aktif:\n"
                    "- **Online Uptime**: 99.28% (Unit Aktif Normal)\n"
                    "- **Unit Offline Terdeteksi**: 9 Unit (Perlu intervensi teknisi)\n"
                    "⚡ **Status**: Peringatan aman telah diantrekan ke modul Safe Broadcast."
                )
        else:
            return (
                f"Halo! Saya **Nara** dari divisi *CS & Offline Unit Reminder*. 📡\n\n"
                f"Terkait permintaan Anda: *\"{message}\"*\n\n"
                "Semua sistem pemantauan telemetri aktif. Saya siap memeriksa detak unit, melakukan ping sinyal, dan menyiarkan peringatan aman anti-banned ke grup teknisi lapangan!"
            )

    elif agent_id == "velocia":
        # Marketing Strategist & Lead
        if "tren" in msg_lower or "chat" in msg_lower or "market" in msg_lower or "intelligence" in msg_lower:
            return (
                "📊 **Market Intelligence: Ekstraksi Chat WhatsApp Sherloc (Velocia)**\n\n"
                "Saya telah mengaudit riwayat percakapan customer yang masuk ke Sherloc:\n"
                "1. **Sensor BBM (Fuel Sensor)**: 54 mentions (+32% pertumbuhan) - Kebutuhan audit solar armada logistik.\n"
                "2. **GPS Tracker Mini Portable Magnet**: 41 mentions (+18%) - Permintaan dari rental mobil tanpa potong kabel.\n"
                "3. **Promo Bundling Armada 5-10 Unit**: 36 mentions (+25%) - Waktu ideal rilis penawaran Q4.\n\n"
                "💡 **Rekomendasi Komersial**: Bundling promo 'Orin Fleet Protect' siap diluncurkan di kuartal IV dengan target 250 enterprise leads baru."
            )
        else:
            return (
                f"Hai! Saya **Velocia**, *Marketing Strategist & Lead*. 🚀\n\n"
                f"Mengenai arahan: *\"{message}\"*\n\n"
                "Saya siap merancang blueprint pertumbuhan, membedah data percakapan customer untuk menangkap peluang produk baru, dan mengarahkan Scout untuk menyiapkan materi riset!"
            )

    elif agent_id == "scout":
        # News Researcher & Writer + Autonomous SOP Writer
        if "sop" in msg_lower or "keluhan" in msg_lower or "isu" in msg_lower or "panduan" in msg_lower:
            return (
                "🤖 **Autonomous SOP Generator: Resolusi Isu Berulang (Scout)**\n\n"
                "Berdasarkan klaster tiket komplain berulang di meja Sherloc, saya telah menyusun draf panduan mandiri:\n"
                "1. **SOP Reset PIN & Password Portal Orin** (Mengurangi beban CS 35%)\n"
                "   • Langkah 1: Akses menu Profil di Orin Mobile App\n"
                "   • Langkah 2: Masukkan OTP WhatsApp 6-digit\n"
                "   • Langkah 3: Tetapkan PIN baru tanpa intervensi manual agen\n"
                "2. **SOP Ekspor Rute Logistik > 30 Hari** (Beban CS 22%)\n"
                "3. **SOP Notifikasi Geofence via WhatsApp** (Beban CS 15%)\n\n"
                "Draf panduan telah diserahkan ke basis data Sherloc agar customer dapat diarahkan ke self-service."
            )
        else:
            return (
                f"Halo! Saya **Scout**, *News Researcher & Writer*. 📰\n\n"
                f"Riset topik: *\"{message}\"*\n\n"
                "Saya meneliti tren spatial 3D AI, menganalisis isu customer berulang untuk membuat panduan SOP mandiri, dan merangkum studi kasus mendalam untuk kebutuhan publikasi tim."
            )

    return f"Pesan diterima oleh agen {agent_id}."


def process_inbound_whatsapp(sender_phone: str, sender_name: str, message: str) -> Dict[str, Any]:
    """
    Core Phase 2 Frontline Handler for WhatsApp Webhook.
    Sherloc is the SINGLE COMMUNICATOR:
    1. Validates user via check_orin_user_tool.
    2. Decides whether to answer from KB, delegate to Nara (GPS), or escalate to Watson (ECU/firmware).
    3. Formats response from Sherloc.
    """
    logger.info(f"Sherloc processing inbound WhatsApp from {sender_name} ({sender_phone}): '{message}'")

    # Step 1: User Validation
    user_check = check_orin_user_tool(sender_phone)
    user_type = user_check["user_type"]
    cust_data = user_check["customer"]
    plate = cust_data.get("plate", "-")
    vehicle = cust_data.get("company", "Kendaraan Operasional")

    msg_lower = message.lower()

    # Step 2: Route & Resolve
    # Case A: Complex Technical / Hardware / ECU error -> Escalate to Watson
    if any(k in msg_lower for k in ["e-402", "error", "kedip merah", "ecu", "lampu merah", "rusak", "anomali"]):
        ticket_id = f"TIK-{int(time.time()) % 1000:03d}"
        escalate_res = escalate_to_wa_group_tool(
            ticket_id=ticket_id,
            title=f"Isu Teknis Indikator/ECU pada {plate}",
            description=message,
            vehicle_info=f"{vehicle} (Plat: {plate})"
        )
        reply = (
            f"Halo Bapak/Ibu {sender_name}, terima kasih telah menghubungi Customer Care Orin. "
            f"Kendala teknis pada armada {plate} ({message[:50]}...) telah saya catat dengan nomor tiket #{ticket_id}. "
            f"Saya telah mengeskalasikannya ke tim teknis senior kami via Watson. Kami akan segera memberikan petunjuk penanganan langkah-demi-langkah dalam beberapa menit. Mohon ditunggu ya."
        )
        return {
            "status": "success",
            "handled_by": "sherloc",
            "action": "escalated",
            "ticket_id": ticket_id,
            "routed_to": "watson",
            "user_type": user_type,
            "plate": plate,
            "vehicle": vehicle,
            "reply": reply,
            "escalation_details": escalate_res
        }

    # Case B: Offline GPS / No Location Update -> Delegate to Nara
    elif any(k in msg_lower for k in ["mati", "offline", "tidak update", "sinyal", "hilang", "lokasi"]):
        telemetry_res = check_gps_telemetry_tool(plate if plate != "-" else "B 1842 KZA")
        diag = telemetry_res["telemetry"]["diagnosis"]
        last_ping = telemetry_res["telemetry"]["last_ping"]

        reply = (
            f"Halo Bapak/Ibu {sender_name}, saya Sherloc dari Customer Care Orin. "
            f"Saya telah berkoordinasi langsung dengan tim pemantauan kami (Nara) untuk mengecek sinyal unit {plate}. "
            f"Status telemetri terakhir tercatat: {last_ping}. Indikasi: {diag} "
            f"Nara sedang melakukan ping jaringan darurat ke modul kendaraan Anda. Kami akan mengabari kembali dalam waktu 10 menit jika diperlukan kunjungan teknisi."
        )
        return {
            "status": "success",
            "handled_by": "sherloc",
            "action": "delegated_nara",
            "routed_to": "nara",
            "user_type": user_type,
            "plate": plate,
            "vehicle": vehicle,
            "reply": reply,
            "telemetry_check": telemetry_res
        }

    # Case C: Pricing, Package, Bundling, Inquiries -> Direct KB Answer
    elif any(k in msg_lower for k in ["harga", "paket", "biaya", "promo", "pasang", "diskon", "truk"]):
        reply = (
            f"Halo Bapak/Ibu {sender_name}! Terima kasih atas minat Anda pada Orin Fleet Management. "
            f"Untuk pemasangan armada truk, kami menyediakan paket bundling 'Orin Fleet Pro' dengan diskon spesial 20% "
            f"untuk 5 unit ke atas, gratis pemasangan on-site di lokasi pool Anda, serta garansi perangkat 2 tahun. "
            f"Apakah Anda ingin kami kirimkan proposal resmi dan jadwal survei teknisi ke WhatsApp ini?"
        )
        return {
            "status": "success",
            "handled_by": "sherloc",
            "action": "direct_kb_reply",
            "routed_to": "none",
            "user_type": user_type,
            "plate": plate,
            "vehicle": vehicle,
            "reply": reply
        }

    # Default General Greeting / Question
    else:
        reply = (
            f"Halo Bapak/Ibu {sender_name}, saya Sherloc dari layanan bantuan resmi Orin. "
            f"Pesan Anda: \"{message}\" telah kami terima dengan baik. Ada yang bisa kami bantu terkait armada atau layanan GPS Anda hari ini?"
        )
        return {
            "status": "success",
            "handled_by": "sherloc",
            "action": "general_reply",
            "routed_to": "none",
            "user_type": user_type,
            "plate": plate,
            "vehicle": vehicle,
            "reply": reply
        }


def process_management_reply(ticket_id: str, reply_by: str, reply_text: str) -> Dict[str, Any]:
    """
    Handles callback from the internal WhatsApp Management group to Watson.
    1. Formats technical solution into friendly customer instructions.
    2. Harvests Q&A into Vector DB Knowledge Base.
    3. Hands off solution to Sherloc.
    """
    logger.info(f"Watson processing management reply for ticket {ticket_id} by {reply_by}: '{reply_text}'")

    # Clean and simplify the solution for the customer
    customer_instructions = (
        f"Petunjuk penanganan resmi dari tim insinyur Orin ({reply_by}): "
        f"{reply_text}. "
        f"Silakan ikuti langkah tersebut dan hubungi kami kembali jika indikator belum berubah normal."
    )

    # Harvest into KB
    harvest_res = append_to_knowledge_base_tool(
        question=f"Solusi untuk kendala pada tiket {ticket_id}",
        solution=reply_text,
        category="ESKALASI RESOLUSI",
        source=f"WA Group Reply by {reply_by}"
    )

    return {
        "status": "success",
        "ticket_id": ticket_id,
        "reply_by": reply_by,
        "raw_reply": reply_text,
        "customer_formatted_instructions": customer_instructions,
        "knowledge_harvester": harvest_res,
        "kanban_status": "DONE",
        "single_communicator_note": "Solusi siap didistribusikan oleh Sherloc ke WhatsApp customer."
    }
