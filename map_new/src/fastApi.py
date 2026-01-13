import json

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Сoords(BaseModel):
    x: float
    y: float

class Sight(BaseModel):
    id: int
    name: str
    description: str
    coords: Сoords

class Sights(BaseModel):
    sights: List[Sight]

@app.post("/save")
async def save(sights: Dict[str, Any]):
    print(sights)
    with open("./src/sights.json", "w", encoding="utf-8") as f:
        json.dump(sights, f, indent=4, ensure_ascii=False)



if __name__ == "__main__":
    uvicorn.run("fastApi:app", port=8000, reload=True)