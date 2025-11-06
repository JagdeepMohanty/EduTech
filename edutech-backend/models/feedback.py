from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Feedback(BaseModel):
    user_id: int
    rating: int  # 1-5 stars
    category: str  # "general", "quiz", "chatbot", "summarization", "ui"
    subject: Optional[str] = None
    message: str
    submitted_at: datetime
    is_resolved: bool = False

class FeedbackResponse(BaseModel):
    id: int
    user_id: int
    rating: int
    category: str
    subject: Optional[str] = None
    message: str
    submitted_at: datetime
    is_resolved: bool

class FeedbackStats(BaseModel):
    total_feedbacks: int
    average_rating: float
    category_breakdown: dict
    recent_feedbacks: int
