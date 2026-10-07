"""
Notifications router — Fast2SMS endpoints.

All SMS events are handled here.
Business logic lives elsewhere; these routes receive a prepared event
payload and dispatch SMS + WebSocket notification.

Endpoints:
  POST /api/notifications/test-sms          — fire a test SMS to verify integration
  POST /api/notifications/booking-confirmed — booking confirmation SMS (all passengers)
  POST /api/notifications/station-entry     — station QR scan SMS
  POST /api/notifications/boarded           — coach biometric boarding SMS
  POST /api/notifications/rac-upgrade       — RAC berth upgrade SMS
"""

import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.msg91_service import (
    send_sms,
    msg_booking_confirmed,
    msg_station_entry,
    msg_boarded,
    msg_rac_upgrade,
)
from services.ws_manager import manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


# ---------------------------------------------------------------------------
# Shared response schema
# ---------------------------------------------------------------------------

class SMSResponse(BaseModel):
    success: bool
    request_id: Optional[str] = None
    message: str
    error: Optional[str] = None


# ---------------------------------------------------------------------------
# Test endpoint
# ---------------------------------------------------------------------------

class TestSMSRequest(BaseModel):
    phone_number: str


@router.post("/test-sms", response_model=SMSResponse)
async def test_sms(req: TestSMSRequest):
    """
    Send a test SMS to confirm Fast2SMS integration is working.
    """
    result = await send_sms(
        req.phone_number,
        "BoardEazy test SMS: MSG91 integration is working successfully.",
    )
    if not result["success"]:
        raise HTTPException(status_code=502, detail=result["error"])
    return SMSResponse(
        success=True,
        request_id=result.get("request_id"),
        message=f"Test SMS sent to {req.phone_number}. Request ID: {result.get('request_id')}",
    )


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
    Send booking confirmation SMS to every passenger's mobile.
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
    first_rid = next((r["request_id"] for r in results if r.get("request_id")), None)
    errors = [r["error"] for r in results if r.get("error")]

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
        request_id=first_rid,
        message=f"SMS dispatched to {len(req.passengers)} passenger(s)."
                if all_ok else f"Some SMS(es) failed: {'; '.join(errors)}",
        error=None if all_ok else "Partial failure — check server logs",
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
    return SMSResponse(
        success=True,
        request_id=result.get("request_id"),
        message=f"Station entry SMS sent to {req.name}.",
    )


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
    return SMSResponse(
        success=True,
        request_id=result.get("request_id"),
        message=f"Boarding SMS sent to {req.name}.",
    )


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
    return SMSResponse(
        success=True,
        request_id=result.get("request_id"),
        message=f"RAC upgrade SMS sent to {req.name}.",
    )
