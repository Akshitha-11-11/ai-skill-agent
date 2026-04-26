from services.llm import call_llm

def generate_plan(weak_skills):
    prompt = f"""
Create a structured learning plan for these weak skills:

{weak_skills}

Include:
- topics
- resources
- timeline

Be practical.
"""

    return call_llm(prompt)