from fastapi import APIRouter
from services.planner import generate_plan

router = APIRouter()

@router.post("/plan")
async def plan(data: dict):
    skills = data["skills"]
    result = generate_plan(skills)
    return {"plan": result}