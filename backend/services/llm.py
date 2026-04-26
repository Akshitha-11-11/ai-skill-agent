import requests
import os
import json
from dotenv import load_dotenv
from pathlib import Path

# ---------- ENV ---------- #
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("OPENROUTER_API_KEY")

BASE_URL = "https://openrouter.ai/api/v1/chat/completions"


# ---------- COMMON CALL ---------- #
def call_llm(prompt):
    if not API_KEY:
        return None

    try:
        res = requests.post(
            BASE_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}]
            },
            timeout=12
        )

        res.raise_for_status()
        data = res.json()
        return data["choices"][0]["message"]["content"]

    except Exception as e:
        print("LLM CALL ERROR:", e)
        return None


# ---------- SKILL EXTRACTION ---------- #
def extract_skills_llm(text):
    prompt = f"""
Extract ALL technical skills from this resume.

Return ONLY JSON array.

Example:
["React", "Node.js", "MongoDB"]

Resume:
{text[:3000]}
"""

    content = call_llm(prompt)

    if not content:
        return []

    print("RAW LLM:", content)  # debug

    try:
        content = content.strip()

        # remove markdown
        if "```" in content:
            content = content.split("```")[1]

        # extract JSON array
        start = content.find("[")
        end = content.rfind("]") + 1
        json_str = content[start:end]

        return json.loads(json_str)

    except Exception as e:
        print("SKILL PARSE ERROR:", e)
        return []


# ---------- QUESTION GENERATION ---------- #
def generate_question(skill, difficulty):
    prompt = f"""
You are an AI interviewer.

Generate ONE clear interview question.

Skill: {skill}
Difficulty: {difficulty}

Rules:
- If easy → basic concept or simple scenario
- If medium → practical implementation
- If hard → system design or optimization
- Keep it SHORT (1–2 lines max)
- No long explanations

Return ONLY the question.
"""

    content = call_llm(prompt)

    if not content:
        return f"What is one practical way you have used {skill} in a project?"

    return content.strip()


# ---------- ANSWER EVALUATION ---------- #
def evaluate_answer(skill, question, answer):
    prompt = f"""
You are an AI evaluator.

Respond ONLY in JSON.

Skill: {skill}
Answer: {answer}

Return:
{{
 "score": 0-100,
 "feedback": "short explanation",
 "level": "beginner/intermediate/expert"
}}
"""

    content = call_llm(prompt)

    if not content:
        return {
            "score": 50,
            "feedback": "Fallback",
            "level": "intermediate"
        }

    try:
        content = content.strip()

        if "```" in content:
            content = content.split("```")[1]

        start = content.find("{")
        end = content.rfind("}") + 1
        json_str = content[start:end]

        return json.loads(json_str)

    except Exception as e:
        print("EVAL PARSE ERROR:", e)
        return {
            "score": 50,
            "feedback": "Parsing fallback",
            "level": "intermediate"
        }
