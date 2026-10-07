"""
Exotel router — all Exotel-related HTTP endpoints live here.

Endpoints:
  POST /api/exotel/test-sms          — fire a test SMS to any verified number
  POST /api/exotel/booking-confirmed — booking confirmation SMS (all passengers)
  POST /api/exotel/station-entry     — station QR scan SMS
  POST /api/exotel/boarded           — coach biometric boarding SMS
  POST /api/exotel/rac-upgrade       — RAC berth upgrade SMS
  POST /api/exotel/call-status       — Exotel callback webhook (call status updates)

Architecture note:
  These routes receive business events from the frontend (or from other
  FastAPI services in future). They call exotel_service functions — they do NOT
  contain any booking / RAC / allocation logic themselves.
"""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from services.exotel_service import (
    send_sms,
    make_voice_call,
    msg_booking_confirmed,
    msg_station_entry,
    msg_boarded,
    msg_rac_upgrade,
)
from services.ws_manager import manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/exotel", tags=["Exotel"])


# ---------------------------------------------------------------------------
# Shared response schema
# ---------------------------------------------------------------------------

class SMSResponse(BaseModel):
    success: bool
    sid: Optional[str] = None
    message: str
    error: Optional[str] = None


# ---------------------------------------------------------------------------
# Test endpoint — verify Exotel creds with a real number
# ---------------------------------------------------------------------------

class TestSMSRequest(BaseModel):
    phone: str
    text: Optional[str] = "BoardEazy test SMS — Exotel integration is working!"


@router.post("/test-sms", response_model=SMSResponse)
async def test_sms(req: TestSMSRequest):
    """
    Send a test SMS to any Exotel-verified number.
    Use this to confirm your credentials work before testing the full flow.
    """
    result = await send_sms(req.phone, req.text)
    if not result["success"]:
        raise HTTPException(status_code=502, detail=result["error"])
    return SMSResponse(
        success=True,
        sid=result["sid"],
        message=f"Test SMS sent to {req.phone}.",
    )


@router.post("/debug-sms")
async def debug_sms(req: TestSMSRequest):
    """
    Debug endpoint — returns the raw Exotel HTTP status code and response body
    exactly as received, with no processing or summarising.
    Use this to diagnose Exotel API rejections.
    """
    import os
    from services.exotel_service import (
        _normalise_phone, _credentials_ok,
        API_KEY, API_TOKEN, EXOPHONE, ACCOUNT_SID, SMS_URL
    )
    import httpx

    to = _normalise_phone(req.phone)
    payload = {"From": EXOPHONE, "To": to, "Body": req.text}

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            SMS_URL,
            data=payload,
            auth=(API_KEY, API_TOKEN),
        )

    # Return everything raw — status, headers, body
    try:
        body = response.json()
    except Exception:
        body = response.text

    return {
        "http_status_code": response.status_code,
        "url_called": str(response.url),
        "request_payload": payload,
        "response_body": body,
        "response_headers": dict(response.headers),
    }


# ---------------------------------------------------------------------------
# Booking confirmation
# ---------------------------------------------------------------------------

class PassengerInfo(BaseModel):
    name: str
    subPnr: str
    mobile: str
    coach: Optional[str] = "C2"
    seat: Optional[str] = ""


class BookingConfirmedRequest(BaseModel):
    pnr: str
    trainName: str
    trainNumber: str
    journeyDate: str
    fromStation: str
    toStation: str
    passengers: list[PassengerInfo]
    totalFare: int
    clientId: Optional[str] = "global"


@router.post("/booking-confirmed", response_model=SMSResponse)
async def booking_confirmed(req: BookingConfirmedRequest):
    """
    Send booking confirmation SMS to every passenger's registered mobile.
    Called by ReviewPaymentPage after payment simulation completes.
    """
    passenger_dicts = [p.model_dump() for p in req.passengers]
    message = msg_booking_confirmed(
        pnr=req.pnr,
        train_number=req.trainNumber,
        train_name=req.trainName,
        journey_date=req.journeyDate,
        from_station=req.fromStation,
        to_station=req.toStation,
        passengers=passenger_dicts,
        total_fare=req.totalFare,
    )

    results = [await send_sms(p.mobile, message) for p in req.passengers]
    all_ok = all(r["success"] for r in results)
    first_sid = next((r["sid"] for r in results if r.get("sid")), None)

    await manager.broadcast(manager.notification_payload(
        event_type="BOOKING_CONFIRMED",
        title="Booking Confirmed!",
        message=f"PNR {req.pnr} confirmed for {len(req.passengers)} passenger(s). SMS sent.",
        data={
            "pnr": req.pnr,
            "trainName": req.trainName,
            "journeyDate": req.journeyDate,
            "fromStation": req.fromStation,
            "toStation": req.toStation,
            "passengerCount": len(req.passengers),
        },
    ))

    return SMSResponse(
        success=all_ok,
        sid=first_sid,
        message=f"SMS dispatched to {len(req.passengers)} passenger(s)."
                if all_ok else "Some SMS(es) failed — check server logs.",
        error=None if all_ok else "Partial failure",
    )


# ---------------------------------------------------------------------------
# Station entry
# ---------------------------------------------------------------------------

class StationEntryRequest(BaseModel):
    name: str
    subPnr: str
    mobile: str
    coach: str
    seat: str
    gateId: str
    scanTime: str
    clientId: Optional[str] = "global"


@router.post("/station-entry", response_model=SMSResponse)
async def station_entry(req: StationEntryRequest):
    """
    SMS after successful QR scan at station gate.
    Called by StationGateScannerPage.
    """
    message = msg_station_entry(
        name=req.name, sub_pnr=req.subPnr,
        coach=req.coach, seat=req.seat,
        gate_id=req.gateId, scan_time=req.scanTime,
    )
    result = await send_sms(req.mobile, message)

    await manager.broadcast(manager.notification_payload(
        event_type="STATION_ENTERED",
        title="Station Entry Verified",
        message=f"{req.name} entered at {req.gateId}.",
        data=req.model_dump(),
    ))

    if not result["success"]:
        raise HTTPException(status_code=502, detail=result["error"])
    return SMSResponse(success=True, sid=result["sid"],
                       message=f"Station entry SMS sent to {req.name}.")


# ---------------------------------------------------------------------------
# Coach boarding
# ---------------------------------------------------------------------------

class BoardedRequest(BaseModel):
    name: str
    subPnr: str
    mobile: str
    coach: str
    seat: str
    trainName: str
    scanTime: str
    clientId: Optional[str] = "global"


@router.post("/boarded", response_model=SMSResponse)
async def boarded(req: BoardedRequest):
    """
    SMS after biometric verification at coach door.
    Called by TrainGateBiometricPage.
    """
    message = msg_boarded(
        name=req.name, sub_pnr=req.subPnr,
        coach=req.coach, seat=req.seat,
        train_name=req.trainName, scan_time=req.scanTime,
    )
    result = await send_sms(req.mobile, message)

    await manager.broadcast(manager.notification_payload(
        event_type="BOARDED",
        title="Passenger Boarded",
        message=f"{req.name} boarded Coach {req.coach}, Seat {req.seat}.",
        data=req.model_dump(),
    ))

    if not result["success"]:
        raise HTTPException(status_code=502, detail=result["error"])
    return SMSResponse(success=True, sid=result["sid"],
                       message=f"Boarding SMS sent to {req.name}.")


# ---------------------------------------------------------------------------
# RAC berth upgrade
# ---------------------------------------------------------------------------

class RacUpgradeRequest(BaseModel):
    name: str
    racId: str
    mobile: str
    coach: str
    seat: str
    trainName: str
    clientId: Optional[str] = "global"


@router.post("/rac-upgrade", response_model=SMSResponse)
async def rac_upgrade(req: RacUpgradeRequest):
    """
    SMS when AI allocates a confirmed berth to a RAC passenger.
    Called by BoardEazyContext after simulateNextStation15Km() completes.
    """
    message = msg_rac_upgrade(
        name=req.name, rac_id=req.racId,
        coach=req.coach, seat=req.seat,
        train_name=req.trainName,
    )
    result = await send_sms(req.mobile, message)

    await manager.broadcast(manager.notification_payload(
        event_type="RAC_UPGRADED",
        title="RAC Berth Upgraded!",
        message=f"{req.name} upgraded to Coach {req.coach}, Seat {req.seat}.",
        data=req.model_dump(),
    ))

    if not result["success"]:
        raise HTTPException(status_code=502, detail=result["error"])
    return SMSResponse(success=True, sid=result["sid"],
                       message=f"RAC upgrade SMS sent to {req.name}.")


# ---------------------------------------------------------------------------
# Exotel call-status webhook (STUB — ready for voice sprint)
# ---------------------------------------------------------------------------

@router.post("/call-status")
async def call_status_webhook(request: Request):
    """
    Exotel posts call status updates here after each outbound call.
    Configure this URL in your Exotel campaign/call settings as the StatusCallback.

    Currently logs the payload — persistence to DB will be added in the voice sprint.
    """
    try:
        payload = await request.form()
        data = dict(payload)
    except Exception:
        data = await request.json()

    logger.info("Exotel call-status callback received: %s", data)

    # Future: store to notification table in PostgreSQL
    # Future: broadcast status update via WebSocket

    return {"received": True}
