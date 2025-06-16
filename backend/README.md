# UAV Backend (FastAPI)

## How to Run

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
3. Open your frontend at http://localhost:8000/ (or access API at http://localhost:8000/api/telemetry)

---

- `/api/telemetry` : Get latest telemetry (mocked)
- `/api/arm`, `/api/disarm`, `/api/start_mission`, `/api/stop_mission` : Mission control endpoints
- `/ws/telemetry` : WebSocket for real-time telemetry
- `/` : Serves your index.html
- `/static` : Serves static frontend files

You can now connect your frontend to these endpoints!
