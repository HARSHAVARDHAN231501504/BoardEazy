"""
WebSocket connection manager.
Maintains a registry of active connections and provides broadcast / targeted
messaging so the React frontend receives real-time notifications without polling.
"""

import json
import logging
from typing import Optional

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    def __init__(self):
        # All connected clients: {client_id: WebSocket}
        self._connections: dict[str, WebSocket] = {}

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    async def connect(self, websocket: WebSocket, client_id: str) -> None:
        await websocket.accept()
        self._connections[client_id] = websocket
        logger.info("WebSocket connected: client_id=%s | total=%d", client_id, len(self._connections))

    def disconnect(self, client_id: str) -> None:
        self._connections.pop(client_id, None)
        logger.info("WebSocket disconnected: client_id=%s | total=%d", client_id, len(self._connections))

    # ------------------------------------------------------------------
    # Sending helpers
    # ------------------------------------------------------------------

    async def send_to(self, client_id: str, payload: dict) -> bool:
        """Send a message to a single client. Returns False if not connected."""
        ws = self._connections.get(client_id)
        if ws is None:
            logger.warning("send_to: client_id=%s not found", client_id)
            return False
        try:
            await ws.send_text(json.dumps(payload))
            return True
        except Exception as exc:
            logger.error("send_to error for client_id=%s: %s", client_id, exc)
            self.disconnect(client_id)
            return False

    async def broadcast(self, payload: dict) -> None:
        """Send a message to every connected client."""
        dead: list[str] = []
        message = json.dumps(payload)
        for client_id, ws in list(self._connections.items()):
            try:
                await ws.send_text(message)
            except Exception as exc:
                logger.error("broadcast error for client_id=%s: %s", client_id, exc)
                dead.append(client_id)
        for cid in dead:
            self.disconnect(cid)

    # ------------------------------------------------------------------
    # Typed notification builders — keep payload shape consistent
    # ------------------------------------------------------------------

    @staticmethod
    def notification_payload(
        event_type: str,
        title: str,
        message: str,
        data: Optional[dict] = None,
    ) -> dict:
        """
        Standard envelope for all real-time notifications.

        event_type examples:
            BOOKING_CONFIRMED | STATION_ENTERED | BOARDED | RAC_UPGRADED | SMS_SENT
        """
        return {
            "type": event_type,
            "title": title,
            "message": message,
            "data": data or {},
        }


# Singleton — imported and used across routers
manager = ConnectionManager()
