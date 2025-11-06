from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProgressEntry(BaseModel):
    user_id: int
    quiz_id: int
    score: float
    total_questions: int
    percentage: float
    subject: str
    difficulty_level: str
    completed_at: datetime

class UserProgress(BaseModel):
    user_id: int
    total_quizzes_taken: int
    average_score: float
    subjects_covered: List[str]
    recent_scores: List[float]
    improvement_trend: str  # "improving", "stable", "declining"
    strengths: List[str]
    weaknesses: List[str]
    recommended_difficulty: str

class AnalyticsData(BaseModel):
    total_users: int
    total_quizzes: int
    average_completion_rate: float
    popular_subjects: List[str]
    difficulty_distribution: dict
