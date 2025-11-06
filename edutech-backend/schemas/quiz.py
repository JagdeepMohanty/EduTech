from pydantic import BaseModel
from typing import List, Optional

class QuestionCreate(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: int
    difficulty: str

class QuizCreate(BaseModel):
    title: str
    subject: str
    questions: List[QuestionCreate]

class QuizAttemptCreate(BaseModel):
    answers: List[int]

class QuizUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    questions: Optional[List[QuestionCreate]] = None
