from fastapi import APIRouter, HTTPException, Depends
from utils.auth import get_current_user
from database import get_db_connection
from models.feedback import Feedback, FeedbackResponse, FeedbackStats
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/submit", response_model=FeedbackResponse)
async def submit_feedback(
    rating: int,
    category: str,
    message: str,
    subject: str = None,
    current_user: dict = Depends(get_current_user)
):
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    valid_categories = ["general", "quiz", "chatbot", "summarization", "ui"]
    if category not in valid_categories:
        raise HTTPException(status_code=400, detail="Invalid category")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        submitted_at = datetime.utcnow().isoformat()

        cursor.execute("""
            INSERT INTO feedback (user_id, rating, category, subject, message, submitted_at, is_resolved)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (current_user["user_id"], rating, category, subject, message, submitted_at, False))

        feedback_id = cursor.lastrowid
        conn.commit()

        return FeedbackResponse(
            id=feedback_id,
            user_id=current_user["user_id"],
            rating=rating,
            category=category,
            subject=subject,
            message=message,
            submitted_at=datetime.fromisoformat(submitted_at),
            is_resolved=False
        )
    finally:
        conn.close()

@router.get("/my-feedback")
async def get_user_feedback(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT * FROM feedback
            WHERE user_id = ?
            ORDER BY submitted_at DESC
        """, (current_user["user_id"],))

        feedback_rows = cursor.fetchall()

        return [
            FeedbackResponse(
                id=row['id'],
                user_id=row['user_id'],
                rating=row['rating'],
                category=row['category'],
                subject=row['subject'],
                message=row['message'],
                submitted_at=datetime.fromisoformat(row['submitted_at']),
                is_resolved=bool(row['is_resolved'])
            ) for row in feedback_rows
        ]
    finally:
        conn.close()

@router.get("/stats", response_model=FeedbackStats)
async def get_feedback_stats(current_user: dict = Depends(get_current_user)):
    # This would typically require admin privileges, but for demo purposes
    # we'll return basic stats

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT COUNT(*) FROM feedback")
        total_feedbacks = cursor.fetchone()[0]

        if not total_feedbacks:
            return FeedbackStats(
                total_feedbacks=0,
                average_rating=0.0,
                category_breakdown={},
                recent_feedbacks=0
            )

        cursor.execute("SELECT AVG(rating) FROM feedback")
        average_rating = cursor.fetchone()[0] or 0.0

        # Category breakdown
        cursor.execute("SELECT category, COUNT(*) as count FROM feedback GROUP BY category")
        category_rows = cursor.fetchall()
        categories = {row['category']: row['count'] for row in category_rows}

        # Recent feedbacks (last 7 days)
        week_ago = datetime.utcnow().isoformat()
        cursor.execute("SELECT COUNT(*) FROM feedback WHERE submitted_at >= datetime(?, '-7 days')", (week_ago,))
        recent_feedbacks = cursor.fetchone()[0]

        return FeedbackStats(
            total_feedbacks=total_feedbacks,
            average_rating=round(average_rating, 1),
            category_breakdown=categories,
            recent_feedbacks=recent_feedbacks
        )
    finally:
        conn.close()
