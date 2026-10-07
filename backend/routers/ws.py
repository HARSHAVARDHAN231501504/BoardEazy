"""
WebSocket router.
Clients connect at  ws://localhost:8000/ws/{client_id}
and receive real-time notifications broadcast after every SMS event.
"""

import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from services.ws_manager import manager

logger = logging.getLogger(__name__)
router = APIRouter(tags=["WebSocket"])


@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    Persistent WebSocket connection per browser tab / session.
    client_id should be a unique string (e.g. user email or a UUID generated
    on the frontend at app startup).

    The client can also send messages upstream; the server echoes them back
    with an 'ACK' type so the frontend can confirm connectivity.
    """
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Keep the connection alive; handle any upstream messages from client
            data = await websocket.receive_text()
            # Echo back as ACK so the frontend knows the socket is live
            await manager.send_to(
                client_id,
                {"type": "ACK", "echo": data},
            )
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        logger.info("Client %s disconnected", client_id)
