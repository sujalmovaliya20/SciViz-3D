# python-backend/websocket/gesture_ws.py
import json
import base64
from fastapi import WebSocket, WebSocketDisconnect
from dataclasses import asdict

async def gesture_websocket_handler(websocket: WebSocket, gesture_detector):
    await websocket.accept()
    print("Gesture WebSocket connected")
    try:
        await websocket.send_json({
            "type": "connected",
            "message": "SciViz Gesture Engine ready"
        })
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            if message.get('type') == 'frame':
                frame_b64 = message.get('frame', '')
                if not frame_b64:
                    continue
                try:
                    frame_bytes = base64.b64decode(frame_b64)
                    result = gesture_detector.process_frame(frame_bytes)
                    if result:
                        await websocket.send_json({
                            "type": "gesture",
                            "data": asdict(result)
                        })
                except Exception as e:
                    print(f"Frame error: {e}")
            elif message.get('type') == 'ping':
                await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"WebSocket error: {e}")
