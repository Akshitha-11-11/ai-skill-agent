import re

def extract_jd_skills(jd_text):
    skills_db = [
        "React", "JavaScript", "Node.js", "Python", "SQL",
        "MongoDB", "HTML", "CSS", "Tailwind", "Git",
        "REST API", "Machine Learning", "Deep Learning"
    ]

    found = []
    jd_lower = jd_text.lower()

    for skill in skills_db:
        if skill.lower() in jd_lower:
            found.append(skill)

    return list(set(found))
from backend.services.resume_parser import SKILL_PATTERNS
import re

def extract_jd_skills(jd_text):
    found = []

    for skill, pattern in SKILL_PATTERNS.items():
        if re.search(pattern, jd_text, re.IGNORECASE):
            found.append(skill)

    return list(set(found))
def extract_unknown_skills(text):
    candidates = re.findall(r"\b[A-Z][a-zA-Z\+\.]{2,}\b", text)
    return list(set(candidates))