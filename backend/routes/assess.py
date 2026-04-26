from fastapi import APIRouter
from services.skill_state import SkillState
from services.session_manager import SessionManager
from services.question_engine import generate_mcq, generate_question
from services.scorer import score_answer

router = APIRouter()

session_store = {}

MAX_TOTAL_QUESTIONS = 5   # 🔥 global limit


# ---------------- START ---------------- #

@router.post("/start-full")
async def start_full(data: dict):
    skills = data.get("skills", ["general"])

    # ✅ RESET SESSION (CRITICAL FIX)
    session = SessionManager(skills)
    session_store["session"] = session
    session_store["total_questions"] = 0

    first_skill = session.get_current_skill()

    state = SkillState(first_skill)
    session.set_state(first_skill, state)

    mcqs = generate_mcq(first_skill)

    return {
        "skill": first_skill,
        "mcqs": mcqs
    }


# ---------------- NEXT QUESTION ---------------- #

@router.get("/next-question")   # ✅ CHANGED TO GET
async def next_question():
    session = session_store.get("session")

    if not session:
        return {"done": True}

    # 🔥 GLOBAL LIMIT CONTROL
    if session_store.get("total_questions", 0) >= MAX_TOTAL_QUESTIONS:
        return {"done": True}

    skill = session.get_current_skill()
    state = session.states[skill]

    question = generate_question(skill, state.current_level)

    return {
        "skill": skill,
        "question": question,
        "level": state.current_level
    }


# ---------------- SUBMIT ANSWER ---------------- #

@router.post("/submit-answer")   # ✅ FIXED NAME
async def submit_answer(data: dict):
    session = session_store.get("session")

    if not session:
        return {"done": True}

    skill = session.get_current_skill()
    state = session.states[skill]

    answer = data.get("answer", "")

    score = score_answer(answer, skill)

    # ✅ update state
    state.update_subjective(score)

    # ✅ increment global count
    session_store["total_questions"] += 1

    # 🔥 STOP AFTER TOTAL LIMIT
    if session_store["total_questions"] >= MAX_TOTAL_QUESTIONS:
        return {
            "done": True,
            "score": score
        }

    # 🔥 SKILL SWITCH AFTER 3 QUESTIONS
    if state.asked_questions >= 3:
        has_next = session.next_skill()

        if has_next:
            next_skill = session.get_current_skill()
            new_state = SkillState(next_skill)
            session.set_state(next_skill, new_state)

            mcqs = generate_mcq(next_skill)

            return {
                "next_skill": next_skill,
                "mcqs": mcqs,
                "score": score
            }

    # 🔥 CONTINUE SAME SKILL
    next_q = generate_question(skill, state.current_level)

    return {
        "skill": skill,
        "score": score,
        "next_question": next_q
    }