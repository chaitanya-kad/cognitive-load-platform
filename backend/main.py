from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from models import SessionData
from database import read_db, write_db

app = FastAPI()

# Allow React frontend to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "CogLoad API running"}

@app.post("/sessions")
def save_session(data: SessionData):
    db = read_db()
    session = data.dict()
    session["id"] = len(db["sessions"]) + 1
    session["timestamp"] = datetime.now().isoformat()
    db["sessions"].append(session)
    write_db(db)
    return {"message": "Session saved", "id": session["id"]}

@app.get("/sessions")
def get_sessions():
    db = read_db()
    return db["sessions"]

@app.get("/sessions/latest")
def get_latest():
    db = read_db()
    if not db["sessions"]:
        return {"message": "No sessions yet"}
    return db["sessions"][-1]

@app.get("/analytics/summary")
def get_summary():
    db = read_db()
    sessions = db["sessions"]
    if not sessions:
        return {"avg_wpm": 0, "avg_accuracy": 0, "total_sessions": 0}
    return {
        "total_sessions": len(sessions),
        "avg_wpm": round(sum(s["wpm"] for s in sessions) / len(sessions)),
        "avg_accuracy": round(sum(s["accuracy"] for s in sessions) / len(sessions), 1),
        "avg_cognitive_score": round(sum(s["cognitive_score"] for s in sessions) / len(sessions)),
        "total_keystrokes": sum(s["keystrokes"] for s in sessions),
    }

@app.delete("/sessions")
def clear_sessions():
    write_db({"sessions": []})
    return {"message": "All sessions cleared"}