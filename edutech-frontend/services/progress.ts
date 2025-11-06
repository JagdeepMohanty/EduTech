import api from './api';
import { UserProgress, ProgressHistory, SubjectPerformance, AnalyticsData } from '@/types/progress';

export const progressService = {
  async getUserProgress(): Promise<UserProgress> {
    const response = await api.get('/progress/user-progress');
    return response.data;
  },

  async getProgressHistory(days: number = 30): Promise<ProgressHistory[]> {
    const response = await api.get(`/progress/progress-history?days=${days}`);
    return response.data;
  },

  async getSubjectPerformance(): Promise<SubjectPerformance[]> {
    const response = await api.get('/progress/subject-performance');
    return response.data;
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await api.get('/progress/analytics');
    return response.data;
  },
};
