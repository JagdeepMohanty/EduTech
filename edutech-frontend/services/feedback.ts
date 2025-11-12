import api from './api';
import { FeedbackSubmission, FeedbackResponse, FeedbackStats } from '@/types/feedback';

export const feedbackService = {
  async submitFeedback(feedback: FeedbackSubmission): Promise<FeedbackResponse> {
    const response = await api.post('/feedback/submit', feedback);
    return response.data;
  },

  async getUserFeedback(): Promise<FeedbackResponse[]> {
    const response = await api.get('/feedback/my-feedback');
    return response.data;
  },


};
