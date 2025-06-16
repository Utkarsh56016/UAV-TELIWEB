from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import asyncio
import random

app = FastAPI()

# Allow frontend (localhost) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (frontend)
import os
STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static"))
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

import requests

# --- Telemetry Data ---
@app.get("/api/telemetry")
def get_telemetry():
    try:
        resp = requests.get("http://192.168.4.5:5000/api/telemetry", timeout=1)
        return resp.json()
    except Exception as e:
        return {"error": "Failed to fetch telemetry from Pi", "details": str(e)}

# --- Mission control endpoints ---
@app.post("/api/arm")
def arm():
    return {"status": "ARM command sent! (mock)"}

@app.post("/api/disarm")
def disarm():
    return {"status": "DISARM command sent! (mock)"}

@app.post("/api/start_mission")
def start_mission():
    return {"status": "Mission started! (mock)"}

@app.post("/api/stop_mission")
def stop_mission():
    return {"status": "Mission stopped! (mock)"}

# --- WebSocket for real-time telemetry ---
@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json(random_telemetry())
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass

# --- Serve index.html at root ---
@app.get("/")
def root():
    INDEX_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../index.html"))
    return FileResponse(INDEX_PATH)
