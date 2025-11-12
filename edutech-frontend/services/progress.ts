import api from './api';
import { ProgressDashboard } from '@/types/progress';

export const progressService = {
  async getDashboard(): Promise<ProgressDashboard> {
    const response = await api.get('/progress/dashboard');
    return response.data;
  },
};
