from database import init_database, UserDB, QuizDB
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_database():
    """Seed MongoDB with comprehensive sample data"""
    print("Seeding EduTech database...")
    
    if not init_database():
        print("Failed to initialize database")
        return False
    
    try:
        # Create sample users
        users = [
            {
                "username": "student1",
                "email": "student1@example.com",
                "password": "password123",
                "role": "student"
            },
            {
                "username": "teacher1", 
                "email": "teacher1@example.com",
                "password": "password123",
                "role": "teacher"
            },
            {
                "username": "admin1",
                "email": "admin1@example.com", 
                "password": "password123",
                "role": "admin"
            },
            {
                "username": "demo_user",
                "email": "demo@edutech.com",
                "password": "demo123",
                "role": "student"
            }
        ]

        created_users = []
        for user in users:
            # Check if user exists
            existing_user = UserDB.find_by_email(user["email"])
            if not existing_user:
                hashed_password = get_password_hash(user["password"])
                created_user = UserDB.create_user(
                    username=user["username"],
                    email=user["email"],
                    hashed_password=hashed_password,
                    role=user["role"]
                )
                if created_user:
                    created_users.append(created_user)
                    print(f"Created user: {user['username']} ({user['role']})")
                else:
                    print(f"Failed to create user: {user['username']}")
            else:
                print(f"User already exists: {user['username']}")

        # Create comprehensive sample quizzes
        sample_questions = {
            "geography": [
                {
                    "question_text": "What is the capital of France?",
                    "options": ["London", "Berlin", "Paris", "Madrid"],
                    "correct_answer": 2,
                    "difficulty": "easy"
                },
                {
                    "question_text": "Which is the largest continent?",
                    "options": ["Africa", "Asia", "North America", "Europe"],
                    "correct_answer": 1,
                    "difficulty": "easy"
                },
                {
                    "question_text": "What is the longest river in the world?",
                    "options": ["Amazon", "Nile", "Mississippi", "Yangtze"],
                    "correct_answer": 1,
                    "difficulty": "medium"
                }
            ],
            "science": [
                {
                    "question_text": "Which planet is known as the Red Planet?",
                    "options": ["Venus", "Mars", "Jupiter", "Saturn"],
                    "correct_answer": 1,
                    "difficulty": "easy"
                },
                {
                    "question_text": "What is the chemical symbol for gold?",
                    "options": ["Go", "Gd", "Au", "Ag"],
                    "correct_answer": 2,
                    "difficulty": "medium"
                },
                {
                    "question_text": "What is the speed of light in vacuum?",
                    "options": ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
                    "correct_answer": 0,
                    "difficulty": "hard"
                }
            ],
            "mathematics": [
                {
                    "question_text": "What is 15 + 27?",
                    "options": ["40", "42", "44", "46"],
                    "correct_answer": 1,
                    "difficulty": "easy"
                },
                {
                    "question_text": "What is the square root of 144?",
                    "options": ["10", "11", "12", "13"],
                    "correct_answer": 2,
                    "difficulty": "easy"
                },
                {
                    "question_text": "What is the derivative of x²?",
                    "options": ["x", "2x", "x²", "2x²"],
                    "correct_answer": 1,
                    "difficulty": "medium"
                }
            ],
            "literature": [
                {
                    "question_text": "Who wrote 'Romeo and Juliet'?",
                    "options": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                    "correct_answer": 1,
                    "difficulty": "easy"
                },
                {
                    "question_text": "Which novel begins with 'It was the best of times, it was the worst of times'?",
                    "options": ["Great Expectations", "A Tale of Two Cities", "Oliver Twist", "David Copperfield"],
                    "correct_answer": 1,
                    "difficulty": "medium"
                },
                {
                    "question_text": "Who wrote '1984'?",
                    "options": ["Aldous Huxley", "Ray Bradbury", "George Orwell", "H.G. Wells"],
                    "correct_answer": 2,
                    "difficulty": "medium"
                }
            ]
        }

        quizzes = [
            {
                "title": "World Geography Basics",
                "subject": "Geography",
                "questions": sample_questions["geography"]
            },
            {
                "title": "Space and Chemistry",
                "subject": "Science",
                "questions": sample_questions["science"]
            },
            {
                "title": "Mathematics Fundamentals",
                "subject": "Mathematics",
                "questions": sample_questions["mathematics"]
            },
            {
                "title": "Classic Literature",
                "subject": "Literature",
                "questions": sample_questions["literature"]
            },
            {
                "title": "Mixed Knowledge Quiz",
                "subject": "General",
                "questions": [
                    sample_questions["geography"][0],
                    sample_questions["science"][0],
                    sample_questions["mathematics"][0],
                    sample_questions["literature"][0]
                ]
            },
            {
                "title": "Advanced Science",
                "subject": "Science",
                "questions": [sample_questions["science"][1], sample_questions["science"][2]]
            },
            {
                "title": "European Geography",
                "subject": "Geography",
                "questions": [sample_questions["geography"][0]]
            }
        ]

        created_quizzes = 0
        for quiz in quizzes:
            created_quiz = QuizDB.create_quiz(
                title=quiz["title"],
                subject=quiz["subject"],
                questions=quiz["questions"]
            )
            if created_quiz:
                created_quizzes += 1
                print(f"Created quiz: {quiz['title']} ({len(quiz['questions'])} questions)")
            else:
                print(f"Failed to create quiz: {quiz['title']}")

        print(f"\nDatabase seeded successfully!")
        print(f"Created {len(created_users)} new users")
        print(f"Created {created_quizzes} quizzes")
        
        # Print login credentials
        print("\nSample Login Credentials:")
        print("=" * 50)
        for user in users:
            print(f"Email: {user['email']}")
            print(f"Password: {user['password']}")
            print(f"Role: {user['role']}")
            print("-" * 30)
        
        print("\nYou can now start the server with: python app.py")
        return True
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        return False

if __name__ == "__main__":
    seed_database()