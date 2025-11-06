'use client';

import React, { useState, useEffect, useRef } from 'react';
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
      const conversations = await chatbotService.getConversations();
      const chatMessages: ChatMessage[] = [];
      conversations.forEach((conv: Conversation) => {
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
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(inputMessage);
      const botMessage: ChatMessage = {
        user_message: '',
        bot_response: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        user_message: '',
        bot_response: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
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
    <div className="max-w-4xl mx-auto p-6">
      {/* Glassmorphism header with neumorphic accent */}
      <div className="glass rounded-3xl p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Chatbot
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Get instant help and answers from our intelligent assistant
        </p>
      </div>

      {/* Main chat container with glassmorphism */}
      <div className="glass-strong rounded-3xl h-96 flex flex-col overflow-hidden shadow-2xl">
        {/* Messages area with subtle neumorphic inset */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 neumorphism-inset rounded-t-3xl">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <div className="neumorphism rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              Start a conversation with the AI chatbot!
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className="space-y-3">
              {message.user_message && (
                <div className="flex justify-end">
                  {/* User message with neumorphism */}
                  <div className="neumorphism rounded-2xl px-4 py-3 max-w-xs shadow-lg">
                    <p className="text-gray-800 dark:text-gray-200">{message.user_message}</p>
                  </div>
                </div>
              )}
              {message.bot_response && (
                <div className="flex justify-start">
                  {/* Bot message with glassmorphism */}
                  <div className="glass rounded-2xl px-4 py-3 max-w-xs">
                    <p className="text-gray-700 dark:text-gray-300">{message.bot_response}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl px-4 py-3 flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area with neumorphism */}
        <div className="neumorphism-inset rounded-b-3xl p-6">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 neumorphism-inset rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="neumorphism neumorphism-hover neumorphism-active rounded-xl px-6 py-3 font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
