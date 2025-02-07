import os
from typing import Annotated
from fastapi import FastAPI, HTTPException
from openai import OpenAI
from .models import AnswerCheckRequest, AnswerCheckResponse

app = FastAPI()

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
OPENAI_BASE_URL = os.environ["OPENAI_BASE_URL"]
OPENAI_MODEL = os.environ["OPENAI_MODEL"]

OpenAIDep = Annotated[
    OpenAI, lambda: OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
]


@app.post("/check-answer", response_model=AnswerCheckResponse)
async def check_answer(request: AnswerCheckRequest, openai: OpenAIDep):
    try:
        prompt = (
            f"You are an evaluator. A student answered a question. Determine if the answer is correct based only provided correct response.\n\n"
            f"Question: {request.question}\n"
            f"Correct Answer: {request.correct_answer}\n"
            f"Student's Answer: {request.student_answer}\n\n"
            f"Respond with only 'true' if the student's answer is correct, otherwise 'false'."
        )

        response = openai.chat.completions.create(
            messages=[{"content": prompt, "role": "user"}],
            model=OPENAI_MODEL,
            max_tokens=1,
            temperature=0.7,
        )

        if response.choices[0].text is None:
            raise Exception()
        return AnswerCheckResponse(correct=str(response.choices[0].text) == "true")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking answer: {str(e)}")
