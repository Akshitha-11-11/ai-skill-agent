from services.llm import call_llm

def evaluate_answer(skill, question, answer):
    response = call_llm(skill, question, answer)

    try:
        return int(response.get("score", 5))
    except:
        return 5