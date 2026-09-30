import logging
from typing import Optional
from fastapi import APIRouter, HTTPException

from core.state import add_kanban_task
from crew.tools import fetch_nara_offline_report, process_customer_unit_feedback
from services.offline_tracker import (
    save_customer_group_mapping,
    get_all_customer_group_mappings,
    save_telemetry_cache,
    get_telemetry_cache
)
from models.nara import NaraFeedbackRequest, NaraDispatchRequest, CustomerGroupMappingRequest

logger = logging.getLogger("virtual_office.routers.nara")
router = APIRouter(prefix="/api/nara", tags=["Nara Telemetry"])


@router.get("/test-run")
def run_nara_engine_test(
    force_audit: bool = False,
    day_override: Optional[int] = None,
    limit: int = 100,
    max_pages: Optional[int] = 1,
    simulate_dispatch: bool = False,
    refresh: bool = False
):
    """
    Nara Engine Offline Telemetry:
    1. If refresh=False (default), loads immediately from local SQLite database cache if available.
    2. If refresh=True (or cache is empty), makes a live HTTP request to Orin Admin API,
       applies CAM unit grace rule (> 72h offline), and persists the report to SQLite cache.
    """
    logger.info(f"Nara Engine test run: refresh={refresh}, force_audit={force_audit}, day_override={day_override}, limit={limit}")

    # Check database cache first if not explicitly refreshing
    if not refresh:
        cached_report = get_telemetry_cache()
        if cached_report:
            logger.info("Serving Nara offline report from SQLite database cache")
            return cached_report

    try:
        report = fetch_nara_offline_report(
            force_audit=force_audit,
            limit=limit,
            max_pages=max_pages,
            day_override=day_override,
            dispatch_simulation=simulate_dispatch
        )
        report["from_cache"] = False
        # Save to SQLite database cache
        save_telemetry_cache(report)
    except Exception as exc:
        # If live API request fails but we have previous cached data, gracefully return cache
        cached_report = get_telemetry_cache()
        if cached_report:
            logger.warning(f"Live Orin API request failed ({exc}), falling back to SQLite cache")
            cached_report["fallback_warning"] = f"Menampilkan data tersimpan karena live API error: {str(exc)}"
            return cached_report

        logger.error(f"Error during Nara test run: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Gagal menjalankan Nara Engine: {str(exc)}")

    # Update real-time Kanban board
    report_mode = report.get("report_mode", "DELTA")
    summary = report.get("summary", {})
    new_task = add_kanban_task({
        "title": f"Nara Telemetri: {summary.get('total_valid_offline', 0)} Unit ({report_mode})",
        "agent_id": "nara",
        "agent_name": "Nara",
        "role_badge": "REMINDER CS",
        "status": "DONE",
    })

    report["kanban_task"] = new_task
    return report


@router.post("/dispatch")
def dispatch_nara_reports(req: Optional[NaraDispatchRequest] = None):
    """
    Dispatches compiled Nara reports to Customer PRO WhatsApp Groups via Watson Gateway:
    - Jitter delay: 15-45s between groups
    - Active 'composing' typing simulator
    - Notification hashing and anti-spam protection
    """
    force_audit = req.force_audit if req else False
    day_override = req.day_override if req else None
    customer_ids = req.customer_ids if req else None

    report = fetch_nara_offline_report(
        force_audit=force_audit,
        limit=100,
        day_override=day_override,
        dispatch_simulation=True,
        customer_ids=customer_ids
    )

    dispatch_res = report.get("dispatch_simulation") or {}

    new_task = add_kanban_task({
        "title": f"Watson Dispatch: {dispatch_res.get('total_groups_dispatched', 0)} Grup PRO (Anti-Ban)",
        "agent_id": "watson",
        "agent_name": "Watson",
        "role_badge": "TECH ESCALATION",
        "status": "DONE",
    })

    return {
        "status": "success",
        "report_mode": report.get("report_mode"),
        "dispatch_result": dispatch_res,
        "kanban_task": new_task
    }


@router.post("/feedback")
def handle_customer_group_feedback(req: NaraFeedbackRequest):
    """
    Watson to Nara Inbound Feedback Loop:
    When a customer group member replies to an offline warning message:
    - Watson routes context to Nara
    - Nara classifies intent (Technician Request, Workshop Maintenance, Battery Disconnected)
    - If workshop maintenance: pauses alerts for 7 days
    - Nara crafts professional technical reply for Watson to deliver
    """
    feedback_result = process_customer_unit_feedback(
        customer_id=req.customer_id,
        wa_group_id=req.wa_group_id,
        sender_name=req.sender_name or "Pelanggan",
        incoming_message=req.message,
        quoted_message=req.quoted_message
    )

    intent = feedback_result.get("intent_category", "GENERAL")
    new_task = add_kanban_task({
        "title": f"Feedback Respon: {req.sender_name} [{intent}]",
        "agent_id": "watson",
        "agent_name": "Watson",
        "role_badge": "TECH ESCALATION",
        "status": "DONE",
    })
    feedback_result["kanban_task"] = new_task

    return {
        "status": "success",
        "feedback": feedback_result
    }


@router.post("/customer-group")
def set_customer_group_mapping(req: CustomerGroupMappingRequest):
    """
    Sets or updates WhatsApp Group name for a customer account.
    Applies at the Customer Account level: all units under this customer account
    automatically inherit this WhatsApp group name and ID.
    """
    result = save_customer_group_mapping(
        customer_id=req.customer_id,
        customer_name=req.customer_name or f"Pelanggan #{req.customer_id}",
        wa_group_name=req.wa_group_name,
        wa_group_id=req.wa_group_id,
        pic=req.pic
    )

    new_task = add_kanban_task({
        "title": f"WA Group Mapped: {req.customer_name or req.customer_id} -> '{req.wa_group_name}'",
        "agent_id": "nara",
        "agent_name": "Nara",
        "role_badge": "REMINDER CS",
        "status": "DONE",
    })
    result["kanban_task"] = new_task
    return result


@router.get("/customer-groups")
def list_customer_group_mappings():
    """Lists all customer group mappings."""
    return {
        "status": "success",
        "mappings": get_all_customer_group_mappings()
    }
