from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from passlib.context import CryptContext
import os
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv
from bson import ObjectId
from database import (
    init_database, UserDB, QuizDB, QuizAttemptDB, 
    ChatDB, SummaryDB, FeedbackDB, prepare_document_for_response
)

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
JWT_ALGORITHM = 'HS256'
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRE_MINUTES', '30'))

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, app.config['JWT_SECRET_KEY'], algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_current_user_from_token(token: str):
    payload = verify_token(token)
    if not payload:
        return None
    
    email = payload.get("sub")
    if not email:
        return None
    
    user = UserDB.find_by_email(email)
    if user:
        return {
            'id': str(user['_id']),
            'email': user['email'],
            'username': user['username'],
            'role': user.get('role', 'student')
        }
    return None

# Initialize database
print("Starting EduTech API server...")
print("Connecting to MongoDB...")
db_initialized = init_database()

if not db_initialized:
    print("Failed to connect to database. Exiting...")
    exit(1)

print("Database connected successfully!")

# Root route
@app.route('/')
def root():
    return jsonify({
        "message": "Welcome to EduTech API",
        "version": "1.0.0",
        "status": "running",
        "database": "MongoDB Atlas",
        "endpoints": {
            "auth": "/auth/register, /auth/login, /auth/me",
            "quizzes": "/quizzes, /quizzes/<id>, /quizzes/<id>/attempt",
            "chatbot": "/chatbot/chat, /chatbot/conversations",
            "summarization": "/summarization/summarize, /summarization/summaries",
            "progress": "/progress/dashboard",
            "feedback": "/feedback/submit, /feedback/my-feedback"
        }
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat()
    })

# Auth routes
@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'detail': 'No JSON data provided'}), 400
            
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not all([username, email, password]):
            return jsonify({'detail': 'Missing required fields: username, email, password'}), 400
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return jsonify({'detail': 'Invalid email format'}), 400
        
        # Validate password length
        if len(password) < 6:
            return jsonify({'detail': 'Password must be at least 6 characters long'}), 400
        
        # Check if user exists
        if UserDB.find_by_email(email):
            return jsonify({'detail': 'Email already registered'}), 400
        
        if UserDB.find_by_username(username):
            return jsonify({'detail': 'Username already taken'}), 400
        
        # Create user
        hashed_password = get_password_hash(password)
        user = UserDB.create_user(
            username=username,
            email=email,
            hashed_password=hashed_password,
            role='student'
        )
        
        if not user:
            return jsonify({'detail': 'Failed to create user'}), 500
        
        return jsonify({
            'id': str(user['_id']),
            'username': username,
            'email': email,
            'role': 'student',
            'message': 'User registered successfully'
        }), 201
        
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'detail': 'No JSON data provided'}), 400
            
        email = data.get('email') or data.get('username')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'detail': 'Missing email/username or password'}), 400
        
        # Try to find user by email first, then username
        user = UserDB.find_by_email(email)
        if not user:
            user = UserDB.find_by_username(email)
        
        if not user or not verify_password(password, user['hashed_password']):
            return jsonify({'detail': 'Incorrect credentials'}), 401
        
        # Create access token
        access_token_expires = timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user['email'], "role": user.get('role', 'student')},
            expires_delta=access_token_expires
        )
        
        return jsonify({
            'access_token': access_token,
            'token_type': 'bearer',
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'role': user.get('role', 'student')
            }
        })
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

@app.route('/auth/me', methods=['GET'])
def get_current_user():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing or invalid authorization header'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        return jsonify(user)
        
    except Exception as e:
        print(f"Get current user error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

# Quiz routes
@app.route('/quizzes', methods=['GET'])
def get_quizzes():
    try:
        subject = request.args.get('subject')
        quizzes = QuizDB.get_all_quizzes(subject)
        
        # Prepare quizzes for response
        quiz_list = []
        for quiz in quizzes:
            quiz_data = prepare_document_for_response(quiz)
            quiz_list.append(quiz_data)
        
        return jsonify(quiz_list)
        
    except Exception as e:
        print(f"Get quizzes error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

@app.route('/quizzes/<quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    try:
        # Validate ObjectId
        if not ObjectId.is_valid(quiz_id):
            return jsonify({'detail': 'Invalid quiz ID'}), 400
            
        quiz = QuizDB.get_quiz_by_id(quiz_id)
        if not quiz:
            return jsonify({'detail': 'Quiz not found'}), 404
        
        quiz_data = prepare_document_for_response(quiz)
        return jsonify(quiz_data)
        
    except Exception as e:
        print(f"Get quiz error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

@app.route('/quizzes', methods=['POST'])
def create_quiz():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user or user.get('role') not in ['teacher', 'admin']:
            return jsonify({'detail': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        if not data:
            return jsonify({'detail': 'No JSON data provided'}), 400
            
        title = data.get('title', '').strip()
        subject = data.get('subject', '').strip()
        questions = data.get('questions', [])
        
        if not all([title, subject, questions]):
            return jsonify({'detail': 'Missing required fields: title, subject, questions'}), 400
        
        if not isinstance(questions, list) or len(questions) == 0:
            return jsonify({'detail': 'Questions must be a non-empty array'}), 400
        
        quiz = QuizDB.create_quiz(title, subject, questions)
        if not quiz:
            return jsonify({'detail': 'Failed to create quiz'}), 500
        
        quiz_data = prepare_document_for_response(quiz)
        return jsonify(quiz_data), 201
        
    except Exception as e:
        print(f"Create quiz error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

@app.route('/quizzes/<quiz_id>/attempt', methods=['POST'])
def submit_quiz_attempt(quiz_id):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        # Validate ObjectId
        if not ObjectId.is_valid(quiz_id):
            return jsonify({'detail': 'Invalid quiz ID'}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({'detail': 'No JSON data provided'}), 400
            
        answers = data.get('answers', [])
        
        if not isinstance(answers, list):
            return jsonify({'detail': 'Answers must be an array'}), 400
        
        # Get quiz
        quiz = QuizDB.get_quiz_by_id(quiz_id)
        if not quiz:
            return jsonify({'detail': 'Quiz not found'}), 404
        
        questions = quiz['questions']
        
        # Calculate score
        score = 0
        for i, question in enumerate(questions):
            if i < len(answers) and answers[i] == question['correct_answer']:
                score += 1
        
        total_questions = len(questions)
        percentage = (score / total_questions) * 100 if total_questions > 0 else 0
        
        # Generate feedback
        if percentage >= 90:
            feedback = "Excellent! You have a strong understanding of the material."
        elif percentage >= 75:
            feedback = "Good job! You have a solid grasp, but there's room for improvement."
        elif percentage >= 60:
            feedback = "Fair performance. Consider reviewing the material and trying again."
        else:
            feedback = "You may need to review the material more thoroughly. Don't give up!"
        
        # Save attempt
        attempt = QuizAttemptDB.create_attempt(
            user_id=user['id'],
            quiz_id=quiz_id,
            answers=answers,
            score=score,
            adaptive_level="medium"
        )
        
        return jsonify({
            'quiz_id': quiz_id,
            'score': score,
            'total_questions': total_questions,
            'percentage': round(percentage, 1),
            'feedback': feedback,
            'attempt_id': str(attempt['_id']) if attempt else None
        })
        
    except Exception as e:
        print(f"Submit quiz attempt error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

# Chatbot routes
@app.route('/chatbot/chat', methods=['POST'])
def chat_with_bot():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        data = request.get_json()
        if not data:
            return jsonify({'detail': 'No JSON data provided'}), 400
            
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({'detail': 'Message cannot be empty'}), 400
        
        # Enhanced chatbot responses
        message_lower = message.lower()
        if any(word in message_lower for word in ["hello", "hi", "hey", "greetings"]):
            response = "Hello! I'm your EduTech learning assistant. I can help you with quizzes, study tips, and answer questions about your learning journey. What would you like to know?"
        elif "quiz" in message_lower:
            response = "I can help you with quizzes! You can take adaptive quizzes that adjust to your skill level. We have quizzes in subjects like Mathematics, Science, Geography, Literature, and General Knowledge. Would you like me to recommend a quiz based on your interests?"
        elif any(word in message_lower for word in ["study", "learn", "education"]):
            response = "Great! Here are some study tips: 1) Take regular quizzes to test your knowledge, 2) Use our summarization feature to condense study materials, 3) Set learning goals and track your progress. What subject are you studying?"
        elif any(word in message_lower for word in ["help", "support", "assistance"]):
            response = "I'm here to help! You can ask me about: 📚 Taking quizzes, 📊 Checking your progress, 📝 Study strategies, 🎯 Setting learning goals, or ❓ Any educational topics. What do you need help with?"
        elif "score" in message_lower or "progress" in message_lower:
            response = "You can check your progress and scores in the dashboard! It shows your quiz performance, average scores, and learning analytics. Your progress helps me understand your strengths and areas for improvement."
        elif "subject" in message_lower:
            response = "We offer quizzes in several subjects: 🧮 Mathematics, 🔬 Science, 🌍 Geography, 📖 Literature, and 🎓 General Knowledge. Which subject interests you most?"
        else:
            response = "That's an interesting question! I'm here to help with your learning journey. You can ask me about quizzes, study strategies, progress tracking, or any educational topics. Feel free to be specific about what you'd like to learn!"
        
        # Save conversation
        chat = ChatDB.create_chat(
            user_id=user['id'],
            user_message=message,
            bot_response=response
        )
        
        return jsonify({
            'response': response,
            'conversation_id': str(chat['_id']) if chat else None,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

@app.route('/chatbot/conversations', methods=['GET'])
def get_conversations():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        chats = ChatDB.get_user_chats(user['id'])
        
        # Prepare chats for response
        chat_list = []
        for chat in chats:
            chat_data = prepare_document_for_response(chat)
            chat_list.append(chat_data)
        
        return jsonify(chat_list)
        
    except Exception as e:
        print(f"Get conversations error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

# Summarization routes
@app.route('/summarization/summarize', methods=['POST'])
def summarize_text():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        data = request.get_json()
        if not data:
            return jsonify({'detail': 'No JSON data provided'}), 400
            
        text = data.get('text', '').strip()
        max_length = data.get('max_length', 150)
        
        if not text:
            return jsonify({'detail': 'Text cannot be empty'}), 400
        
        if len(text.split()) < 10:
            return jsonify({'detail': 'Text must be at least 10 words long'}), 400
        
        # Enhanced summarization logic
        sentences = text.split('. ')
        if len(sentences) <= 2:
            summary = text
        else:
            # Take key sentences based on position and length
            if len(sentences) >= 5:
                # For longer texts, take first, middle, and last sentences
                middle_idx = len(sentences) // 2
                key_sentences = [sentences[0], sentences[middle_idx], sentences[-1]]
                summary = '. '.join(key_sentences)
            else:
                # For shorter texts, take first and last
                summary = f"{sentences[0]}. {sentences[-1]}"
            
            # Ensure proper sentence ending
            if not summary.endswith('.'):
                summary += '.'
            
            # Truncate if too long
            words = summary.split()
            target_words = max_length // 5  # Rough word count estimation
            if len(words) > target_words:
                summary = ' '.join(words[:target_words]) + '...'
        
        # Save summary
        original_length = len(text.split())
        summary_length = len(summary.split())
        
        summary_record = SummaryDB.create_summary(
            user_id=user['id'],
            original_text=text,
            summary=summary,
            original_length=original_length,
            summary_length=summary_length
        )
        
        compression_ratio = round((1 - summary_length / original_length) * 100, 1) if original_length > 0 else 0
        
        return jsonify({
            'summary': summary,
            'original_length': original_length,
            'summary_length': summary_length,
            'summary_id': str(summary_record['_id']) if summary_record else None,
            'compression_ratio': compression_ratio,
            'message': f'Text summarized successfully! Reduced by {compression_ratio}%'
        })
        
    except Exception as e:
        print(f"Summarization error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

@app.route('/summarization/summaries', methods=['GET'])
def get_user_summaries():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        summaries = SummaryDB.get_user_summaries(user['id'])
        
        # Prepare summaries for response
        summary_list = []
        for summary in summaries:
            summary_data = prepare_document_for_response(summary)
            # Truncate original text for list view
            if len(summary_data['original_text']) > 100:
                summary_data['original_text'] = summary_data['original_text'][:100] + '...'
            summary_list.append(summary_data)
        
        return jsonify(summary_list)
        
    except Exception as e:
        print(f"Get summaries error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

# Progress routes
@app.route('/progress/dashboard', methods=['GET'])
def get_progress_dashboard():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        # Get user statistics
        stats = QuizAttemptDB.get_user_stats(user['id'])
        attempts = QuizAttemptDB.get_user_attempts(user['id'])
        
        # Prepare recent attempts
        recent_attempts = []
        for attempt in attempts[:5]:  # Last 5 attempts
            attempt_data = prepare_document_for_response(attempt)
            recent_attempts.append(attempt_data)
        
        # Calculate recent activity (last 7 days)
        from datetime import timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_activity = 0
        for attempt in attempts:
            if attempt.get('completed_at'):
                if isinstance(attempt['completed_at'], datetime):
                    if attempt['completed_at'] > week_ago:
                        recent_activity += 1
                elif isinstance(attempt['completed_at'], str):
                    try:
                        attempt_date = datetime.fromisoformat(attempt['completed_at'].replace('Z', '+00:00'))
                        if attempt_date > week_ago:
                            recent_activity += 1
                    except:
                        pass
        
        return jsonify({
            'total_quizzes': stats['total_quizzes'],
            'average_score': stats['average_score'],
            'recent_activity': recent_activity,
            'subject_performance': [],  # TODO: Implement subject-wise performance
            'recent_attempts': recent_attempts,
            'performance_trend': 'improving' if stats['average_score'] > 70 else 'needs_improvement'
        })
        
    except Exception as e:
        print(f"Progress dashboard error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

# Feedback routes
@app.route('/feedback/submit', methods=['POST'])
def submit_feedback():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        data = request.get_json()
        if not data:
            return jsonify({'detail': 'No JSON data provided'}), 400
            
        rating = data.get('rating')
        category = data.get('category', '').strip()
        message = data.get('message', '').strip()
        subject = data.get('subject', '').strip()
        
        if not all([rating, category, message]):
            return jsonify({'detail': 'Missing required fields: rating, category, message'}), 400
        
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'detail': 'Rating must be an integer between 1 and 5'}), 400
        
        valid_categories = ['general', 'quiz', 'chatbot', 'summarization', 'ui']
        if category not in valid_categories:
            return jsonify({'detail': f'Category must be one of: {", ".join(valid_categories)}'}), 400
        
        # Create feedback
        feedback = FeedbackDB.create_feedback(
            user_id=user['id'],
            rating=rating,
            category=category,
            subject=subject if subject else None,
            message=message
        )
        
        return jsonify({
            'id': str(feedback['_id']) if feedback else None,
            'message': 'Thank you for your feedback! We appreciate your input.',
            'rating': rating,
            'category': category
        }), 201
        
    except Exception as e:
        print(f"Submit feedback error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

@app.route('/feedback/my-feedback', methods=['GET'])
def get_user_feedback():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'detail': 'Missing authorization'}), 401
        
        token = auth_header.split(' ')[1]
        user = get_current_user_from_token(token)
        
        if not user:
            return jsonify({'detail': 'Invalid token'}), 401
        
        feedback_list = FeedbackDB.get_user_feedback(user['id'])
        
        # Prepare feedback for response
        feedback_data = []
        for feedback in feedback_list:
            feedback_item = prepare_document_for_response(feedback)
            feedback_data.append(feedback_item)
        
        return jsonify(feedback_data)
        
    except Exception as e:
        print(f"Get user feedback error: {e}")
        return jsonify({'detail': 'Internal server error'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'detail': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'detail': 'Method not allowed'}), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'detail': 'Internal server error'}), 500

if __name__ == '__main__':
    print("EduTech API server ready!")
    print("Server running on: http://localhost:8000")
    print("API Documentation: http://localhost:8000")
    print("Frontend URL: http://localhost:3000")
    app.run(debug=True, host='0.0.0.0', port=8000)