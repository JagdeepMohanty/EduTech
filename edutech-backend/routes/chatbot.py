from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import logging
from utils.auth import get_current_user
from database import get_db_connection
from datetime import datetime

router = APIRouter()

# Initialize the chatbot pipeline (using a simple conversational model)
try:
    from transformers import pipeline
    chatbot_pipeline = pipeline("text2text-generation", model="facebook/blenderbot-400M-distill")
except ImportError:
    chatbot_pipeline = None

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    conversation_id: int

@router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(
    chat_message: ChatMessage,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Generate response using the chatbot model
        response = chatbot_pipeline(chat_message.message)[0]['generated_text']

        # Save conversation to database
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            timestamp = datetime.utcnow().isoformat()

            cursor.execute("""
                INSERT INTO chats (user_id, user_message, bot_response, timestamp)
                VALUES (?, ?, ?, ?)
            """, (current_user["user_id"], chat_message.message, response, timestamp))

            conversation_id = cursor.lastrowid
            conn.commit()

            return ChatResponse(
                response=response,
                conversation_id=conversation_id
            )
        finally:
            conn.close()
    except Exception as e:
        logging.error(f"Chatbot error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate chatbot response")

@router.get("/conversations")
async def get_conversations(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT * FROM chats
            WHERE user_id = ?
            ORDER BY timestamp DESC
            LIMIT 50
        """, (current_user["user_id"],))

        conversation_rows = cursor.fetchall()

        return [
            {
                "id": row['id'],
                "user_message": row["user_message"],
                "bot_response": row["bot_response"],
                "timestamp": datetime.fromisoformat(row["timestamp"])
            }
            for row in conversation_rows
        ]
    finally:
        conn.close()
