from services.llm import call_llm

def extract_skills(resume, jd):
    prompt = f"""
    Extract skills from JD and compare with resume.

    Return JSON:
    [
      {{
        "skill": "",
        "required": "",
        "candidate": ""
      }}
    ]
    """
    return call_llm(prompt + jd + resume)