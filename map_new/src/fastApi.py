import json
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# Разрешаем запросы с фронтенда (указываем домен/ip сервера)
origins = [
    "http://85.143.217.205",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Coords(BaseModel):
    x: float
    y: float

class Sight(BaseModel):
    id: int
    name: str
    description: str
    coords: Coords

class Sights(BaseModel):
    sights: List[Sight]

# Создаем директорию для данных, если её нет
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

@app.post("/save")
async def save(sights: Dict[str, Any]):
    print(f"Получены данные для сохранения: {sights}")
    file_path = os.path.join(DATA_DIR, "sights.json")
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(sights, f, indent=4, ensure_ascii=False)
    return {"message": "Данные успешно сохранены", "count": len(sights.get("sights", []))}

@app.get("/load")
async def load():
    file_path = os.path.join(DATA_DIR, "sights.json")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return {"sights": []}

# Добавляем health-check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "service": "backend"}
