"""
Twilio SMS service for BoardEazy.
==================================
Exposes one top-level function:
    send_sms(phone_number, message) -> dict

Architecture rule:
    This module only talks to Twilio.
    No railway / booking / RAC business logic lives here.
    The caller decides WHAT to send; this module decides HOW to send it.

Twilio SMS docs: https://www.twilio.com/docs/sms/api
"""

import os
import logging
from typing import Optional

from dotenv import load_dotenv
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

load_dotenv()

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Credentials — loaded from .env, never hard-coded
# ---------------------------------------------------------------------------
ACCOUNT_SID   = os.getenv("TWILIO_ACCOUNT_SID", "")
AUTH_TOKEN    = os.getenv("TWILIO_AUTH_TOKEN", "")
PHONE_NUMBER  = os.getenv("TWILIO_PHONE_NUMBER", "")  # E.164: +1xxxxxxxxxx


def _credentials_ok() -> bool:
    return all([ACCOUNT_SID, AUTH_TOKEN, PHONE_NUMBER])


def _normalise_phone(phone: str) -> str:
    """
    Normalise common Indian phone formats to E.164 (+91XXXXXXXXXX).
    Twilio requires E.164 format for international numbers.

    Examples:
        '9876543210'       → '+919876543210'
        '+91 98765 43210'  → '+919876543210'
        '09876543210'      → '+919876543210'
    """
    cleaned = phone.strip().replace(" ", "").replace("-", "")
    if cleaned.startswith("+"):
        return cleaned  # already E.164
    if cleaned.startswith("091"):
        cleaned = cleaned[1:]  # strip leading 0, keep 91
    elif cleaned.startswith("91") and len(cleaned) == 12:
        pass  # already has country code, just missing +
    elif cleaned.startswith("0") and len(cleaned) == 11:
        cleaned = "91" + cleaned[1:]  # 0XXXXXXXXXX → 91XXXXXXXXXX
    elif len(cleaned) == 10:
        cleaned = "91" + cleaned  # bare 10-digit → 91XXXXXXXXXX
    return "+" + cleaned


# ---------------------------------------------------------------------------
# Core SMS function
# ---------------------------------------------------------------------------

def send_sms(phone_number: str, message: str) -> dict:
    """
    Send an SMS via Twilio.

    Args:
        phone_number: Recipient number — any common Indian format accepted.
        message:      SMS body text.

    Returns:
        {
            "success": bool,
            "sid":     str | None,   # Twilio message SID on success
            "status":  str | None,   # Twilio message status string
            "error":   str | None    # human-readable error on failure
        }
    """
    if not _credentials_ok():
        logger.error("Twilio credentials not fully configured in .env")
        return {
            "success": False, "sid": None, "status": None,
            "error": "Twilio credentials missing from .env",
        }

    to = _normalise_phone(phone_number)

    try:
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        msg = client.messages.create(
            body=message,
            from_=PHONE_NUMBER,
            to=to,
        )
        logger.info("SMS sent | to=%s | sid=%s | status=%s", to, msg.sid, msg.status)
        return {"success": True, "sid": msg.sid, "status": msg.status, "error": None}

    except TwilioRestException as exc:
        logger.error("Twilio error | to=%s | code=%s | %s", to, exc.code, exc.msg)
        return {
            "success": False, "sid": None, "status": None,
            "error": f"Twilio error {exc.code}: {exc.msg}",
        }
    except Exception as exc:
        logger.exception("Unexpected error sending SMS to %s", to)
        return {"success": False, "sid": None, "status": None, "error": str(exc)}


# ---------------------------------------------------------------------------
# SMS message templates
# Keep all wording here so every part of the app uses consistent messages.
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
