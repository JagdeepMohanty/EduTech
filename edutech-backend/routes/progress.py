from fastapi import APIRouter, HTTPException, Depends
from utils.auth import get_current_user
from database import get_db_connection
from models.progress import UserProgress, ProgressEntry, AnalyticsData
from datetime import datetime, timedelta
import statistics
from collections import Counter

router = APIRouter()

@router.get("/user-progress", response_model=UserProgress)
async def get_user_progress(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Get user's quiz attempts
        cursor.execute("""
            SELECT qa.*, q.subject
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.id
            WHERE qa.user_id = ?
            ORDER BY qa.completed_at DESC
        """, (current_user["user_id"],))

        attempt_rows = cursor.fetchall()

        if not attempt_rows:
            return UserProgress(
                user_id=current_user["user_id"],
                total_quizzes_taken=0,
                average_score=0.0,
                subjects_covered=[],
                recent_scores=[],
                improvement_trend="stable",
                strengths=[],
                weaknesses=[],
                recommended_difficulty="beginner"
            )

        # Calculate basic stats
        scores = [row['score'] for row in attempt_rows]
        average_score = statistics.mean(scores)
        total_quizzes = len(attempt_rows)

        # Get subjects covered
        subjects = list(set(row['subject'] for row in attempt_rows))

        # Recent scores (last 5)
        recent_scores = scores[:5]

        # Improvement trend
        if len(scores) >= 3:
            recent_avg = statistics.mean(scores[:3])
            older_avg = statistics.mean(scores[-3:]) if len(scores) > 3 else recent_avg
            if recent_avg > older_avg + 5:
                trend = "improving"
            elif recent_avg < older_avg - 5:
                trend = "declining"
            else:
                trend = "stable"
        else:
            trend = "stable"

        # Strengths and weaknesses based on subjects
        subject_scores = {}
        for row in attempt_rows:
            subject = row['subject']
            if subject not in subject_scores:
                subject_scores[subject] = []
            subject_scores[subject].append(row['score'])

        strengths = [subject for subject, scores_list in subject_scores.items()
                     if statistics.mean(scores_list) >= 70]
        weaknesses = [subject for subject, scores_list in subject_scores.items()
                      if statistics.mean(scores_list) < 60]

        # Recommended difficulty
        if average_score >= 80:
            recommended = "advanced"
        elif average_score >= 60:
            recommended = "intermediate"
        else:
            recommended = "beginner"

        return UserProgress(
            user_id=current_user["user_id"],
            total_quizzes_taken=total_quizzes,
            average_score=round(average_score, 1),
            subjects_covered=subjects,
            recent_scores=recent_scores,
            improvement_trend=trend,
            strengths=strengths,
            weaknesses=weaknesses,
            recommended_difficulty=recommended
        )
    finally:
        conn.close()

@router.get("/progress-history")
async def get_progress_history(
    days: int = 30,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        start_date = datetime.utcnow() - timedelta(days=days)

        cursor.execute("""
            SELECT score, completed_at
            FROM quiz_attempts
            WHERE user_id = ? AND completed_at >= ?
            ORDER BY completed_at ASC
        """, (current_user["user_id"], start_date.isoformat()))

        attempt_rows = cursor.fetchall()

        # Group by date
        daily_progress = {}
        for row in attempt_rows:
            date = datetime.fromisoformat(row['completed_at']).date()
            if date not in daily_progress:
                daily_progress[date] = []
            daily_progress[date].append(row['score'])

        # Calculate daily averages
        progress_data = []
        for date, scores in daily_progress.items():
            progress_data.append({
                "date": date.isoformat(),
                "average_score": round(statistics.mean(scores), 1),
                "quizzes_taken": len(scores)
            })

        return progress_data
    finally:
        conn.close()

@router.get("/subject-performance")
async def get_subject_performance(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT qa.score, q.subject
            FROM quiz_attempts qa
            JOIN quizzes q ON qa.quiz_id = q.id
            WHERE qa.user_id = ?
        """, (current_user["user_id"],))

        attempt_rows = cursor.fetchall()

        subject_performance = {}
        for row in attempt_rows:
            subject = row['subject']
            if subject not in subject_performance:
                subject_performance[subject] = []
            subject_performance[subject].append(row['score'])

        # Calculate averages and trends
        performance_data = []
        for subject, scores in subject_performance.items():
            avg_score = statistics.mean(scores)
            performance_data.append({
                "subject": subject,
                "average_score": round(avg_score, 1),
                "total_quizzes": len(scores),
                "best_score": max(scores),
                "recent_trend": "stable"  # Could be enhanced with more complex trend analysis
            })

        return performance_data
    finally:
        conn.close()

@router.get("/analytics", response_model=AnalyticsData)
async def get_analytics(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # This would typically require admin privileges, but for demo purposes
        # we'll return basic analytics

        cursor.execute("SELECT DISTINCT user_id FROM quiz_attempts")
        total_users = len(cursor.fetchall())

        cursor.execute("SELECT COUNT(*) FROM quizzes")
        total_quizzes = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM quiz_attempts")
        total_attempts = cursor.fetchone()[0]

        if total_attempts and total_users and total_quizzes:
            completion_rate = total_attempts / (total_users * total_quizzes) * 100
        else:
            completion_rate = 0

        # Popular subjects
        cursor.execute("SELECT subject, COUNT(*) as count FROM quizzes GROUP BY subject ORDER BY count DESC LIMIT 5")
        popular_subjects = [row['subject'] for row in cursor.fetchall()]

        # Difficulty distribution (simplified - just count quizzes by first question difficulty)
        cursor.execute("SELECT questions FROM quizzes")
        quiz_rows = cursor.fetchall()

        difficulties = []
        for row in quiz_rows:
            import json
            questions = json.loads(row['questions'])
            if questions:
                difficulties.append(questions[0]['difficulty'])

        difficulty_dist = dict(Counter(difficulties))

        return AnalyticsData(
            total_users=total_users,
            total_quizzes=total_quizzes,
            average_completion_rate=round(completion_rate, 1),
            popular_subjects=popular_subjects,
            difficulty_distribution=difficulty_dist
        )
    finally:
        conn.close()
