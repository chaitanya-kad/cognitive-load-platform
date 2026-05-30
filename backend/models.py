from pydantic import BaseModel
from typing import Optional

class SessionData(BaseModel):
    wpm: int
    keystrokes: int
    backspaces: int
    accuracy: float
    elapsed_ms: int
    cognitive_score: int
    top_keys: dict
    timestamp: Optional[str] = None