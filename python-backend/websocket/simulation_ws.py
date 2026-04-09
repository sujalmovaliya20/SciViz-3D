# python-backend/websocket/simulation_ws.py
import json
from fastapi import WebSocket, WebSocketDisconnect

async def simulation_websocket_handler(websocket: WebSocket, experiment_engine):
    await websocket.accept()
    print("Simulation WebSocket connected")
    try:
        await websocket.send_json({
            "type": "connected",
            "message": "SciViz Simulation Engine ready"
        })
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            if message.get('type') == 'calculate':
                result = experiment_engine.calculate(
                    experiment=message.get('experiment', ''),
                    parameters=message.get('parameters', {})
                )
                await websocket.send_json({
                    "type": "result",
                    "data": result
                })
            elif message.get('type') == 'ping':
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        print("Simulation client disconnected")
    except Exception as e:
        print(f"Simulation WebSocket error: {e}")
