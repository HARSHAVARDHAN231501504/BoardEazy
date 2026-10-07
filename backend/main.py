"""
BoardEazy FastAPI Backend
=========================
Endpoints:
  GET  /health                                  — health check
  POST /api/notifications/test-sms              — fire a test SMS (Twilio)
  POST /api/notifications/booking-confirmed     — booking confirmation SMS
  POST /api/notifications/station-entry         — station QR scan SMS
  POST /api/notifications/boarded               — coach biometric boarding SMS
  POST /api/notifications/rac-upgrade           — RAC berth upgrade SMS
  POST /api/exotel/call-status                  — Exotel call-status webhook (stub, for future voice)
  WS   /ws/{client_id}                          — real-time WebSocket notifications

Run:
  uvicorn main:app --reload --port 8000
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import exotel, ws, notifications

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="BoardEazy API",
    description="FastAPI backend — Exotel SMS notifications + WebSocket real-time updates",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite dev server (:5173) and common local ports
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(exotel.router)
app.include_router(notifications.router)
app.include_router(ws.router)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "service": "BoardEazy API"}
