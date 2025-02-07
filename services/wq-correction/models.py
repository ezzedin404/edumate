from pydantic import BaseModel

class AnswerCheckRequest(BaseModel):
    question: str
    student_answer: str
    correct_answer: str

class AnswerCheckResponse(BaseModel):
    correct: bool