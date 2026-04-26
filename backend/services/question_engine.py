from services.llm import call_llm

def generate_question(skill, level):
    prompt = f"""
You are an expert interviewer.

Generate ONE {level} level interview question for the skill: {skill}.

Return only the question.
"""

    return call_llm(prompt)