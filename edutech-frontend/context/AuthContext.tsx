'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { authService } from '@/services/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; username: string; password: string; full_name?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState(prev => ({ ...prev, token, isLoading: true }));
      authService.getCurrentUser()
        .then(user => {
          setAuthState(prev => ({ ...prev, user, isLoading: false }));
        })
        .catch(() => {
          localStorage.removeItem('token');
          setAuthState(prev => ({ ...prev, token: null, isLoading: false }));
        });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const tokenData = await authService.login({ email, password });
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', tokenData.access_token);
      }
      setAuthState({
        user: tokenData.user,
        token: tokenData.access_token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.detail || 'Login failed',
      }));
      throw error;
    }
  };

  const register = async (userData: { email: string; username: string; password: string; full_name?: string }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await authService.register(userData);
      // After successful registration, automatically log in
      await login(userData.email, userData.password);
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.detail || 'Registration failed',
      }));
      throw error;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setAuthState({
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
