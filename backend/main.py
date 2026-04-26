from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.services.jd_parser import extract_jd_skills
from backend.services.llm import evaluate_answer, extract_skills_llm, generate_question
from backend.services.resume_parser import extract_skills, extract_text_from_pdf
from backend.services.skill_gap import compute_skill_gap

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

session = {
    "gap": {"matched": [], "missing": []},
    "scores": [],
    "current_index": 0,
    "difficulty": "easy",
    "deadline": 14,
    "jd_skills": [],
    "resume_skills": [],
    "questions": [],
}

MAX_QUESTIONS = 5

MCQ_BANK = {
    "React": {
        "question": "Which React hook is used to manage local component state?",
        "options": ["useState", "useRoute", "useServer", "useClass"],
        "answer": "useState",
    },
    "JavaScript": {
        "question": "Which keyword declares a block-scoped variable in JavaScript?",
        "options": ["var", "let", "def", "scope"],
        "answer": "let",
    },
    "Python": {
        "question": "Which Python data type stores key-value pairs?",
        "options": ["list", "tuple", "dict", "set"],
        "answer": "dict",
    },
    "SQL": {
        "question": "Which SQL clause filters rows before grouping?",
        "options": ["WHERE", "ORDER BY", "LIMIT", "SELECT"],
        "answer": "WHERE",
    },
    "Node.js": {
        "question": "Which runtime lets JavaScript run outside the browser?",
        "options": ["Node.js", "Django", "Laravel", "Flask"],
        "answer": "Node.js",
    },
    "HTML": {
        "question": "Which HTML element creates a hyperlink?",
        "options": ["<a>", "<link>", "<href>", "<url>"],
        "answer": "<a>",
    },
    "CSS": {
        "question": "Which CSS property changes text color?",
        "options": ["font-style", "text-color", "color", "paint"],
        "answer": "color",
    },
}


@app.get("/")
def root():
    return {"message": "AI Skill Agent Running"}


def clean_skills(skills):
    mapping = {
        "react js": "React",
        "react.js": "React",
        "nodejs": "Node.js",
        "html5": "HTML",
        "css3": "CSS",
    }

    cleaned = []
    seen = set()
    for skill in skills:
        if not skill:
            continue

        value = mapping.get(str(skill).lower().strip(), str(skill).strip())
        key = value.lower()
        if key not in seen:
            seen.add(key)
            cleaned.append(value)

    return cleaned


def current_skill_for_index(index):
    gap = session.get("gap", {})
    missing = gap.get("missing", [])
    matched = gap.get("matched", [])

    if index < len(missing):
        return missing[index]

    review_skills = matched or session.get("resume_skills", []) or ["general"]
    return review_skills[index % len(review_skills)]


def generate_mcq(skill):
    fallback = {
        "question": f"Which option is most directly related to {skill}?",
        "options": [skill, "Project deadline", "Screen brightness", "File size"],
        "answer": skill,
    }
    return MCQ_BANK.get(skill, fallback)


def recommendation_links(skill):
    query = skill.replace(" ", "+")
    return {
        "youtube": f"https://www.youtube.com/results?search_query={query}+tutorial",
        "articles": [
            {
                "title": f"{skill} guide on MDN",
                "url": f"https://developer.mozilla.org/en-US/search?q={query}",
            },
            {
                "title": f"{skill} learning path",
                "url": f"https://www.freecodecamp.org/news/search/?query={query}",
            },
        ],
    }


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text = extract_text_from_pdf(content)
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Could not read resume PDF") from exc

    regex_skills = extract_skills(text)
    llm_skills = extract_skills_llm(text)
    all_skills = clean_skills(regex_skills + llm_skills)

    return {"skills": all_skills}


@app.post("/start-full")
async def start_full(data: dict):
    skills = clean_skills(data.get("skills", []))
    jd = data.get("jd", "")
    deadline = int(data.get("deadline") or 14)
    if deadline <= 0:
        deadline = 14

    jd_skills = clean_skills(extract_jd_skills(jd))
    gap = compute_skill_gap(skills, jd_skills)

    session.update(
        {
            "gap": gap,
            "scores": [],
            "current_index": 0,
            "difficulty": "easy",
            "deadline": deadline,
            "jd_skills": jd_skills,
            "resume_skills": skills,
            "questions": [],
        }
    )

    return {"jd_skills": jd_skills, "gap": gap}


@app.get("/next-question")
async def next_question():
    index = session.get("current_index", 0)

    if index >= MAX_QUESTIONS:
        return {"done": True}

    skill = current_skill_for_index(index)
    difficulty = session.get("difficulty", "easy")
    is_mcq = index % 2 == 0
    mcq = generate_mcq(skill) if is_mcq else None
    question = mcq["question"] if mcq else generate_question(skill, difficulty)

    session.setdefault("questions", []).append(
        {
            "index": index,
            "skill": skill,
            "difficulty": difficulty,
            "question": question,
            "type": "mcq" if is_mcq else "text",
            "answer": mcq["answer"] if mcq else None,
        }
    )
    session["current_index"] = index + 1

    return {
        "done": False,
        "skill": skill,
        "difficulty": difficulty,
        "type": "mcq" if is_mcq else "text",
        "question": question,
        "options": mcq["options"] if mcq else [],
    }


@app.post("/submit-answer")
async def submit_answer(data: dict):
    answer = data.get("answer", "")
    question_index = max(session.get("current_index", 1) - 1, 0)
    asked_questions = session.get("questions", [])
    asked = asked_questions[question_index] if question_index < len(asked_questions) else {}

    skill = asked.get("skill") or current_skill_for_index(question_index)
    question = asked.get("question", "")
    if asked.get("type") == "mcq":
        correct_answer = asked.get("answer")
        is_correct = str(answer).strip().lower() == str(correct_answer).strip().lower()
        result = {
            "score": 100 if is_correct else 0,
            "feedback": "Correct answer." if is_correct else f"Correct answer: {correct_answer}",
        }
    else:
        result = evaluate_answer(skill, question, answer)

    score = int(result.get("score", 50))
    feedback = result.get("feedback", "No feedback available.")

    if score < 50:
        session["difficulty"] = "easy"
    elif score < 75:
        session["difficulty"] = "medium"
    else:
        session["difficulty"] = "hard"

    session.setdefault("scores", []).append(
        {
            "skill": skill,
            "question": question,
            "answer": answer,
            "score": score,
            "feedback": feedback,
        }
    )

    return {
        "score": score,
        "feedback": feedback,
        "difficulty": session["difficulty"],
    }


@app.get("/report")
async def report():
    gap = session.get("gap", {})
    scores = session.get("scores", [])
    jd_skills = session.get("jd_skills", [])
    deadline = session.get("deadline", 14)

    missing = gap.get("missing", [])
    matched = gap.get("matched", [])

    avg_score = sum(item["score"] for item in scores) / len(scores) if scores else 0
    readiness = round(avg_score, 1)

    skill_scores = {}
    for item in scores:
        skill_scores.setdefault(item["skill"], []).append(item["score"])

    skill_avg = {
        skill: round(sum(values) / len(values), 1)
        for skill, values in skill_scores.items()
    }

    importance = {skill.lower(): max(1, 5 - index) for index, skill in enumerate(jd_skills)}
    priority = sorted(
        [
            {
                "skill": skill,
                "priority_score": importance.get(skill.lower(), 1) * 20,
                "severity": "critical"
                if importance.get(skill.lower(), 1) >= 4
                else "important",
            }
            for skill in missing
        ],
        key=lambda item: item["priority_score"],
        reverse=True,
    )

    focus_skills = [item["skill"] for item in priority[:3]] or missing[:3]

    if deadline <= 7:
        plan_type = "CRASH PLAN"
        learning_plan = {
            "7_days": [f"Focus only on {skill} (high priority)" for skill in focus_skills],
            "14_days": [],
            "30_days": [],
        }
    elif deadline <= 14:
        plan_type = "FAST TRACK"
        learning_plan = {
            "7_days": [f"Learn the basics of {skill}" for skill in focus_skills],
            "14_days": [f"Practice and revise {skill}" for skill in focus_skills],
            "30_days": [],
        }
    else:
        plan_type = "FULL PREP"
        learning_plan = {
            "7_days": [f"Learn the basics of {skill}" for skill in focus_skills],
            "14_days": [f"Build a project using {skill}" for skill in focus_skills],
            "30_days": [f"Master advanced {skill}" for skill in focus_skills],
        }

    resources = {skill: recommendation_links(skill) for skill in focus_skills}

    return {
        "readiness_score": readiness,
        "role_fit": f"{min(100, readiness)}%",
        "decision": "SELECTED" if readiness > 70 else "NEEDS IMPROVEMENT",
        "weak_skills": missing,
        "strong_skills": matched,
        "skill_scores": skill_avg,
        "priority": priority,
        "focus_skills": focus_skills,
        "learning_plan": learning_plan,
        "resources": resources,
        "plan_type": plan_type,
        "deadline_days": deadline,
    }
