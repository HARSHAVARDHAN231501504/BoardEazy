"""
Exotel communication service for BoardEazy.
===========================================
Exposes two top-level functions:
  send_sms(phone, message)      — sends an SMS via Exotel's SMS API
  make_voice_call(phone, ...)   — STUB, wired up when voice is needed

Architecture rule:
  This module is ONLY responsible for talking to Exotel.
  It does NOT contain any railway / booking / RAC business logic.
  The caller (router or business-event handler) decides WHAT to send;
  this service decides HOW to send it.

Exotel SMS API reference:
  POST https://api.in.exotel.com/v1/Accounts/{sid}/Sms/send.json
  Auth: HTTP Basic (API Key = username, API Token = password)
  Body (form-encoded): From, To, Body
"""

import os
import logging
from typing import Optional

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Credentials — loaded from .env, never hard-coded
# ---------------------------------------------------------------------------
ACCOUNT_SID  = os.getenv("EXOTEL_ACCOUNT_SID", "")
API_KEY      = os.getenv("EXOTEL_API_KEY", "")
API_TOKEN    = os.getenv("EXOTEL_API_TOKEN", "")
EXOPHONE     = os.getenv("EXOTEL_EXOPHONE", "")

# Singapore region subdomain
_SUBDOMAIN   = "api.exotel.com"
_SMS_URL     = f"https://{_SUBDOMAIN}/v1/Accounts/{ACCOUNT_SID}/Sms/send.json"
_CALL_URL    = f"https://{_SUBDOMAIN}/v1/Accounts/{ACCOUNT_SID}/Calls/connect"

# Expose for debug endpoint
SMS_URL = _SMS_URL


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _normalise_phone(phone: str) -> str:
    """
    Normalise any common Indian phone format to trunk-prefixed 11-digit
    format that Exotel expects (0XXXXXXXXXX).

    Examples:
        '+91 98765 43210'  → '09876543210'
        '+919876543210'    → '09876543210'
        '9876543210'       → '09876543210'
        '09876543210'      → '09876543210'  (already correct)
    """
    cleaned = phone.strip().replace(" ", "").replace("-", "")
    if cleaned.startswith("+91"):
        cleaned = "0" + cleaned[3:]
    elif cleaned.startswith("91") and len(cleaned) == 12:
        cleaned = "0" + cleaned[2:]
    elif len(cleaned) == 10 and cleaned.isdigit():
        cleaned = "0" + cleaned
    return cleaned


def _credentials_ok() -> bool:
    return all([ACCOUNT_SID, API_KEY, API_TOKEN, EXOPHONE])


# ---------------------------------------------------------------------------
# SMS
# ---------------------------------------------------------------------------

async def send_sms(phone: str, message: str) -> dict:
    """
    Send an SMS via Exotel.

    Args:
        phone:   Recipient phone number — any common Indian format accepted.
        message: SMS body text (keep under 160 chars for a single-part SMS).

    Returns:
        {
            "success": bool,
            "sid":     str | None,   # Exotel message SID on success
            "status":  str | None,   # Exotel delivery status string
            "error":   str | None    # human-readable error on failure
        }
    """
    if not _credentials_ok():
        logger.error("Exotel credentials not fully configured in .env")
        return {"success": False, "sid": None, "status": None,
                "error": "Exotel credentials missing"}

    to = _normalise_phone(phone)
    payload = {"From": EXOPHONE, "To": to, "Body": message}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                _SMS_URL,
                data=payload,
                auth=(API_KEY, API_TOKEN),
            )

        if response.status_code in (200, 201):
            data = response.json()
            sms = data.get("SMSMessage", {})
            sid    = sms.get("Sid")
            status = sms.get("Status", "unknown")
            logger.info("SMS sent | to=%s | sid=%s | status=%s", to, sid, status)
            return {"success": True, "sid": sid, "status": status, "error": None}

        logger.error("Exotel SMS failed | HTTP %s | %s",
                     response.status_code, response.text)
        return {
            "success": False, "sid": None, "status": None,
            "error": f"HTTP {response.status_code}: {response.text}",
        }

    except httpx.RequestError as exc:
        logger.exception("Network error sending SMS to %s", to)
        return {"success": False, "sid": None, "status": None, "error": str(exc)}


# ---------------------------------------------------------------------------
# Voice  (STUB — wired up in a later sprint)
# ---------------------------------------------------------------------------

async def make_voice_call(phone: str, caller_id: Optional[str] = None) -> dict:
    """
    Initiate an outbound voice call via Exotel.

    NOT IMPLEMENTED YET — returns a clear stub response so callers know
    voice is planned but not active. Drop the stub body and add the
    httpx call here when voice is ready.
    """
    logger.info("make_voice_call called for %s — voice not yet implemented", phone)
    return {
        "success": False,
        "sid": None,
        "error": "Voice calls not yet implemented (planned for next sprint)",
    }


# ---------------------------------------------------------------------------
# SMS message templates
# Keep templates here so every part of the app uses the same wording.
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
        f"{p.get('name','Passenger')} ({p.get('subPnr','')})"
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
        f"BoardEazy RAC Upgrade!\n"
        f"Hi {name} ({rac_id}), your berth is confirmed.\n"
        f"Coach {coach}, Seat {seat} on {train_name}.\n"
        f"Please proceed to your coach immediately!"
    )
