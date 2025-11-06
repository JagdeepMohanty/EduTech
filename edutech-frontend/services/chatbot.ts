import api from './api';
import { ChatRequest, ChatResponse, Conversation } from '@/types/chatbot';

export const chatbotService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    const response = await api.post('/chatbot/chat', { message });
    return response.data;
  },

  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('/chatbot/conversations');
    return response.data;
  },
};
