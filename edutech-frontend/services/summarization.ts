import api from './api';
import { SummarizeRequest, SummarizeResponse, SummaryHistory } from '@/types/summarization';

export const summarizationService = {
  async summarizeText(request: SummarizeRequest): Promise<SummarizeResponse> {
    const response = await api.post('/summarization/summarize', request);
    return response.data;
  },

  async getSummaryHistory(): Promise<SummaryHistory[]> {
    const response = await api.get('/summarization/summaries');
    return response.data;
  },
};
