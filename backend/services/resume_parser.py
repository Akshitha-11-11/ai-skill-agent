import fitz
import re

# ---------------- PDF TEXT ---------------- #

def extract_text_from_pdf(file_bytes):
    pdf = fitz.open(stream=file_bytes, filetype="pdf")

    text = ""
    for page in pdf:
        text += page.get_text()

    return text


# ---------------- SKILL ENGINE ---------------- #

SKILL_PATTERNS = {
    "React": r"\breact(\.js|js)?\b",
    "JavaScript": r"\bjavascript\b|\bjs\b",
    "Node.js": r"\bnode(\.js|js)?\b",
    "Python": r"\bpython\b",
    "HTML": r"\bhtml\b",
    "CSS": r"\bcss\b",
    "Tailwind": r"\btailwind\b",
    "SQL": r"\bsql\b",
    "MongoDB": r"\bmongodb\b",
    "Git": r"\bgit\b",
    "REST API": r"\brest\b|\bapi\b",
    "Machine Learning": r"\bmachine learning\b|\bml\b",
    "Deep Learning": r"\bdeep learning\b|\bdl\b",
}

CONTEXT_HINTS = [
    "skill", "skills", "experience", "project",
    "projects", "worked", "built", "tech", "stack"
]


def is_valid_context(text, keyword):
    lines = text.split("\n")

    for line in lines:
        if keyword.lower() in line.lower():
            if any(h in line.lower() for h in CONTEXT_HINTS):
                return True

    return False


def normalize_skills(skills):
    return sorted(list(set([s.strip() for s in skills])))


def extract_skills(text):
    found = []

    for skill, pattern in SKILL_PATTERNS.items():
        if re.search(pattern, text, re.IGNORECASE):

            # avoid over-filtering
            if is_valid_context(text, skill) or len(text) < 200:
                found.append(skill)

    return normalize_skills(found)