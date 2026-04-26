from fastapi import APIRouter
from services.skill_extractor import extract_skills

router = APIRouter()

@router.post("/extract-skills")
async def skills(data: dict):
    resume = data["resume"]
    jd = data["jd"]

    result = extract_skills(resume, jd)
    return {"skills": result}