from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Question(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: int  # index of correct option
    difficulty: str  # 'easy', 'medium', 'hard'

class Quiz(BaseModel):
    id: int
    title: str
    subject: str
    questions: List[Question]
    created_at: datetime
    updated_at: datetime

class QuizAttempt(BaseModel):
    id: int
    user_id: int
    quiz_id: int
    answers: List[int]  # indices of selected answers
    score: int
    completed_at: datetime
    adaptive_level: str  # for adaptive logic

class QuizResult(BaseModel):
    quiz_id: int
    score: int
    total_questions: int
    percentage: float
    feedback: str
