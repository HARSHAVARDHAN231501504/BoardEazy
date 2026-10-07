"""
Fast2SMS service for BoardEazy.
================================
Sends SMS to Indian numbers using Fast2SMS's Quick SMS (DLT-free) API.
https://docs.fast2sms.com

Exposes:
    send_sms(phone_number, message) -> dict

Architecture rule:
    This module only talks to Fast2SMS.
    No railway / booking / RAC business logic lives here.
"""

import os
import logging

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

FAST2SMS_API_KEY = os.getenv("FAST2SMS_API_KEY", "")
FAST2SMS_URL = "https://www.fast2sms.com/dev/bulkV2"


def _credentials_ok() -> bool:
    return bool(FAST2SMS_API_KEY)


def _normalise_phone(phone: str) -> str:
    """
    Fast2SMS expects a 10-digit Indian number (no country code, no +91).
    Examples:
        '+919876543210' → '9876543210'
        '09876543210'   → '9876543210'
        '9876543210'    → '9876543210'  (already correct)
    """
    cleaned = phone.strip().replace(" ", "").replace("-", "")
    if cleaned.startswith("+91"):
        cleaned = cleaned[3:]
    elif cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = cleaned[2:]
    elif cleaned.startswith("0") and len(cleaned) == 11:
        cleaned = cleaned[1:]
    return cleaned


async def send_sms(phone_number: str, message: str) -> dict:
    """
    Send an SMS via Fast2SMS Quick SMS API.

    Args:
        phone_number: Indian mobile number — any common format accepted.
        message:      SMS body text.

    Returns:
        {
            "success": bool,
            "request_id": str | None,
            "error":      str | None
        }
    """
    if not _credentials_ok():
        logger.error("Fast2SMS API key not configured in .env")
        return {"success": False, "request_id": None,
                "error": "FAST2SMS_API_KEY missing from .env"}

    to = _normalise_phone(phone_number)

    headers = {
        "authorization": FAST2SMS_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "route": "q",          # Quick SMS — no DLT template needed
        "message": message,
        "language": "english",
        "flash": 0,
        "numbers": to,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                FAST2SMS_URL,
                json=payload,
                headers=headers,
            )

        data = response.json()
        logger.debug("Fast2SMS raw response: %s", data)

        if response.status_code == 200 and data.get("return") is True:
            request_id = data.get("request_id")
            logger.info("SMS sent | to=%s | request_id=%s", to, request_id)
            return {"success": True, "request_id": request_id, "error": None}

        # API returned an error body
        error_msg = str(data.get("message", data))
        logger.error("Fast2SMS error | to=%s | %s", to, error_msg)
        return {"success": False, "request_id": None, "error": error_msg}

    except httpx.RequestError as exc:
        logger.exception("Network error sending SMS to %s", to)
        return {"success": False, "request_id": None, "error": str(exc)}


# ---------------------------------------------------------------------------
# SMS message templates — same as other providers, kept consistent
# ---------------------------------------------------------------------------

def msg_booking_confirmed(
    pnr: str,
    train_number: str,
    train_name: str,
    journey_date: str,
    from_station: str,
    to_station: str,
    passengers: list[dict],
    total_fare: int,
) -> str:
    sub_pnrs = ", ".join(
        f"{p.get('name', 'Passenger')} ({p.get('subPnr', '')})"
        for p in passengers
    )
    return (
        f"BoardEazy: Booking confirmed!\n"
        f"PNR: {pnr} | Train: {train_number} {train_name}\n"
        f"Date: {journey_date} | {from_station} -> {to_station}\n"
        f"Passengers: {sub_pnrs}\n"
        f"Total: Rs.{total_fare}\n"
        f"Show QR at gate. Safe journey!"
    )


def msg_station_entry(
    name: str, sub_pnr: str, coach: str, seat: str,
    gate_id: str, scan_time: str,
) -> str:
    return (
        f"BoardEazy: Hi {name}, station entry verified.\n"
        f"Sub-PNR: {sub_pnr} | Coach {coach}, Seat {seat}\n"
        f"Gate: {gate_id} at {scan_time}. Proceed to your coach!"
    )


def msg_boarded(
    name: str, sub_pnr: str, coach: str, seat: str,
    train_name: str, scan_time: str,
) -> str:
    return (
        f"BoardEazy: {name} has BOARDED!\n"
        f"Sub-PNR: {sub_pnr} | {train_name}\n"
        f"Coach {coach}, Seat {seat} at {scan_time}. Enjoy your journey!"
    )


def msg_rac_upgrade(
    name: str, rac_id: str, coach: str, seat: str, train_name: str,
) -> str:
    return (
        f"BoardEazy RAC Upgrade! Hi {name} ({rac_id}), your berth is confirmed.\n"
        f"Coach {coach}, Seat {seat} on {train_name}.\n"
        f"Proceed to your coach immediately!"
    )
