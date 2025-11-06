from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import logging
from utils.auth import get_current_user
from database import get_db_connection
from datetime import datetime

router = APIRouter()

# Initialize the summarization pipeline
try:
    from transformers import pipeline
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
except ImportError:
    summarizer = None

class SummarizeRequest(BaseModel):
    text: str
    max_length: int = 150
    min_length: int = 30

class SummarizeResponse(BaseModel):
    summary: str
    original_length: int
    summary_length: int
    summary_id: int

@router.post("/summarize", response_model=SummarizeResponse)
async def summarize_text(
    request: SummarizeRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        if len(request.text.split()) < 10:
            raise HTTPException(status_code=400, detail="Text must be at least 10 words long")

        # Generate summary
        summary_result = summarizer(
            request.text,
            max_length=request.max_length,
            min_length=request.min_length,
            do_sample=False
        )

        summary = summary_result[0]['summary_text']

        # Save summary to database
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            timestamp = datetime.utcnow().isoformat()
            original_length = len(request.text.split())
            summary_length = len(summary.split())

            cursor.execute("""
                INSERT INTO summaries (user_id, original_text, summary, original_length, summary_length, timestamp)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (current_user["user_id"], request.text, summary, original_length, summary_length, timestamp))

            summary_id = cursor.lastrowid
            conn.commit()

            return SummarizeResponse(
                summary=summary,
                original_length=original_length,
                summary_length=summary_length,
                summary_id=summary_id
            )
        finally:
            conn.close()
    except Exception as e:
        logging.error(f"Summarization error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate summary")

@router.get("/summaries")
async def get_user_summaries(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT * FROM summaries
            WHERE user_id = ?
            ORDER BY timestamp DESC
            LIMIT 20
        """, (current_user["user_id"],))

        summary_rows = cursor.fetchall()

        return [
            {
                "id": row['id'],
                "original_text": row["original_text"][:100] + "..." if len(row["original_text"]) > 100 else row["original_text"],
                "summary": row["summary"],
                "original_length": row["original_length"],
                "summary_length": row["summary_length"],
                "timestamp": datetime.fromisoformat(row["timestamp"])
            }
            for row in summary_rows
        ]
    finally:
        conn.close()
