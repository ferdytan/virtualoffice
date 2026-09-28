import os
import re
import time
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
import httpx
from dateutil import parser as date_parser

logger = logging.getLogger("virtual_office.orin_telemetry")

DEFAULT_ORIN_API_URL = "https://admin-api.orin.id/api/devices/offline"
DEFAULT_ORIN_BEARER_TOKEN = "20639|AwZwUDmpoUa2E8XeVwTvzDNB7glEckVl2uyRPYl9"
CAM_OFFLINE_THRESHOLD_HOURS = 72.0  # 3 days


class OrinTelemetryClient:
    """
    HTTP client for pulling telemetry data from Orin Admin API.
    Supports pagination loops, token authorization, and structured error handling.
    """

    def __init__(self, api_url: Optional[str] = None, bearer_token: Optional[str] = None):
        self.api_url = api_url or os.getenv("ORIN_API_URL", DEFAULT_ORIN_API_URL)
        self.bearer_token = bearer_token or os.getenv("ORIN_API_TOKEN", DEFAULT_ORIN_BEARER_TOKEN)

    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.bearer_token}",
            "Accept": "application/json",
            "User-Agent": "VirtualOfficeAI-NaraEngine/2.0"
        }

    def fetch_offline_devices(
        self,
        page: int = 1,
        limit: int = 100,
        max_pages: Optional[int] = 1,
        fetch_all: bool = False,
        timeout: float = 25.0
    ) -> Dict[str, Any]:
        """
        Fetches offline devices from the Orin API.
        If fetch_all is True, iteratively pages through all available records.
        If max_pages is specified, fetches up to max_pages.
        """
        all_devices: List[Dict[str, Any]] = []
        current_page = page
        total_pages = 1
        total_records = 0
        pages_retrieved = 0

        with httpx.Client(timeout=timeout) as client:
            while True:
                params = {
                    "page": current_page,
                    "sortBy": "last_status_update_dt",
                    "sort": "desc",
                    "limit": limit
                }

                logger.info(f"Fetching Orin telemetry devices: page={current_page}, limit={limit}")
                try:
                    resp = client.get(self.api_url, headers=self._get_headers(), params=params)
                    resp.raise_for_status()
                    payload = resp.json()
                except httpx.HTTPError as exc:
                    logger.error(f"HTTP error while fetching Orin telemetry on page {current_page}: {exc}")
                    if not all_devices:
                        raise
                    break
                except Exception as exc:
                    logger.error(f"Unexpected error fetching Orin telemetry: {exc}")
                    if not all_devices:
                        raise
                    break

                page_data = payload.get("data", [])
                meta = payload.get("meta", {})
                total_pages = meta.get("total_page", 1)
                total_records = meta.get("total", len(page_data))

                if isinstance(page_data, list):
                    all_devices.extend(page_data)

                pages_retrieved += 1

                if not fetch_all and max_pages is not None and pages_retrieved >= max_pages:
                    break

                if current_page >= total_pages or not page_data:
                    break

                current_page += 1

        logger.info(
            f"Orin telemetry fetch complete: {len(all_devices)} devices fetched across {pages_retrieved} pages "
            f"(Total in system: {total_records})"
        )

        return {
            "status": "success",
            "devices": all_devices,
            "total_count": total_records,
            "pages_retrieved": pages_retrieved,
            "total_pages": total_pages,
            "fetched_at": datetime.now().isoformat()
        }


def is_cam_device(device: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Checks whether a device is a Camera / Dashcam unit based on device_name,
    device_type, or public_name.
    Returns (is_cam, detected_pattern).
    """
    name = str(device.get("device_name") or "")
    dtype = device.get("device_type") or {}
    tname = str(dtype.get("name") or "")
    pname = str(dtype.get("public_name") or "")

    combined_text = f"{name} {tname} {pname}".lower()

    # Search for 'cam' keyword as a substring or word
    if "cam" in combined_text:
        return True, "Keyword 'CAM' in device identity"

    return False, ""


def parse_device_timestamp(dt_str: Optional[str]) -> Optional[datetime]:
    """
    Parses timestamps from various date string formats returned by Orin API.
    """
    if not dt_str:
        return None
    try:
        dt = date_parser.parse(dt_str)
        # Normalize to naive local time for duration calculation
        if dt.tzinfo is not None:
            dt = dt.astimezone().replace(tzinfo=None)
        return dt
    except Exception:
        return None


def calculate_offline_duration(
    device: Dict[str, Any],
    now: Optional[datetime] = None
) -> Tuple[float, Optional[datetime], str]:
    """
    Calculates offline duration in hours, the parsed offline datetime,
    and a human-friendly duration string.
    """
    now = now or datetime.now()

    # Prefer last_status_update, fall back to last_data.dt or updated_at
    dt_str = (
        device.get("last_status_update")
        or (device.get("last_data") or {}).get("dt")
        or device.get("updated_at")
    )

    parsed_dt = parse_device_timestamp(dt_str)
    if not parsed_dt:
        return 0.0, None, "Waktu offline tidak diketahui"

    delta = now - parsed_dt
    hours = max(0.0, delta.total_seconds() / 3600.0)

    # Human-friendly string
    days = int(hours // 24)
    rem_hours = int(hours % 24)
    if days > 0:
        duration_str = f"{days} hari {rem_hours} jam"
    else:
        duration_str = f"{int(hours)} jam"

    return hours, parsed_dt, duration_str


def filter_nara_devices(
    devices: List[Dict[str, Any]],
    now: Optional[datetime] = None,
    cam_threshold_hours: float = CAM_OFFLINE_THRESHOLD_HOURS
) -> Dict[str, Any]:
    """
    Applies Nara Core Business Rules:
    1. Special Unit Rule (CAM Rule):
       - If contains 'CAM' (case-insensitive):
         ONLY included in offline warning list if offline duration > 3 days (72 hours).
         Otherwise, suppressed (under grace period).
    2. Standard Unit Rule:
       - Regular GPS/telemetry units are included directly as offline.

    Enriches each device with normalized metadata.
    """
    now = now or datetime.now()

    valid_offline_devices: List[Dict[str, Any]] = []
    suppressed_cam_devices: List[Dict[str, Any]] = []

    cam_count = 0
    cam_qualified = 0
    non_cam_count = 0

    for dev in devices:
        is_cam, cam_reason = is_cam_device(dev)
        hours_offline, parsed_dt, duration_str = calculate_offline_duration(dev, now)

        user = dev.get("user") or {}
        customer_id = user.get("id") or 0
        customer_name = user.get("name") or "Pelanggan Umum"
        customer_phone = user.get("whatsapp_number") or user.get("phone_number") or ""

        enriched_device = {
            "id": dev.get("id"),
            "device_sn": dev.get("device_sn"),
            "device_name": dev.get("device_name") or "Unnamed Device",
            "nopol": dev.get("nopol") or dev.get("device_name") or "-",
            "device_type": (dev.get("device_type") or {}).get("name") or "Standard GPS",
            "status": dev.get("device_status") or "OFFLINE",
            "is_cam": is_cam,
            "offline_hours": round(hours_offline, 2),
            "offline_days": round(hours_offline / 24.0, 1),
            "offline_duration_str": duration_str,
            "offline_since": parsed_dt.strftime("%Y-%m-%d %H:%M:%S") if parsed_dt else "-",
            "customer_id": customer_id,
            "customer_name": customer_name,
            "customer_phone": customer_phone,
            "raw_last_update": dev.get("last_status_update")
        }

        if is_cam:
            cam_count += 1
            if hours_offline > cam_threshold_hours:
                # CAM offline > 72 hours qualifies for offline alert
                cam_qualified += 1
                enriched_device["filter_status"] = "QUALIFIED"
                enriched_device["rule_note"] = f"Unit CAM offline {duration_str} (> 72 jam threshold)"
                valid_offline_devices.append(enriched_device)
            else:
                # CAM offline <= 72 hours is suppressed
                enriched_device["filter_status"] = "SUPPRESSED_CAM_GRACE"
                enriched_device["rule_note"] = f"Unit CAM dalam masa toleransi ({duration_str} <= 72 jam)"
                suppressed_cam_devices.append(enriched_device)
        else:
            non_cam_count += 1
            enriched_device["filter_status"] = "QUALIFIED"
            enriched_device["rule_note"] = f"Unit GPS reguler offline ({duration_str})"
            valid_offline_devices.append(enriched_device)

    return {
        "valid_offline_devices": valid_offline_devices,
        "suppressed_cam_devices": suppressed_cam_devices,
        "statistics": {
            "total_fetched": len(devices),
            "total_reportable": len(valid_offline_devices),
            "cam_total": cam_count,
            "cam_qualified": cam_qualified,
            "cam_suppressed": len(suppressed_cam_devices),
            "non_cam_offline": non_cam_count,
            "evaluated_at": now.strftime("%Y-%m-%d %H:%M:%S")
        }
    }
