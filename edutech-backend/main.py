from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_database
from routes.auth import router as auth_router
from routes.quiz import router as quiz_router
from routes.chatbot import router as chatbot_router
from routes.summarization import router as summarization_router
from routes.progress import router as progress_router
from routes.feedback import router as feedback_router

app = FastAPI(title="EduTech API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_database()

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(quiz_router, prefix="/quizzes", tags=["quizzes"])
app.include_router(chatbot_router, prefix="/chatbot", tags=["chatbot"])
app.include_router(summarization_router, prefix="/summarization", tags=["summarization"])
app.include_router(progress_router, prefix="/progress", tags=["progress"])
app.include_router(feedback_router, prefix="/feedback", tags=["feedback"])

@app.get("/")
async def root():
    return {"message": "Welcome to EduTech API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
