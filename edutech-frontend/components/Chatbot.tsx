'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Send, SmartToy, Person } from '@mui/icons-material';
import { ChatMessage, Conversation } from '@/types/chatbot';
import { chatbotService } from '@/services/chatbot';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      // Mock conversations for demo
      const mockConversations = [
        {
          id: '1',
          user_message: 'Hello, can you help me with math?',
          bot_response: 'Of course! I\'d be happy to help you with mathematics. What specific topic would you like to work on?',
          timestamp: new Date().toISOString()
        }
      ];
      
      const chatMessages: ChatMessage[] = [];
      mockConversations.forEach((conv) => {
        chatMessages.push({
          id: conv.id + '_user',
          user_message: conv.user_message,
          bot_response: '',
          timestamp: conv.timestamp,
        });
        chatMessages.push({
          id: conv.id + '_bot',
          user_message: '',
          bot_response: conv.bot_response,
          timestamp: conv.timestamp,
        });
      });
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      user_message: inputMessage,
      bot_response: '',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Mock bot responses for demo
      const mockResponses = [
        'That\'s a great question! Let me help you with that.',
        'I understand what you\'re asking. Here\'s what I think...',
        'Based on your question, I\'d suggest looking into this topic further.',
        'That\'s an interesting point. Have you considered this approach?',
        'I\'m here to help! Let me provide some guidance on that.'
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      setTimeout(() => {
        const botMessage: ChatMessage = {
          user_message: '',
          bot_response: randomResponse,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        user_message: '',
        bot_response: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="700" mb={2}
          sx={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
          AI Chatbot
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Get instant help and answers from our intelligent assistant
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ height: 500, display: 'flex', flexDirection: 'column', borderRadius: 4 }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                <SmartToy sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography color="text.secondary">
                Start a conversation with the AI chatbot!
              </Typography>
            </Box>
          )}
          {messages.map((message, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {message.user_message && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', maxWidth: '70%' }}>
                    <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
                      <Typography variant="body1">{message.user_message}</Typography>
                    </Paper>
                    <Avatar sx={{ ml: 1, bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <Person sx={{ fontSize: 18 }} />
                    </Avatar>
                  </Box>
                </Box>
              )}
              {message.bot_response && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', maxWidth: '70%' }}>
                    <Avatar sx={{ mr: 1, bgcolor: 'secondary.main', width: 32, height: 32 }}>
                      <SmartToy sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 3 }}>
                      <Typography variant="body1">{message.bot_response}</Typography>
                    </Paper>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 1, bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <SmartToy sx={{ fontSize: 18 }} />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2">Thinking...</Typography>
                </Paper>
              </Box>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              sx={{ borderRadius: 3, px: 3 }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chatbot;
