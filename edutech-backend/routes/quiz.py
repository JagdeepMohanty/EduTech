from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from typing import List
import json
from database import get_db_connection
from models.quiz import Quiz, QuizAttempt, QuizResult, Question
from schemas.quiz import QuizCreate, QuizAttemptCreate, QuizUpdate
from utils.quiz_logic import get_adaptive_questions, calculate_score, generate_feedback
from utils.auth import get_current_user, require_roles
from models.user import User

router = APIRouter()

@router.post("/", response_model=Quiz)
async def create_quiz(quiz: QuizCreate, current_user: User = Depends(require_roles('teacher', 'admin'))):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        created_at = datetime.utcnow().isoformat()
        updated_at = created_at
        questions_json = json.dumps([q.dict() for q in quiz.questions])

        cursor.execute("""
            INSERT INTO quizzes (title, subject, questions, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (quiz.title, quiz.subject, questions_json, created_at, updated_at))

        quiz_id = cursor.lastrowid
        conn.commit()

        # Return created quiz
        cursor.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,))
        quiz_row = cursor.fetchone()

        questions = [Question(**q) for q in json.loads(quiz_row['questions'])]

        return Quiz(
            id=quiz_row['id'],
            title=quiz_row['title'],
            subject=quiz_row['subject'],
            questions=questions,
            created_at=datetime.fromisoformat(quiz_row['created_at']),
            updated_at=datetime.fromisoformat(quiz_row['updated_at'])
        )
    finally:
        conn.close()

@router.get("/", response_model=List[Quiz])
async def get_quizzes(subject: str = None):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        if subject:
            cursor.execute("SELECT * FROM quizzes WHERE subject = ?", (subject,))
        else:
            cursor.execute("SELECT * FROM quizzes")

        quiz_rows = cursor.fetchall()
        quizzes = []

        for row in quiz_rows:
            questions = [Question(**q) for q in json.loads(row['questions'])]
            quizzes.append(Quiz(
                id=row['id'],
                title=row['title'],
                subject=row['subject'],
                questions=questions,
                created_at=datetime.fromisoformat(row['created_at']),
                updated_at=datetime.fromisoformat(row['updated_at'])
            ))

        return quizzes
    finally:
        conn.close()

@router.get("/{quiz_id}", response_model=Quiz)
async def get_quiz(quiz_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,))
        quiz_row = cursor.fetchone()

        if not quiz_row:
            raise HTTPException(status_code=404, detail="Quiz not found")

        questions = [Question(**q) for q in json.loads(quiz_row['questions'])]

        return Quiz(
            id=quiz_row['id'],
            title=quiz_row['title'],
            subject=quiz_row['subject'],
            questions=questions,
            created_at=datetime.fromisoformat(quiz_row['created_at']),
            updated_at=datetime.fromisoformat(quiz_row['updated_at'])
        )
    finally:
        conn.close()

@router.put("/{quiz_id}", response_model=Quiz)
async def update_quiz(quiz_id: int, quiz_update: QuizUpdate, current_user: User = Depends(require_roles('teacher', 'admin'))):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Check if quiz exists
        cursor.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Quiz not found")

        # Build update query
        update_fields = []
        update_values = []

        if quiz_update.title is not None:
            update_fields.append("title = ?")
            update_values.append(quiz_update.title)

        if quiz_update.subject is not None:
            update_fields.append("subject = ?")
            update_values.append(quiz_update.subject)

        if quiz_update.questions is not None:
            update_fields.append("questions = ?")
            update_values.append(json.dumps([q.dict() for q in quiz_update.questions]))

        if update_fields:
            update_fields.append("updated_at = ?")
            update_values.append(datetime.utcnow().isoformat())
            update_values.append(quiz_id)

            query = f"UPDATE quizzes SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(query, update_values)
            conn.commit()

        # Return updated quiz
        cursor.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,))
        quiz_row = cursor.fetchone()

        questions = [Question(**q) for q in json.loads(quiz_row['questions'])]

        return Quiz(
            id=quiz_row['id'],
            title=quiz_row['title'],
            subject=quiz_row['subject'],
            questions=questions,
            created_at=datetime.fromisoformat(quiz_row['created_at']),
            updated_at=datetime.fromisoformat(quiz_row['updated_at'])
        )
    finally:
        conn.close()

@router.delete("/{quiz_id}")
async def delete_quiz(quiz_id: int, current_user: User = Depends(require_roles('teacher', 'admin'))):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM quizzes WHERE id = ?", (quiz_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Quiz not found")
        conn.commit()
        return {"message": "Quiz deleted successfully"}
    finally:
        conn.close()

@router.post("/{quiz_id}/attempt", response_model=QuizResult)
async def submit_quiz_attempt(
    quiz_id: int,
    attempt: QuizAttemptCreate,
    current_user: User = Depends(get_current_user)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Get the quiz
        cursor.execute("SELECT * FROM quizzes WHERE id = ?", (quiz_id,))
        quiz_row = cursor.fetchone()

        if not quiz_row:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # Get adaptive questions (for now, use all questions)
        questions = [Question(**q) for q in json.loads(quiz_row['questions'])]
        selected_questions = get_adaptive_questions(questions)

        # Calculate score
        score = calculate_score(selected_questions, attempt.answers)
        total_questions = len(selected_questions)
        percentage = (score / total_questions) * 100

        # Generate feedback
        feedback = generate_feedback(score, total_questions)

        # Save attempt
        completed_at = datetime.utcnow().isoformat()
        answers_json = json.dumps(attempt.answers)

        cursor.execute("""
            INSERT INTO quiz_attempts (user_id, quiz_id, answers, score, completed_at, adaptive_level)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (current_user.id, quiz_id, answers_json, score, completed_at, "medium"))

        conn.commit()

        return QuizResult(
            quiz_id=quiz_id,
            score=score,
            total_questions=total_questions,
            percentage=percentage,
            feedback=feedback
        )
    finally:
        conn.close()

@router.get("/{quiz_id}/attempts", response_model=List[QuizAttempt])
async def get_user_quiz_attempts(
    quiz_id: int,
    current_user: User = Depends(get_current_user)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT * FROM quiz_attempts
            WHERE user_id = ? AND quiz_id = ?
            ORDER BY completed_at DESC
        """, (current_user.id, quiz_id))

        attempt_rows = cursor.fetchall()
        attempts = []

        for row in attempt_rows:
            attempts.append(QuizAttempt(
                id=row['id'],
                user_id=row['user_id'],
                quiz_id=row['quiz_id'],
                answers=json.loads(row['answers']),
                score=row['score'],
                completed_at=datetime.fromisoformat(row['completed_at']),
                adaptive_level=row['adaptive_level']
            ))

        return attempts
    finally:
        conn.close()
