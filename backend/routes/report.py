from fastapi import APIRouter
from services.planner import generate_plan

router = APIRouter()

from routes.assess import session_store

@router.get("/final-report")
async def final_report():
    session = session_store["session"]

    scores = session.get_all_scores()

    gaps = [s for s, score in scores.items() if score < 6]

    plan = generate_plan(gaps)

    return {
        "scores": scores,
        "weak_skills": gaps,
        "learning_plan": plan
    }