"""
MSG91 SMS service for BoardEazy.
==================================
Sends SMS to Indian numbers using MSG91's Send SMS API v2.
https://msg91.com/help/api/send-sms

Exposes:
    send_sms(phone_number, message) -> dict

Architecture rule:
    This module only talks to MSG91.
    No railway / booking / RAC business logic lives here.
"""

import os
import logging

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

MSG91_AUTH_KEY   = os.getenv("MSG91_AUTH_KEY", "")
MSG91_SENDER_ID  = os.getenv("MSG91_SENDER_ID", "BOARDZ")   # 6-char alpha sender ID
MSG91_ROUTE      = "4"   # Route 4 = Transactional SMS
MSG91_URL        = "https://api.msg91.com/api/v2/sendsms"


def _credentials_ok() -> bool:
    return bool(MSG91_AUTH_KEY)


def _normalise_phone(phone: str) -> str:
    """
    MSG91 expects a 10-digit Indian number (no country code, no +91).
    Examples:
        '+919876543210' → '9876543210'
        '09876543210'   → '9876543210'
        '9876543210'    → '9876543210'
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
    Send an SMS via MSG91.

    Args:
        phone_number: Indian mobile number — any common format accepted.
        message:      SMS body text.

    Returns:
        {
            "success":    bool,
            "request_id": str | None,
            "error":      str | None
        }
    """
    if not _credentials_ok():
        logger.error("MSG91 auth key not configured in .env")
        return {"success": False, "request_id": None,
                "error": "MSG91_AUTH_KEY missing from .env"}

    to = _normalise_phone(phone_number)

    headers = {
        "authkey": MSG91_AUTH_KEY,
        "content-type": "application/json",
    }
    payload = {
        "sender": MSG91_SENDER_ID,
        "route": MSG91_ROUTE,
        "country": "91",
        "sms": [
            {
                "message": message,
                "to": [to],
            }
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                MSG91_URL,
                json=payload,
                headers=headers,
            )

        data = response.json()
        logger.debug("MSG91 raw response: %s", data)

        # MSG91 returns {"type": "success", "message": "..."} on success
        if response.status_code == 200 and data.get("type") == "success":
            request_id = data.get("message", "")
            logger.info("SMS sent | to=%s | request_id=%s", to, request_id)
            return {"success": True, "request_id": request_id, "error": None}

        error_msg = data.get("message", str(data))
        logger.error("MSG91 error | to=%s | %s", to, error_msg)
        return {"success": False, "request_id": None, "error": error_msg}

    except httpx.RequestError as exc:
        logger.exception("Network error sending SMS to %s", to)
        return {"success": False, "request_id": None, "error": str(exc)}


# ---------------------------------------------------------------------------
# SMS message templates
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
