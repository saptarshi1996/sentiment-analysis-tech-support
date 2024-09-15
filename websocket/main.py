from fastapi import (
    FastAPI,
    WebSocket,
    HTTPException,
    WebSocketDisconnect,
    Query
)
from fastapi.middleware.cors import CORSMiddleware
import json

from pydantic import BaseModel

from shared.config.logger import logger

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Notification(BaseModel):
    client_id: str
    message: str


clients = []


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    logger.info(clients)
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received message: {data}")
    except WebSocketDisconnect:
        logger.error("Client disconnected")


@app.get("/")
def get():
    return {"message": "Websocket running"}


@app.get(
    "/notify",
    tags=['Notify'],
    description='Response to socket client'
)
async def notify_handler(
    trigger: str = Query(''),
    message: str = Query(''),
):
    try:
        full_message = json.dumps({
            'trigger': trigger,
            'message': message
        })

        # Send the message to clients
        for client in clients:
            try:
                await client.send_text(full_message)
            except Exception:
                pass
        return {"status": "Notification sent"}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail='Unable to send message')
