import os
import time
import random
import logging
from typing import Dict, Any, List, Optional

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

