from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

from gesture_engine.detector import GestureDetector
from simulation_ai.experiment_logic import ExperimentEngine
from simulation_ai.ai_tutor import AITutor
from websocket.gesture_ws import gesture_websocket_handler
from websocket.simulation_ws import simulation_websocket_handler

# Pydantic Request Models
class HintRequest(BaseModel):
    experiment: str
    step: int
    question: str

class PhysicsRequest(BaseModel):
    experiment: str
    parameters: Dict[str, Any] = {}

# Lifespan context handles initialization securely without globals
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting SciViz Python Backend...")
    app.state.gesture_detector = GestureDetector()
    app.state.experiment_engine = ExperimentEngine()
    app.state.ai_tutor = AITutor(api_key=os.getenv('ANTHROPIC_API_KEY'))
    print("All systems initialized!")
    
    try:
        yield
    finally:
        print("Shutting down...")
        if hasattr(app.state, 'gesture_detector') and app.state.gesture_detector:
            app.state.gesture_detector.cleanup()

app = FastAPI(
    title="SciViz 3D Python Backend",
    description="Hand gesture + simulation AI for SciViz 3D",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {
        "status": "running",
        "service": "SciViz 3D Python Backend",
        "endpoints": {
            "gesture_ws": "ws://localhost:8000/ws/gesture",
            "simulation_ws": "ws://localhost:8000/ws/simulation",
            "health": "/health",
            "ai_hint": "/api/hint",
            "physics": "/api/physics/calculate"
        }
    }

@app.get("/health")
async def health(request: Request):
    return {
        "status": "healthy",
        "gesture_detector": hasattr(request.app.state, 'gesture_detector'),
        "experiment_engine": hasattr(request.app.state, 'experiment_engine'),
        "ai_tutor": hasattr(request.app.state, 'ai_tutor')
    }

@app.websocket("/ws/gesture")
async def gesture_ws(websocket: WebSocket):
    await gesture_websocket_handler(
        websocket, websocket.app.state.gesture_detector
    )

@app.websocket("/ws/simulation")
async def simulation_ws(websocket: WebSocket):
    await simulation_websocket_handler(
        websocket, websocket.app.state.experiment_engine
    )

@app.post("/api/hint")
async def get_hint(data: HintRequest, request: Request):
    hint = await request.app.state.ai_tutor.get_hint(
        experiment=data.experiment,
        step=data.step,
        question=data.question
    )
    return {"hint": hint}

@app.post("/api/physics/calculate")
async def calculate_physics(data: PhysicsRequest, request: Request):
    result = request.app.state.experiment_engine.calculate(
        experiment=data.experiment,
        parameters=data.parameters
    )
    return result

if __name__ == "__main__":
    port_str = os.getenv("PORT", "8000")
    port = int(port_str) if port_str.isdigit() else 8000
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=os.getenv("NODE_ENV", "development") == "development",
        log_level="info"
    )
