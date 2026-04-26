print("Starting test...")

from services.llm import call_llm

result = call_llm("Explain API in one line")

print("RESULT:", result)