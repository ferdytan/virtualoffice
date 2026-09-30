import os
import sys
import unittest
from datetime import datetime, timedelta

# Ensure backend root is on Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from services.orin_telemetry import (
    OrinTelemetryClient,
    is_cam_device,
    calculate_offline_duration,
    filter_nara_devices,
    DEFAULT_ORIN_API_URL,
    DEFAULT_ORIN_BEARER_TOKEN
)
from services.offline_tracker import (
    OfflineStateTracker,
    get_customer_group_mapping,
    save_customer_group_mapping,
    save_telemetry_cache,
    get_telemetry_cache,
    PRO_CUSTOMER_GROUPS,
    init_nara_storage,
    get_db_connection
)


class TestNaraEngine(unittest.TestCase):

    def setUp(self):
        """Prepare fresh test environment before each test."""
        init_nara_storage()
        conn = get_db_connection()
        try:
            with conn:
                conn.execute("DELETE FROM device_states")
                conn.execute("DELETE FROM dispatch_logs")
                conn.execute("DELETE FROM customer_feedback")
                conn.execute("DELETE FROM customer_group_mappings")
                conn.execute("DELETE FROM telemetry_cache")
        finally:
            conn.close()
        self.now = datetime(2026, 9, 29, 10, 0, 0)
        self.tracker = OfflineStateTracker()

    def test_01_orin_telemetry_client_config(self):
        """Validates API client initialization, headers, and token specification."""
        client = OrinTelemetryClient()
        self.assertEqual(client.api_url, DEFAULT_ORIN_API_URL)
        self.assertIn("Bearer 20639|AwZwUDmpoUa2E8XeVwTvzDNB7glEckVl2uyRPYl9", client._get_headers()["Authorization"])
        self.assertEqual(client._get_headers()["Accept"], "application/json")

    def test_02_cam_identification_rule(self):
        """Validates detection of CAM keywords across device name, device type, and public name."""
        test_cases = [
            ({"device_name": "B 9194 BCV - CAM", "device_type": {"name": "MC202N"}}, True),
            ({"device_name": "W1215VE - Front Cam", "device_type": {"name": "MC202L"}}, True),
            ({"device_name": "L8142UR - Dashcam Mobil", "device_type": {"name": "Dashcam"}}, True),
            ({"device_name": "B 1842 KZA - ENGKEL", "device_type": {"name": "MV206"}}, False),
            ({"device_name": "D 9912 ABE - TRUK", "device_type": {"name": "FMB920"}}, False),
        ]
        for dev, expected in test_cases:
            is_cam, _ = is_cam_device(dev)
            self.assertEqual(is_cam, expected, f"Failed CAM check for {dev}")

    def test_03_cam_offline_filter_threshold(self):
        """
        Validates Core Business Rule A:
        - CAM offline <= 72h (3 days) MUST BE SUPPRESSED (Grace Period).
        - CAM offline > 72h MUST BE QUALIFIED (Reported).
        - Non-CAM unit offline is ALWAYS QUALIFIED.
        """
        now = self.now
        # CAM offline 24 hours ago (should be SUPPRESSED)
        cam_recent = {
            "id": 101,
            "device_sn": "SN-CAM-RECENT",
            "device_name": "Truk 01 - Mobile CAM",
            "device_type": {"name": "Dashcam 4G"},
            "device_status": "OFFLINE",
            "last_status_update": (now - timedelta(hours=24)).strftime("%Y-%m-%d %H:%M:%S"),
            "user": {"id": 1001, "name": "PT Logistik Jaya Abadi"}
        }

        # CAM offline 80 hours ago (should QUALIFY)
        cam_old = {
            "id": 102,
            "device_sn": "SN-CAM-OLD",
            "device_name": "Truk 02 - Cabin CAM",
            "device_type": {"name": "MC202N"},
            "device_status": "OFFLINE",
            "last_status_update": (now - timedelta(hours=80)).strftime("%Y-%m-%d %H:%M:%S"),
            "user": {"id": 1001, "name": "PT Logistik Jaya Abadi"}
        }

        # Regular GPS unit offline 5 hours ago (should QUALIFY immediately)
        regular_gps = {
            "id": 103,
            "device_sn": "SN-GPS-REGULAR",
            "device_name": "B 1842 KZA",
            "device_type": {"name": "MV206"},
            "device_status": "OFFLINE",
            "last_status_update": (now - timedelta(hours=5)).strftime("%Y-%m-%d %H:%M:%S"),
            "user": {"id": 1001, "name": "PT Logistik Jaya Abadi"}
        }

        result = filter_nara_devices([cam_recent, cam_old, regular_gps], now=now)
        valid_ids = [d["id"] for d in result["valid_offline_devices"]]
        suppressed_ids = [d["id"] for d in result["suppressed_cam_devices"]]

        # Assertions
        self.assertIn(103, valid_ids, "Regular GPS must qualify")
        self.assertIn(102, valid_ids, "CAM offline > 72h must qualify")
        self.assertIn(101, suppressed_ids, "CAM offline <= 72h must be suppressed")
        self.assertEqual(result["statistics"]["cam_total"], 2)
        self.assertEqual(result["statistics"]["cam_qualified"], 1)
        self.assertEqual(result["statistics"]["cam_suppressed"], 1)
        self.assertEqual(result["statistics"]["non_cam_offline"], 1)

    def test_04_calendar_cycle_day_one_full_audit(self):
        """
        Validates Core Business Rule B (Tanggal 1 Full Audit):
        - On Day 1, ALL units currently offline are included in a comprehensive audit report.
        """
        day_one = datetime(2026, 10, 1, 8, 30, 0)
        devices = [
            {
                "id": 201,
                "device_sn": "SN-AUDIT-1",
                "device_name": "B 1001 ABC",
                "nopol": "B 1001 ABC",
                "device_type": "MV206",
                "status": "OFFLINE",
                "is_cam": False,
                "offline_duration_str": "4 hari 2 jam",
                "offline_since": "2026-09-27 06:00:00",
                "customer_id": 30706,
                "customer_name": "PT RAMA"
            },
            {
                "id": 202,
                "device_sn": "SN-AUDIT-2",
                "device_name": "L 8374 VG",
                "nopol": "L 8374 VG",
                "device_type": "MV206",
                "status": "OFFLINE",
                "is_cam": False,
                "offline_duration_str": "12 jam",
                "offline_since": "2026-09-30 20:00:00",
                "customer_id": 30706,
                "customer_name": "PT RAMA"
            }
        ]

        batch_res = self.tracker.process_telemetry_batch(
            valid_offline_devices=devices,
            now=day_one,
            day_override=1
        )

        self.assertEqual(batch_res["report_mode"], "FULL_AUDIT")
        self.assertTrue(batch_res["is_day_one"])
        self.assertEqual(len(batch_res["grouped_reports"]), 1)

        pt_rama_report = batch_res["grouped_reports"][0]
        self.assertIn("PT RAMA", pt_rama_report["customer_name"])
        self.assertEqual(pt_rama_report["counts"]["total_offline"], 2)
        # Check message content for Full Audit markers
        msg = pt_rama_report["message_text"]
        self.assertIn("LAPORAN AUDIT BULANAN UNIT TELEMETRI", msg)
        self.assertIn("B 1001 ABC", msg)
        self.assertIn("L 8374 VG", msg)
        self.assertIn("Total Unit Offline:* 2", msg)

    def test_05_calendar_cycle_day_two_delta_and_recovered(self):
        """
        Validates Core Business Rule B (Tanggal 2+ Delta & Recovery):
        - Only NEW offline units are highlighted.
        - Summary count of still-offline units is included.
        - Units recovered ONLINE are announced as good news.
        """
        # Step 1: Initial state on day 1 with unit 301 offline
        t1 = datetime(2026, 10, 1, 9, 0, 0)
        self.tracker.process_telemetry_batch(
            valid_offline_devices=[{
                "id": 301,
                "device_sn": "SN-PERSIST",
                "device_name": "B 9999 XYZ",
                "nopol": "B 9999 XYZ",
                "device_type": "MV206",
                "status": "OFFLINE",
                "is_cam": False,
                "offline_duration_str": "1 hari",
                "offline_since": "2026-09-30 09:00:00",
                "customer_id": 1002,
                "customer_name": "Express Trans Cargo"
            }],
            now=t1,
            day_override=1
        )

        # Step 2: Next day (Day 2):
        # Unit 301 recovered (not in offline list).
        # Unit 302 newly died!
        t2 = datetime(2026, 10, 2, 9, 0, 0)
        batch_res = self.tracker.process_telemetry_batch(
            valid_offline_devices=[{
                "id": 302,
                "device_sn": "SN-NEW-DEAD",
                "device_name": "D 8888 NEW",
                "nopol": "D 8888 NEW",
                "device_type": "MV206",
                "status": "OFFLINE",
                "is_cam": False,
                "offline_duration_str": "2 jam",
                "offline_since": "2026-10-02 07:00:00",
                "customer_id": 1002,
                "customer_name": "Express Trans Cargo"
            }],
            now=t2,
            day_override=2
        )

        self.assertEqual(batch_res["report_mode"], "DELTA")
        self.assertFalse(batch_res["is_day_one"])

        reports = batch_res["grouped_reports"]
        self.assertEqual(len(reports), 1)
        r = reports[0]

        # Verify Delta counts
        self.assertEqual(r["counts"]["new_offline"], 1)
        self.assertEqual(r["counts"]["recovered_online"], 1)

        # Verify message text includes newly offline and recovered sections
        msg = r["message_text"]
        self.assertIn("UPDATE STATUS TELEMETRI UNIT", msg)
        self.assertIn("Unit Baru Terdeteksi Offline:", msg)
        self.assertIn("D 8888 NEW", msg)
        self.assertIn("Kabar Baik! Unit Kembali Online:", msg)
        self.assertIn("B 9999 XYZ", msg)

    def test_06_customer_pro_group_mapping(self):
        """Validates mapping of enterprise customer IDs to WhatsApp groups."""
        save_customer_group_mapping(30706, "PT RAMA", "Fleet Ops PT RAMA x Orin Support", "120363028391823@g.us")
        rama_meta = get_customer_group_mapping(30706, "PT RAMA")
        self.assertEqual(rama_meta["wa_group_name"], "Fleet Ops PT RAMA x Orin Support")
        self.assertEqual(rama_meta["wa_group_id"], "120363028391823@g.us")

        logistik_meta = get_customer_group_mapping(1001, "PT Logistik Jaya Abadi")
        self.assertEqual(logistik_meta["wa_group_name"], "Logistik Jaya - Armada & GPS Monitor")

        # Test custom customer account group mapping (e.g. LNJ -> ONB LNJ)
        lnj_res = save_customer_group_mapping("LNJ", "LNJ", "ONB LNJ")
        self.assertEqual(lnj_res["wa_group_name"], "ONB LNJ")
        lnj_meta = get_customer_group_mapping("LNJ", "LNJ")
        self.assertEqual(lnj_meta["wa_group_name"], "ONB LNJ")

        # Unmapped customer test: should return empty group and has_wa_group False (+ icon in UI)
        unknown_meta = get_customer_group_mapping(99999, "PT Maju Terus")
        self.assertEqual(unknown_meta["wa_group_name"], "")
        self.assertFalse(unknown_meta["has_wa_group"])

    def test_07_watson_dispatch_simulation(self):
        """Validates simulated dispatch with anti-ban jitter (15-45s) and composing status."""
        test_reports = [{
            "customer_id": 30706,
            "customer_name": "PT RAMA",
            "wa_group_id": "120363028391823@g.us",
            "wa_group_name": "Fleet Ops PT RAMA x Orin Support",
            "report_mode": "FULL_AUDIT",
            "notification_hash": "test_hash_123",
            "counts": {"total_offline": 3},
            "message_text": "Sample broadcast text"
        }]

        dispatch_res = self.tracker.dispatch_reports(
            grouped_reports=test_reports,
            jitter_min=15,
            jitter_max=45,
            simulate=True
        )

        self.assertTrue(dispatch_res["anti_ban_active"])
        self.assertEqual(dispatch_res["total_groups_dispatched"], 1)
        log = dispatch_res["dispatch_logs"][0]
        self.assertGreaterEqual(log["composing_seconds"], 3.0)
        self.assertIn("DELIVERED", log["status"])

    def test_08_inbound_feedback_technician_request(self):
        """Validates Watson to Nara feedback loop when customer asks for a technician."""
        res = self.tracker.process_inbound_feedback(
            customer_id=30706,
            wa_group_id="120363028391823@g.us",
            sender_name="Pak Bambang",
            incoming_message="Tolong kirim teknisi untuk cek unit L 8374 VG di pool Surabaya ya."
        )

        self.assertEqual(res["intent_category"], "TECHNICIAN_REQUEST")
        self.assertIn("tiket eskalasi", res["nara_reply"].lower())
        self.assertIn("lokasi pool", res["nara_reply"].lower())

    def test_09_inbound_feedback_workshop_maintenance(self):
        """Validates Watson to Nara feedback loop when unit is in workshop (pauses 7 days)."""
        res = self.tracker.process_inbound_feedback(
            customer_id=30706,
            wa_group_id="120363028391823@g.us",
            sender_name="Pak Hendra",
            incoming_message="Unit sedang masuk bengkel untuk overhaul mesin minggu ini."
        )

        self.assertEqual(res["intent_category"], "WORKSHOP_MAINTENANCE")
        self.assertEqual(res["state_action"], "maintenance_mode_paused_7_days")
        self.assertIn("servis/perawatan bengkel", res["nara_reply"])

    def test_10_inbound_feedback_battery_disconnected(self):
        """Validates Watson to Nara feedback loop when battery is cut off / disconnected."""
        res = self.tracker.process_inbound_feedback(
            customer_id=30706,
            wa_group_id="120363028391823@g.us",
            sender_name="Mekanik Rudi",
            incoming_message="Aki mobil dilepas karena armada sedang parkir lama."
        )

        self.assertEqual(res["intent_category"], "BATTERY_DISCONNECTED")
        self.assertIn("saklar aki (cut-off) dimatikan / aki dilepas", res["nara_reply"])
        self.assertIn("backup battery", res["nara_reply"])

    def test_11_nara_api_key_alias_and_crlf_sanitization(self):
        """Validates that NARA_API_KEY with Windows CRLF is properly cleaned."""
        test_key = "20639|AwZwUDmpoUa2E8XeVwTvzDNB7glEckVl2uyRPYl9"
        os.environ["NARA_API_KEY"] = f"{test_key}\r\n"
        try:
            client = OrinTelemetryClient()
            self.assertEqual(client.bearer_token, test_key)
            self.assertFalse(client.bearer_token.endswith("\r"))
            self.assertFalse(client.bearer_token.endswith("\n"))
        finally:
            os.environ.pop("NARA_API_KEY", None)

    def test_12_modular_api_endpoints(self):
        """Validates that the refactored modular FastAPI app works properly."""
        from fastapi.testclient import TestClient
        from server import app

        client = TestClient(app)
        res = client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["status"] == "ok")

        agents_res = client.get("/api/agents")
        self.assertEqual(agents_res.status_code, 200)
        self.assertEqual(len(agents_res.json()["agents"]), 5)

    def test_13_telemetry_cache_and_db_persistence(self):
        """
        Validates:
        1. Telemetry report caching in SQLite database.
        2. Customer name and WA group name stored in database overrides API load.
        3. Updating customer group mapping syncs cached report dynamically.
        """
        sample_report = {
            "status": "success",
            "report_mode": "DELTA",
            "calendar_day": 29,
            "valid_devices": [
                {
                    "id": 8801,
                    "customer_id": 9901,
                    "customer_name": "API Name PT Alpha",
                    "nopol": "B 1234 ABC",
                    "wa_group_name": "",
                    "has_wa_group": False
                }
            ],
            "customer_reports": [
                {
                    "customer_id": 9901,
                    "customer_name": "API Name PT Alpha",
                    "wa_group_name": "",
                    "has_wa_group": False
                }
            ]
        }

        # 1. Save to cache
        save_telemetry_cache(sample_report)
        cached = get_telemetry_cache()
        self.assertIsNotNone(cached)
        self.assertTrue(cached.get("from_cache"))
        self.assertEqual(cached["valid_devices"][0]["customer_name"], "API Name PT Alpha")
        self.assertFalse(cached["valid_devices"][0]["has_wa_group"])

        # 2. Save custom customer name & WA group name in DB
        save_customer_group_mapping(
            customer_id=9901,
            customer_name="PT Alpha Custom Fleet",
            wa_group_name="ONB Alpha Fleet Support"
        )

        # 3. Retrieve from cache: should reflect updated customer name and wa_group_name!
        updated_cached = get_telemetry_cache()
        self.assertIsNotNone(updated_cached)
        cached_dev = updated_cached["valid_devices"][0]
        self.assertEqual(cached_dev["customer_name"], "PT Alpha Custom Fleet")
        self.assertEqual(cached_dev["wa_group_name"], "ONB Alpha Fleet Support")
        self.assertTrue(cached_dev["has_wa_group"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
