@echo off
echo Starting SciViz 3D...
start cmd /k "cd /d D:\3d experiement\server && npm run dev"
timeout /t 3
start cmd /k "cd /d D:\3d experiement\client && npm run dev"
start cmd /k "cd /d D:\3d experiement\python-backend && .\venv\Scripts\python.exe main.py"
echo All servers starting...
timeout /t 5
start chrome http://localhost:5173
