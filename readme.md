# EduTech Platform

An adaptive learning platform powered by AI, featuring interactive quizzes, AI chatbot assistance, content summarization, progress analytics, and user feedback collection.

## Features

- **User Authentication**: Secure registration and login system with JWT tokens
- **Adaptive Quizzes**: AI-powered quizzes that adjust difficulty based on user performance
- **AI Chatbot**: Intelligent assistant using Hugging Face models for learning support
- **Content Summarization**: AI-powered text summarization using BART model
- **Progress Analytics**: Comprehensive dashboard with learning progress tracking and insights
- **Feedback System**: User feedback collection with ratings and categorization

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Motor**: Async MongoDB driver
- **Hugging Face Transformers**: AI models for chatbot and summarization
- **passlib**: Password hashing with pbkdf2_sha256
- **PyJWT**: JWT token handling

### Frontend
- **Next.js 13+**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form handling

## Prerequisites

- Python 3.8+
- Node.js 18+
- MongoDB (local installation or MongoDB Atlas)
- Git

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd edutech-platform
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd edutech-backend
pip install -r requirements.txt
```

#### Environment Configuration

Create a `.env` file in the `edutech-backend` directory:

```env
MONGODB_URL=mongodb://localhost:27017/edutech
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service
- Use the default connection string: `mongodb://localhost:27017/edutech`

**Option B: MongoDB Atlas (Cloud)**
- Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a cluster and database
- Get connection string and update `MONGODB_URL` in `.env`

### 3. Frontend Setup

#### Install Node Dependencies

```bash
cd edutech-frontend
npm install
```

#### Environment Configuration

Create a `.env.local` file in the `edutech-frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Application

### Start Backend Server

```bash
cd edutech-backend
python main.py
```

The backend will start on `http://localhost:8000`

### Start Frontend Server

```bash
cd edutech-frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.

## Project Structure

```
edutech-platform/
├── edutech-backend/
│   ├── models/          # Pydantic models
│   ├── routes/          # API route handlers
│   ├── schemas/         # Request/response schemas
│   ├── utils/           # Utility functions
│   ├── main.py          # FastAPI application
│   ├── database.py      # Database connection
│   └── requirements.txt # Python dependencies
├── edutech-frontend/
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── services/        # API service functions
│   ├── types/           # TypeScript type definitions
│   ├── src/app/         # Next.js app router pages
│   ├── package.json     # Node dependencies
│   └── tailwind.config.js
└── README.md
```

## Key Features Overview

### Adaptive Quizzes
- Questions adapt difficulty based on user performance
- Tracks progress and provides personalized recommendations
- Supports multiple subjects and difficulty levels

### AI Chatbot
- Powered by DialoGPT model
- Provides learning assistance and answers questions
- Maintains conversation context

### Content Summarization
- Uses BART model for high-quality text summarization
- Configurable summary length and parameters
- Supports various text formats

### Progress Analytics
- Comprehensive dashboard with performance metrics
- Subject-wise analysis and improvement tracking
- Visual progress charts and insights

### Feedback System
- Star rating system (1-5)
- Categorized feedback (General, Quiz, Chatbot, Summarization, UI)
- Optional subject field for detailed feedback

## Development

### Running Tests

```bash
# Backend tests (if implemented)
cd edutech-backend
pytest

# Frontend tests (if implemented)
cd edutech-frontend
npm test
```

### Code Formatting

```bash
# Backend
cd edutech-backend
black .
isort .

# Frontend
cd edutech-frontend
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@edutech-platform.com or create an issue in the repository.

---

**Happy Learning! 🚀**
