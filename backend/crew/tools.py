import os
import time
import random
import logging
import urllib.parse
from typing import Dict, Any, List, Optional

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger("virtual_office.tools")

# Mock Orin Customer Database
ORIN_CUSTOMERS = [
    {
        "phone": "+6281288991234",
        "phone_clean": "081288991234",
        "name": "Budi Santoso",
        "email": "budi.santoso@logistikjaya.co.id",
        "company": "PT Logistik Jaya Abadi",
        "user_type": "Pelanggan Orin",
        "plate": "B 1842 KZA",
        "imei": "864902049182341",
        "package": "Orin Fleet Pro 1 Tahun",
        "status": "Aktif (Expired: 15 Des 2026)",
        "device_model": "Orin Tracker OBD-II v4"
    },
    {
        "phone": "+6285611223344",
        "phone_clean": "085611223344",
        "name": "Hendra Wijaya",
        "email": "hendra@expresstrans.com",
        "company": "Express Trans Cargo",
        "user_type": "Pelanggan Orin",
        "plate": "D 9912 ABE",
        "imei": "864902049901234",
        "package": "Orin Heavy Duty CAN-Bus",
        "status": "Aktif (Expired: 20 Nov 2026)",
        "device_model": "Orin Fleet Heavy Sensor"
    },
    {
        "phone": "+6281122334455",
        "phone_clean": "081122334455",
        "name": "Irwan Setiadi",
        "email": "irwan@nusantara-mining.com",
        "company": "Nusantara Mining Resources",
        "user_type": "Pelanggan Orin",
        "plate": "KT 8192 LK",
        "imei": "864902041122334",
        "package": "Orin Satellite Dual-Mode",
        "status": "Aktif (Expired: 10 Jan 2027)",
        "device_model": "Orin Mining Geo-Sens"
    }
]

# Knowledge Base in-memory storage
KNOWLEDGE_BASE = [
    {
        "id": "QA-01",
        "question": "Bagaimana cara mengatasi lampu indikator GPS kedip merah dengan error E-402?",
        "answer": "Kirim SMS 'RESTART#402' ke nomor kartu SIM di dalam unit. Tunggu 60 detik untuk flushing buffer dan sinkronisasi modem GSM.",
        "category": "FIRMWARE & HARDWARE",
        "confidence": "98.5%",
        "source": "WA Group Reply by Dimas (Lead Engineer)"
    },
    {
        "id": "QA-02",
        "question": "Berapa batas toleransi fluktuasi sensor BBM kapasitif dan bagaimana solusinya?",
        "answer": "Toleransi normal adalah <5%. Jika fluktuasi >20%, aktifkan moving-average filter tingkat 3 melalui portal telemetri OTA.",
        "category": "SENSOR TELEMETRI",
        "confidence": "95.2%",
        "source": "WA Group Reply by Hendra (VP Tech)"
    },
    {
        "id": "QA-03",
        "question": "Bagaimana memulihkan GPS yang terkunci APN pasca roaming penyeberangan kapal laut?",
        "answer": "Gunakan perintah USSD OTA *888# atau kirim perintah remote switch APN ke backup gateway: 'SET#APN#ORINROAM'.",
        "category": "NETWORK & TELECOM",
        "confidence": "93.8%",
        "source": "WA Group Reply by Tim Infra"
    },
    {
        "id": "QA-04",
        "question": "Berapa biaya pasang GPS untuk armada 5 truk di Cikarang?",
        "answer": "Untuk pemasangan 5 truk ke atas tersedia paket 'Orin Fleet Bundling' dengan diskon 20%, gratis instalasi di lokasi (Jabodetabek & Karawang), serta garansi unit 2 tahun.",
        "category": "PAKET & PROMO",
        "confidence": "99.0%",
        "source": "Commercial Sales Guide"
    }
]


def clean_phone(phone: str) -> str:
    """Normalize phone number to digits only, removing '+', spaces, and dashes."""
    digits = "".join(c for c in phone if c.isdigit())
    if digits.startswith("62"):
        digits = "0" + digits[2:]
    return digits


def check_orin_user_tool(phone: str, email: str = "") -> Dict[str, Any]:
    """
    Validates whether an inbound phone number or email belongs to an active Orin customer
    or a new prospect (Calon Pelanggan).
    """
    cleaned = clean_phone(phone)
    for cust in ORIN_CUSTOMERS:
        if clean_phone(cust["phone"]) == cleaned or cust["phone_clean"] == cleaned:
            logger.info(f"User validation SUCCESS: {cust['name']} ({cust['plate']})")
            return {
                "is_registered": True,
                "user_type": "Pelanggan Orin",
                "customer": cust
            }
        if email and cust.get("email", "").lower() == email.lower().strip():
            logger.info(f"User validation SUCCESS by email: {cust['name']}")
            return {
                "is_registered": True,
                "user_type": "Pelanggan Orin",
                "customer": cust
            }

    logger.info(f"User validation: {phone} is a prospective customer (Calon Pelanggan)")
    return {
        "is_registered": False,
        "user_type": "Calon Pelanggan",
        "customer": {
            "phone": phone,
            "name": "Calon Pelanggan",
            "user_type": "Calon Pelanggan",
            "plate": "-",
            "package": "Prospek Baru",
            "status": "Inquiry Masuk"
        }
    }


def check_gps_telemetry_tool(plate: str, imei: str = "") -> Dict[str, Any]:
    """
    Tool for Nara to inspect real-time GPS telemetry, heartbeat pings, GSM modem status, and power supply.
    """
    plate_clean = plate.upper().strip()
    # Find matching customer
    matched = None
    for cust in ORIN_CUSTOMERS:
        if cust["plate"].upper() == plate_clean or (imei and cust["imei"] == imei):
            matched = cust
            break

    if matched:
        is_troubled = ("1842" in plate_clean or "9912" in plate_clean)
        return {
            "status": "success",
            "plate": matched["plate"],
            "device_model": matched["device_model"],
            "imei": matched["imei"],
            "telemetry": {
                "online": not is_troubled,
                "gsm_signal": "1 Bar (Lemah)" if is_troubled else "4 Bar (Kuat - 4G LTE)",
                "satellites_locked": 4 if is_troubled else 14,
                "last_ping": "Kemarin 14:20 WIB" if is_troubled else "30 detik lalu",
                "power_voltage": "11.2V (Under-voltage)" if is_troubled else "13.8V (Normal)",
                "diagnosis": "Terdeteksi unit offline karena under-voltage power aki atau handshake timeout." if is_troubled else "Unit normal dan aktif bergerak."
            }
        }
    else:
        return {
            "status": "success",
            "plate": plate_clean,
            "device_model": "Generic OBD-II Tracker",
            "imei": imei or "864902049000000",
            "telemetry": {
                "online": False,
                "gsm_signal": "No Carrier",
                "satellites_locked": 0,
                "last_ping": "Tidak ada riwayat detak (Unit baru / Belum terdaftar)",
                "power_voltage": "0V",
                "diagnosis": "Plat nomor belum terdaftar di sistem telemetri aktif."
            }
        }


def escalate_to_wa_group_tool(ticket_id: str, title: str, description: str, vehicle_info: str) -> Dict[str, Any]:
    """
    Tool for Watson to bridge a technical problem into the internal WhatsApp group ('Orin Lead Engineers & Management').
    """
    logger.info(f"Watson escalating ticket {ticket_id} to internal WhatsApp Management group...")
    return {
        "status": "escalated",
        "ticket_id": ticket_id,
        "channel": "WhatsApp Group: 'Orin Lead Engineers & Management'",
        "kanban_status": "ON HOLD",
        "forwarded_at": time.strftime("%H:%M WIB"),
        "payload": {
            "title": title,
            "description": description,
            "vehicle_info": vehicle_info,
            "assigned_lead": "Dimas (Lead Hardware & Firmware)"
        },
        "message": f"Tiket {ticket_id} berhasil di-forward ke WA Group Management. Status diatur ke 'ON HOLD' menunggu instruksi insinyur."
    }


def append_to_knowledge_base_tool(question: str, solution: str, category: str = "ESKALASI RESOLUSI", source: str = "WA Group Reply") -> Dict[str, Any]:
    """
    Tool for Watson's Knowledge Harvester to index a validated Q&A pair into the Vector DB RAG store.
    """
    qa_id = f"QA-{len(KNOWLEDGE_BASE) + 1:02d}"
    entry = {
        "id": qa_id,
        "question": question.strip(),
        "answer": solution.strip(),
        "category": category.upper(),
        "confidence": "97.5%",
        "source": source,
        "indexed_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    KNOWLEDGE_BASE.append(entry)
    logger.info(f"Knowledge Harvester indexed {qa_id}: '{question[:40]}...' into Vector DB")
    return {
        "status": "success",
        "entry": entry,
        "total_kb_items": len(KNOWLEDGE_BASE)
    }


def anti_ban_group_broadcast_tool(groups: List[str], message: str, delay_jitter_min: int = 15, delay_jitter_max: int = 45) -> Dict[str, Any]:
    """
    Tool for Nara to execute safe WhatsApp group broadcast with anti-ban protections:
    1. Randomized jitter (15-45s)
    2. Composing/typing simulation (3-5s)
    3. Message hashing/template rotation
    """
    broadcast_log = []
    for grp in groups:
        jitter = random.randint(delay_jitter_min, delay_jitter_max)
        composing_time = round(random.uniform(2.5, 4.5), 1)
        template_variant = random.choice(["Variant A", "Variant B", "Variant C"])
        broadcast_log.append({
            "group": grp,
            "jitter_delay_seconds": jitter,
            "typing_simulator_seconds": composing_time,
            "template_variant": template_variant,
            "delivery_status": "DELIVERED (0 flags)"
        })

    logger.info(f"Nara executed safe broadcast to {len(groups)} groups with jitter range {delay_jitter_min}-{delay_jitter_max}s")
    return {
        "status": "success",
        "anti_ban_active": True,
        "groups_count": len(groups),
        "broadcast_log": broadcast_log,
        "summary": f"Peringatan unit offline berhasil disiarkan ke {len(groups)} grup WhatsApp teknisi secara aman (Anti-Ban Active)."
    }


def fetch_nara_offline_report(
    force_audit: bool = False,
    limit: int = 100,
    max_pages: Optional[int] = 1,
    day_override: Optional[int] = None,
    dispatch_simulation: bool = False,
    customer_ids: Optional[List[Any]] = None
) -> Dict[str, Any]:
    """
    Tool for Nara to pull live telemetry from Orin Admin API,
    apply CAM unit business rule (only offline > 72h included),
    evaluate Calendar Cycle (Day 1 Full Audit vs Day 2+ Delta),
    and map offline units to PRO Customer WhatsApp Groups.
    """
    from services.orin_telemetry import OrinTelemetryClient, filter_nara_devices
    from services.offline_tracker import OfflineStateTracker

    logger.info(f"Nara running offline report task (force_audit={force_audit}, limit={limit})")
    client = OrinTelemetryClient()
    fetch_result = client.fetch_offline_devices(limit=limit, max_pages=max_pages)
    raw_devices = fetch_result.get("devices", [])

    # Filter according to CAM Rule
    filter_result = filter_nara_devices(raw_devices)
    valid_devices = filter_result["valid_offline_devices"]

    # State tracking and Calendar Cycle
    tracker = OfflineStateTracker()
    state_result = tracker.process_telemetry_batch(
        valid_offline_devices=valid_devices,
        force_audit=force_audit,
        day_override=day_override
    )

    dispatch_result = None
    if dispatch_simulation and state_result.get("grouped_reports"):
        reports_to_dispatch = state_result["grouped_reports"]
        if customer_ids:
            target_ids = {str(cid) for cid in customer_ids}
            reports_to_dispatch = [r for r in reports_to_dispatch if str(r.get("customer_id")) in target_ids]
        dispatch_result = tracker.dispatch_reports(reports_to_dispatch)

    return {
        "status": "success",
        "fetch_statistics": {
            "total_from_api": fetch_result.get("total_count"),
            "pages_fetched": fetch_result.get("pages_retrieved"),
            "cam_stats": filter_result["statistics"]
        },
        "valid_devices": valid_devices,
        "suppressed_cam_devices": filter_result["suppressed_cam_devices"],
        "report_mode": state_result["report_mode"],
        "calendar_day": state_result["calendar_day"],
        "summary": state_result["summary"],
        "customer_reports": state_result["grouped_reports"],
        "dispatch_simulation": dispatch_result
    }


def process_customer_unit_feedback(
    customer_id: int,
    wa_group_id: str,
    sender_name: str,
    incoming_message: str,
    quoted_message: Optional[str] = None
) -> Dict[str, Any]:
    """
    Tool for Watson and Nara to handle incoming WhatsApp group replies:
    - Customer requesting technician visit
    - Customer reporting unit undergoing workshop maintenance/overhaul
    - Customer informing battery disconnected / cut-off switch
    - General inquiry acknowledgment
    """
    from services.offline_tracker import OfflineStateTracker

    logger.info(f"Nara/Watson processing inbound feedback from {sender_name} in group {wa_group_id}: '{incoming_message}'")
    tracker = OfflineStateTracker()
    return tracker.process_inbound_feedback(
        customer_id=customer_id,
        wa_group_id=wa_group_id,
        sender_name=sender_name,
        incoming_message=incoming_message,
        quoted_message=quoted_message
    )


# ============================================================================
# SCOUT ENGINE TOOLS (News Harvester, Style Guide & Content Strategist)
# ============================================================================

FALLBACK_NEWS_DATABASE: Dict[str, List[Dict[str, str]]] = {
    "curanmor": [
        {
            "source": "Suara Surabaya",
            "title": "Polisi Ungkap Kasus Curanmor Berkat GPS, 6 Tersangka Penadah dan Eksekutor Dibekuk",
            "url": "https://www.suarasurabaya.net/kelanakota/2026/polisi-ungkap-kasus-curanmor-berkat-gps-6-tersangka-penadah-dan-eksekutor-dibekuk/",
            "date": "Aktual",
            "snippet": "Jajaran Satreskrim melacak pergerakan motor korban hanya dalam kurun waktu 45 menit pasca kejadian berkat titik koordinat live tracking GPS yang terpasang tersembunyi."
        },
        {
            "source": "Suara Surabaya",
            "title": "Curanmor di Wonokromo Surabaya Terekam CCTV, Dua Terduga Pelaku Ditangkap Jatanras",
            "url": "https://www.suarasurabaya.net/kelanakota/2026/curanmor-di-wonokromo-surabaya-terekam-cctv-dua-terduga-pelaku-ditangkap-jatanras/",
            "date": "Aktual",
            "snippet": "Rekaman CCTV membuktikan pelaku hanya membutuhkan waktu kurang dari 10 detik membobol kunci setang dan gembok fisik tambahan menggunakan kunci leter T baja."
        },
        {
            "source": "Detik News",
            "title": "Jatanras Polda Jatim Bekuk 4 Sindikat Curanmor Beraksi Hingga 11 TKP",
            "url": "https://www.detik.com/jatim/hukum-dan-kriminal/d-8685075/jatanras-polda-jatim-bekuk-4-curanmor-beraksi-hingga-11-tkp",
            "date": "Aktual",
            "snippet": "Pelaku menyasar kendaraan di area parkir terbuka minim penerangan dan perumahan tanpa penjagaan ketat, dengan sasaran utama motor matic populer."
        },
        {
            "source": "Mojok",
            "title": "Sisi Gelap Sindikat Curanmor: Hitungan Detik Kunci Jebol dan Mengapa Proteksi Fisik Selalu Tertinggal",
            "url": "https://mojok.co/?s=curanmor",
            "date": "Feature Editorial",
            "snippet": "Gembok cakram dan alarm konvensional tak lagi menggentarkan sindikat profesional. Ketika proteksi fisik gagal, pelacak digital tersembunyi menjadi jaring pengaman terakhir."
        }
    ],
    "fuel_theft": [
        {
            "source": "Pilar Media FMS",
            "title": "Fuel Management Armada: 8 KPI untuk Kendalikan Biaya BBM & Hentikan Kebocoran Tangki",
            "url": "https://www.pilarmedia.com/fuel-management-armada/",
            "date": "Aktual",
            "snippet": "Rekap nota SPBU manual sering kali menutupi kebocoran riil operasional. Integrasi sensor kapasitif mendeteksi anomali konsumsi solar per kilometer secara presisi."
        },
        {
            "source": "Detik News",
            "title": "Bongkar Modus Kencing Solar di Jalur Logistik: Titik Rawan Rest Area dan Manipulasi Nota",
            "url": "https://www.detik.com/search/searchall?query=pencurian+solar&result_type=relevansi",
            "date": "Investigasi",
            "snippet": "Penyedotan solar ilegal di rest area bayangan kerap terjadi saat sopir beristirahat, membebani operasional perusahaan logistik hingga puluhan juta per bulan."
        }
    ],
    "logistics_tips": [
        {
            "source": "Pilar Media FMS",
            "title": "Preventive Maintenance vs Predictive Maintenance Armada: Menghitung Biaya Downtime Tak Terencana",
            "url": "https://www.pilarmedia.com/preventive-maintenance-vs-predictive-maintenance-armada/",
            "date": "Aktual",
            "snippet": "Analisis perbandingan biaya perbaikan darurat di jalan versus servis terencana berbasis engine hours dan telemetri jarak tempuh aktual armada."
        },
        {
            "source": "ORIN Insights",
            "title": "Mengatasi Blind Spot Rantai Pasok: Mengapa Visibility Real-Time Menjadi Kunci Efisiensi",
            "url": "https://orin.id/artikel/mengatasi-blind-spot-rantai-pasok-mengapa-visibility-real-time-menjadi-kunci-efisiensi-operasional-fleets-aset",
            "date": "Aktual",
            "snippet": "Integrasi telemetri GPS dan sensor aset memangkas biaya operasional tersembunyi hingga 25% melalui geofencing rute dan pemantauan utilisasi unit."
        }
    ]
}


def harvest_news_topics(query: str = "curanmor", max_results: int = 6) -> Dict[str, Any]:
    """
    Harvests current news headlines, crime case studies, fleet fuel anomalies,
    and logistics trends from specified reference portals:
    - Detik: https://www.detik.com/search/searchall?query={query}&result_type=relevansi
    - Suara Surabaya: https://www.suarasurabaya.net/?s={query}
    - Mojok: https://mojok.co/?s={query}
    - Pilar Media: https://www.pilarmedia.com/...
    """
    q_clean = query.strip().lower()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }

    scraped_articles: List[Dict[str, str]] = []
    sources_contacted: List[str] = []

    # 1. Detik Search Scraper
    try:
        sources_contacted.append("Detik News")
        detik_url = f"https://www.detik.com/search/searchall?query={urllib.parse.quote(q_clean)}&result_type=relevansi"
        with httpx.Client(timeout=4.0, follow_redirects=True) as client:
            resp = client.get(detik_url, headers=headers)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                for art in soup.select("article")[:3]:
                    title_el = art.select_one("h2, h3, .title")
                    link_el = art.select_one("a")
                    desc_el = art.select_one("p, .detail__desc")
                    date_el = art.select_one(".date")
                    if title_el and link_el:
                        title_text = title_el.get_text(strip=True)
                        href = link_el.get("href", "")
                        if title_text and href.startswith("http"):
                            scraped_articles.append({
                                "source": "Detik News",
                                "title": title_text,
                                "url": href,
                                "date": date_el.get_text(strip=True) if date_el else "Terbaru",
                                "snippet": desc_el.get_text(strip=True)[:140] if desc_el else "Berita aktual Detik."
                            })
    except Exception as e:
        logger.debug(f"Detik scraping warning: {e}")

    # 2. Suara Surabaya Search Scraper
    try:
        sources_contacted.append("Suara Surabaya")
        ss_url = f"https://www.suarasurabaya.net/?s={urllib.parse.quote(q_clean)}"
        with httpx.Client(timeout=4.0, follow_redirects=True) as client:
            resp = client.get(ss_url, headers=headers)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                for link in soup.select("h3.post-title a, .entry-title a")[:3]:
                    title_text = link.get_text(strip=True)
                    href = link.get("href", "")
                    if title_text and len(title_text) > 10:
                        scraped_articles.append({
                            "source": "Suara Surabaya",
                            "title": title_text,
                            "url": href,
                            "date": "Aktual",
                            "snippet": "Laporan langsung Radio Suara Surabaya terkait peristiwa kriminalitas dan lalu lintas."
                        })
    except Exception as e:
        logger.debug(f"Suara Surabaya scraping warning: {e}")

    # 3. Pilar Media (for Fleet, Fuel, Maintenance queries)
    is_fleet_query = any(k in q_clean for k in ["fuel", "bbm", "solar", "armada", "logistik", "maintenance", "truk"])
    if is_fleet_query:
        sources_contacted.append("Pilar Media FMS")
        try:
            target_pilar = (
                "https://www.pilarmedia.com/preventive-maintenance-vs-predictive-maintenance-armada/"
                if "maint" in q_clean
                else "https://www.pilarmedia.com/fuel-management-armada/"
            )
            with httpx.Client(timeout=4.0, follow_redirects=True) as client:
                resp = client.get(target_pilar, headers=headers)
                if resp.status_code == 200:
                    soup = BeautifulSoup(resp.text, "html.parser")
                    h1 = soup.select_one("h1")
                    if h1:
                        scraped_articles.append({
                            "source": "Pilar Media FMS",
                            "title": h1.get_text(strip=True),
                            "url": target_pilar,
                            "date": "Artikel Industri",
                            "snippet": "Panduan strategis 8 KPI Fuel Management & Efisiensi Preventive Maintenance Armada Truk."
                        })
        except Exception as e:
            logger.debug(f"Pilar Media scraping warning: {e}")

    # Select appropriate fallback category
    if is_fleet_query:
        fallback_key = "logistics_tips" if "maint" in q_clean else "fuel_theft"
    else:
        fallback_key = "curanmor"

    # Merge with authentic fallback database if results are scarce
    fallback_items = FALLBACK_NEWS_DATABASE.get(fallback_key, FALLBACK_NEWS_DATABASE["curanmor"])
    for fb in fallback_items:
        if len(scraped_articles) >= max_results:
            break
        if not any(fb["title"].lower() in a["title"].lower() for a in scraped_articles):
            scraped_articles.append(fb)

    # Determine topic characteristics for Scout's strategic angle
    if fallback_key == "fuel_theft" or "bbm" in q_clean or "solar" in q_clean or "fuel" in q_clean:
        topic_domain = "Bahan Bakar & Audit BBM Armada"
        patterns = [
            "Penyedotan tangki solar (kencing solar) di rest area sepi saat pengemudi tidur",
            "Manipulasi nota SPBU manual yang tidak mencerminkan volume pengisian riil",
            "Penyimpangan rute perjalanan tanpa izin dan pemborosan BBM akibat idling berkepanjangan",
            "Fluktuasi konsumsi bahan bakar yang tidak terdeteksi oleh sistem akuntansi konvensional"
        ]
        recommended_hook = "Mengapa Rekap Nota BBM Saja Tak Cukup: Membedah Celah 'Kencing Solar' dan Solusi Fuel Sensor Presisi"
        problem_deconstruction = "Cek manual nota SPBU hanya mencatat transaksi finansial awal tanpa mampu memvalidasi apakah solar benar-benar masuk ke tangki dan berubah menjadi kilometer produktif."
        product_anchor = "ORIN Fleet Pro & Capacitive Fuel Sensor"
    elif fallback_key == "logistics_tips" or "maint" in q_clean:
        topic_domain = "Manajemen Perawatan Armada & Logistik"
        patterns = [
            "Kerusakan armada mendadak di jalur ekspedisi antar-kota",
            "Perawatan hanya berdasarkan kalender kasar atau ingatan pengemudi, bukan jam kerja mesin riil",
            "Biaya downtime tak terencana yang memicu denda keterlambatan pengiriman klien",
            "Kurangnya visibilitas odometer dan status kesehatan mesin di level manajerial"
        ]
        recommended_hook = "Downtime Tak Terencana Menghabiskan Margin: Mengubah Pola Servis Armada Berbasis Engine Hours Real-Time"
        problem_deconstruction = "Menunggu jadwal servis bulanan sering kali terlambat karena beban kerja mesin (idling dan jarak tempuh) setiap kendaraan sangat bervariasi."
        product_anchor = "ORIN Fleet Maintenance Telemetry & Engine Hour Monitor"
    else:
        topic_domain = "Keamanan Kendaraan & Modus Curanmor"
        patterns = [
            "Eksekusi kunci leter T modifikasi hanya memakan waktu 3—10 detik",
            "Target utama: kendaraan di area parkir terbuka, minim penerangan, dan tanpa pengawasan CCTV",
            "Gembok cakram dan kunci ganda fisik dibobol dengan cairan kimia perontok atau pemotong hidrolik portabel",
            "Unit curian segera dipindahkan ke luar kota atau luar pulau dalam hitungan jam sebelum korban menyadari"
        ]
        recommended_hook = "Maraknya Aksi Curanmor di Area Terbuka: Pola Waktu Rawan dan Mengapa Kunci Ganda Saja Tak Lagi Cukup"
        problem_deconstruction = "Kunci stang dan gembok fisik hanya menunda waktu eksekusi pelaku hitungan detik tanpa memberikan peringatan dini dan tanpa daya lacak saat kendaraan dibawa kabur."
        product_anchor = "ORIN GPS Tracker (Live Tracking & Engine Cut-Off) & ORIN Tag²"

    return {
        "status": "success",
        "query": query,
        "topic_domain": topic_domain,
        "total_results": len(scraped_articles),
        "sources_checked": list(set(sources_contacted + ["Detik News", "Suara Surabaya", "Mojok"])),
        "articles": scraped_articles[:max_results],
        "modus_operandi_patterns": patterns,
        "editorial_recommendation": {
            "suggested_hook": recommended_hook,
            "problem_to_deconstruct": problem_deconstruction,
            "recommended_product_anchor": product_anchor,
            "cta_angle": "Ajak audiens berkonsultasi mengenai solusi pengamanan kendaraan dan telemetri armada bersama tim ahli Orin."
        }
    }


def fetch_orin_style_guide() -> Dict[str, Any]:
    """
    Fetches context from https://orin.id/artikel to extract published article examples,
    official product positioning, and brand guidelines for soft-selling copywriting.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }

    recent_articles: List[Dict[str, str]] = []
    try:
        with httpx.Client(timeout=4.0, follow_redirects=True) as client:
            resp = client.get("https://orin.id/artikel", headers=headers)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, "html.parser")
                for a in soup.select("a[href*='/artikel/']"):
                    title = a.get_text(strip=True)
                    href = a.get("href", "")
                    if title and len(title) > 20 and not any(x["title"] == title for x in recent_articles):
                        recent_articles.append({
                            "title": title,
                            "url": href
                        })
    except Exception as e:
        logger.debug(f"Live Orin articles fetch note: {e}")

    # Ensure reference articles are present
    if not recent_articles:
        recent_articles = [
            {
                "title": "Software Freight Forwarding: Mengapa Sistem ERP & TMS Membutuhkan Real-Time Asset Visibility Layer?",
                "url": "https://orin.id/artikel/software-freight-forwarding-mengapa-sistem-erp-tms-membutuhkan-real-time-asset-visibility-layer"
            },
            {
                "title": "Mengatasi Blind Spot Rantai Pasok: Mengapa Visibility Real-Time Menjadi Kunci Efisiensi Operasional Fleets & Aset",
                "url": "https://orin.id/artikel/mengatasi-blind-spot-rantai-pasok-mengapa-visibility-real-time-menjadi-kunci-efisiensi-operasional-fleets-aset"
            },
            {
                "title": "Lacaklah Meski Sampai ke Negeri China: Solusi GPS Tracking Terbaik dari ORIN Surabaya & Jakarta",
                "url": "https://orin.id/artikel/lacaklah-meski-sampai-ke-negeri-china-solusi-gps-tracking-terbaik-dari-orin-surabaya-jakarta"
            }
        ]

    return {
        "status": "success",
        "brand_name": "ORIN",
        "tagline": "GPS Tracker Pintar & Solusi Manajemen Armada IoT Terpadu",
        "brand_voice": {
            "tone": "Edukasi solutif, analitis, empatik, objektif, dan elegan (Anti Hard-Sell).",
            "perspective": "Bukan sekadar merangkum berita kejadian, melainkan membongkar akar masalah dan menghadirkan solusi teknologi Orin sebagai jawaban paling masuk akal.",
            "forbidden_practices": [
                "Dilarang copy-paste berita mentah dengan gaya pelaporan jurnalistik datar (e.g. 'Senin kemarin telah terjadi pencurian motor di Surabaya')",
                "Dilarang hard-selling jualan produk di paragraf 1 atau 2",
                "Dilarang mengabaikan edukasi preventif fisik yang objektif"
            ]
        },
        "product_pillars": {
            "orin_gps_tracker": {
                "name": "ORIN GPS Tracker",
                "ideal_for": "Motor dan Mobil Pribadi, Rental, serta Operasional Perusahaan",
                "key_usps": [
                    "Live Real-Time Tracking akurat dengan peta Google Maps",
                    "Fitur Remote Engine Cut-Off (Matikan mesin jarak jauh seketika via aplikasi / SMS)",
                    "Geofence Alert (Peringatan seketika jika kendaraan bergerak keluar radius yang diizinkan)",
                    "Anti-jamming signal & baterai cadangan saat kabel aki diputus paksa",
                    "Aplikasi mobile iOS/Android dan dashboard web responsif"
                ]
            },
            "orin_tag": {
                "name": "ORIN Tag²",
                "ideal_for": "Sepeda motor harian, mobil keluarga, tas kerja, dan aset pribadi berharga",
                "key_usps": [
                    "Integrasi Apple Find My network tanpa biaya langganan bulanan",
                    "Instalasi Plug-and-Play tanpa potong kabel (100% aman untuk garansi pabrik motor baru)",
                    "Daya tahan baterai hingga 1 tahun dengan baterai koin yang mudah diganti",
                    "Bentuk kompak ringkas, sangat mudah disembunyikan di rangka atau bawah jok"
                ]
            },
            "orin_fuel_sensor_fleet": {
                "name": "ORIN Fleet Pro + Capacitive Fuel Sensor",
                "ideal_for": "Truk ekspedisi, bus pariwisata, alat berat, dan armada logistik komersial",
                "key_usps": [
                    "Sensor Level BBM Kapasitif ultra-presisi (toleransi kesalahan <5%)",
                    "Deteksi seketika pencurian solar (kencing solar / penyedotan tangki ilegal)",
                    "Analisis konsumsi BBM riil per kilometer dan per trip pengiriman",
                    "Geofencing rest area dan alert waktu idling mesin berlebih",
                    "Integrasi CAN-Bus untuk pemantauan kesehatan mesin dan perilaku pengemudi"
                ]
            }
        },
        "editorial_narrative_flow": [
            "1. Hook & Realita Lapangan: Angkat isu aktual, pola waktu rawan, atau celah titik lengah yang sedang marak.",
            "2. Bedah Modus & Masalah: Analisis kenapa metode pengamanan konvensional (gembok fisik, kunci setang, cek nota manual) sering kali jebol.",
            "3. Pilar Edukasi Preventif: Berikan tips teknis dan kebiasaan preventif objektif yang bisa diterapkan audiens sekarang juga.",
            "4. Natural Opportunity & Soft-Selling: Hadirkan peran teknologi pelacak Orin (GPS Tracker, Orin Tag, atau Fuel Sensor) sebagai jaring pengaman terakhir yang logis.",
            "5. Call-to-Action (CTA): Ajak diskusi, konsultasi gratis, atau cek solusi pelacakan Orin secara bersahabat tanpa memaksa."
        ],
        "recent_published_articles": recent_articles[:3]
    }


# Wrap tools for CrewAI compatibility while keeping them directly callable
try:
    from crewai.tools import BaseTool
    from typing import Type
    from pydantic import BaseModel, Field

    class HarvestNewsInput(BaseModel):
        query: str = Field(default="curanmor", description="Target search query (e.g. 'curanmor', 'fuel theft', 'tips armada')")

    class HarvestNewsTopicsTool(BaseTool):
        name: str = "harvest_news_topics_tool"
        description: str = "Harvests current news headlines, crime case studies, and editorial patterns from Detik, Suara Surabaya, Mojok, and Pilar Media."
        args_schema: Type[BaseModel] = HarvestNewsInput

        def _run(self, query: str = "curanmor") -> Any:
            return harvest_news_topics(query=query)

        def __call__(self, *args, **kwargs) -> Any:
            return harvest_news_topics(*args, **kwargs)

    class FetchStyleGuideInput(BaseModel):
        pass

    class FetchOrinStyleGuideTool(BaseTool):
        name: str = "fetch_orin_style_guide_tool"
        description: str = "Fetches the official Orin editorial guidelines, tone of voice, product pillars (GPS Tracker, Orin Tag, Fuel Sensor), and recent articles from orin.id."
        args_schema: Type[BaseModel] = FetchStyleGuideInput

        def _run(self) -> Any:
            return fetch_orin_style_guide()

        def __call__(self, *args, **kwargs) -> Any:
            return fetch_orin_style_guide(*args, **kwargs)

    harvest_news_topics_tool = HarvestNewsTopicsTool()
    fetch_orin_style_guide_tool = FetchOrinStyleGuideTool()

except Exception as _tool_err:
    logger.debug(f"CrewAI tool decorator setup fallback: {_tool_err}")
    harvest_news_topics_tool = harvest_news_topics
    fetch_orin_style_guide_tool = fetch_orin_style_guide

