import api from './api';
import { Quiz, QuizResult, QuizAttemptCreate, QuizCreate } from '@/types/quiz';

export const quizService = {
  async getQuizzes(subject?: string): Promise<Quiz[]> {
    const params = subject ? { subject } : {};
    const response = await api.get('/quizzes', { params });
    return response.data;
  },

  async getQuiz(quizId: string): Promise<Quiz> {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  async createQuiz(quiz: QuizCreate): Promise<Quiz> {
    const response = await api.post('/quizzes', quiz);
    return response.data;
  },

  async submitQuizAttempt(quizId: string, attempt: Omit<QuizAttemptCreate, 'quiz_id'>): Promise<QuizResult> {
    const response = await api.post(`/quizzes/${quizId}/attempt`, { ...attempt, quiz_id: quizId });
    return response.data;
  },

  async getQuizAttempts(quizId: string): Promise<any[]> {
    const response = await api.get(`/quizzes/${quizId}/attempts`);
    return response.data;
  },
};
