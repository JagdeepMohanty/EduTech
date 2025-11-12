import api from './api';
import { User, UserCreate, UserLogin, Token } from '@/types/auth';

export const authService = {
  async register(userData: UserCreate): Promise<User> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async login(credentials: UserLogin): Promise<Token> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  },
};
