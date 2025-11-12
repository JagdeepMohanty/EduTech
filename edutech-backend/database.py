from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, DuplicateKeyError
import os
from datetime import datetime
from dotenv import load_dotenv
from bson import ObjectId
import ssl

load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv('MONGODB_URL')
DATABASE_NAME = 'edutech'

# Global MongoDB client and database
client = None
db = None

def init_database():
    """Initialize MongoDB connection and create indexes"""
    global client, db
    
    if not MONGODB_URL:
        print("Error: MONGODB_URL not found in environment variables")
        return False
    
    try:
        # Create SSL context that bypasses certificate verification
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        # Create MongoDB client with custom SSL context
        client = MongoClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=10000,
            ssl_context=ssl_context
        )
        
        # Test connection
        client.admin.command('ping')
        print("MongoDB connection successful!")
        
        # Get database
        db = client[DATABASE_NAME]
        
        # Create indexes for better performance
        create_indexes()
        
        return True
        
    except ConnectionFailure as e:
        print(f"MongoDB connection failed: {e}")
        return False
    except Exception as e:
        print(f"Database initialization error: {e}")
        return False

def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Users collection indexes
        db.users.create_index("email", unique=True)
        db.users.create_index("username", unique=True)
        
        # Quiz attempts indexes
        db.quiz_attempts.create_index([("user_id", 1), ("quiz_id", 1)])
        db.quiz_attempts.create_index("completed_at")
        
        # Chats indexes
        db.chats.create_index([("user_id", 1), ("timestamp", -1)])
        
        # Summaries indexes
        db.summaries.create_index([("user_id", 1), ("timestamp", -1)])
        
        # Feedback indexes
        db.feedback.create_index([("user_id", 1), ("submitted_at", -1)])
        
        print("Database indexes created successfully!")
        
    except Exception as e:
        print(f"Warning: Error creating indexes: {e}")

def get_database():
    """Get database instance"""
    global db
    if db is None:
        init_database()
    return db

def close_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()

# User operations
class UserDB:
    @staticmethod
    def create_user(username, email, hashed_password, role='student'):
        """Create a new user"""
        db = get_database()
        if db is None:
            return None
            
        try:
            user_data = {
                'username': username,
                'email': email,
                'hashed_password': hashed_password,
                'role': role,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            result = db.users.insert_one(user_data)
            user_data['_id'] = result.inserted_id
            return user_data
            
        except DuplicateKeyError:
            return None
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        db = get_database()
        if db is None:
            return None
        return db.users.find_one({'email': email})
    
    @staticmethod
    def find_by_username(username):
        """Find user by username"""
        db = get_database()
        if db is None:
            return None
        return db.users.find_one({'username': username})
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        db = get_database()
        if db is None:
            return None
        return db.users.find_one({'_id': ObjectId(user_id)})

# Quiz operations
class QuizDB:
    @staticmethod
    def get_all_quizzes(subject=None):
        """Get all quizzes, optionally filtered by subject"""
        db = get_database()
        if db is None:
            return []
        
        query = {'subject': subject} if subject else {}
        return list(db.quizzes.find(query))
    
    @staticmethod
    def get_quiz_by_id(quiz_id):
        """Get quiz by ID"""
        db = get_database()
        if db is None:
            return None
        return db.quizzes.find_one({'_id': ObjectId(quiz_id)})
    
    @staticmethod
    def create_quiz(title, subject, questions):
        """Create a new quiz"""
        db = get_database()
        if db is None:
            return None
        
        quiz_data = {
            'title': title,
            'subject': subject,
            'questions': questions,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = db.quizzes.insert_one(quiz_data)
        quiz_data['_id'] = result.inserted_id
        return quiz_data

# Quiz attempt operations
class QuizAttemptDB:
    @staticmethod
    def create_attempt(user_id, quiz_id, answers, score, adaptive_level='medium'):
        """Create a quiz attempt"""
        db = get_database()
        if db is None:
            return None
        
        attempt_data = {
            'user_id': ObjectId(user_id),
            'quiz_id': ObjectId(quiz_id),
            'answers': answers,
            'score': score,
            'completed_at': datetime.utcnow(),
            'adaptive_level': adaptive_level
        }
        
        result = db.quiz_attempts.insert_one(attempt_data)
        attempt_data['_id'] = result.inserted_id
        return attempt_data
    
    @staticmethod
    def get_user_attempts(user_id):
        """Get all attempts by user"""
        db = get_database()
        if db is None:
            return []
        return list(db.quiz_attempts.find({'user_id': ObjectId(user_id)}).sort('completed_at', -1))
    
    @staticmethod
    def get_user_stats(user_id):
        """Get user quiz statistics"""
        db = get_database()
        if db is None:
            return {'total_quizzes': 0, 'average_score': 0.0}
        
        pipeline = [
            {'$match': {'user_id': ObjectId(user_id)}},
            {'$group': {
                '_id': None,
                'total_quizzes': {'$sum': 1},
                'average_score': {'$avg': '$score'}
            }}
        ]
        
        result = list(db.quiz_attempts.aggregate(pipeline))
        if result:
            return {
                'total_quizzes': result[0]['total_quizzes'],
                'average_score': round(result[0]['average_score'], 1) if result[0]['average_score'] else 0.0
            }
        return {'total_quizzes': 0, 'average_score': 0.0}

# Chat operations
class ChatDB:
    @staticmethod
    def create_chat(user_id, user_message, bot_response):
        """Create a chat record"""
        db = get_database()
        if db is None:
            return None
        
        chat_data = {
            'user_id': ObjectId(user_id),
            'user_message': user_message,
            'bot_response': bot_response,
            'timestamp': datetime.utcnow()
        }
        
        result = db.chats.insert_one(chat_data)
        chat_data['_id'] = result.inserted_id
        return chat_data
    
    @staticmethod
    def get_user_chats(user_id, limit=50):
        """Get user chat history"""
        db = get_database()
        if db is None:
            return []
        return list(db.chats.find({'user_id': ObjectId(user_id)}).sort('timestamp', -1).limit(limit))

# Summary operations
class SummaryDB:
    @staticmethod
    def create_summary(user_id, original_text, summary, original_length, summary_length):
        """Create a summary record"""
        db = get_database()
        if db is None:
            return None
        
        summary_data = {
            'user_id': ObjectId(user_id),
            'original_text': original_text,
            'summary': summary,
            'original_length': original_length,
            'summary_length': summary_length,
            'timestamp': datetime.utcnow()
        }
        
        result = db.summaries.insert_one(summary_data)
        summary_data['_id'] = result.inserted_id
        return summary_data
    
    @staticmethod
    def get_user_summaries(user_id, limit=20):
        """Get user summary history"""
        db = get_database()
        if db is None:
            return []
        return list(db.summaries.find({'user_id': ObjectId(user_id)}).sort('timestamp', -1).limit(limit))

# Feedback operations
class FeedbackDB:
    @staticmethod
    def create_feedback(user_id, rating, category, subject, message):
        """Create a feedback record"""
        db = get_database()
        if db is None:
            return None
        
        feedback_data = {
            'user_id': ObjectId(user_id),
            'rating': rating,
            'category': category,
            'subject': subject,
            'message': message,
            'submitted_at': datetime.utcnow(),
            'is_resolved': False
        }
        
        result = db.feedback.insert_one(feedback_data)
        feedback_data['_id'] = result.inserted_id
        return feedback_data
    
    @staticmethod
    def get_user_feedback(user_id):
        """Get user feedback history"""
        db = get_database()
        if db is None:
            return []
        return list(db.feedback.find({'user_id': ObjectId(user_id)}).sort('submitted_at', -1))

# Utility functions
def convert_objectid_to_str(doc):
    """Convert ObjectId to string for JSON serialization"""
    if doc and '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    
    # Convert nested ObjectIds
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
    
    return doc

def convert_datetime_to_str(doc):
    """Convert datetime objects to ISO string"""
    if doc:
        for key, value in doc.items():
            if isinstance(value, datetime):
                doc[key] = value.isoformat()
    return doc

def prepare_document_for_response(doc):
    """Prepare document for API response"""
    if doc:
        doc = convert_objectid_to_str(doc)
        doc = convert_datetime_to_str(doc)
    return doc