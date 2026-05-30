import json
import os

DB_FILE = "db.json"

def read_db():
    if not os.path.exists(DB_FILE):
        return {"sessions": []}
    with open(DB_FILE, "r") as f:
        return json.load(f)

def write_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)