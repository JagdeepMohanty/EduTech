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

  async submitQuizAttempt(quizId: string, answers: number[]): Promise<QuizResult> {
    const response = await api.post(`/quizzes/${quizId}/attempt`, { answers });
    return response.data;
  },
};
