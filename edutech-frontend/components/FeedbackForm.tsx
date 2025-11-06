'use client';

import React, { useState } from 'react';
import { FeedbackSubmission } from '@/types/feedback';
import { feedbackService } from '@/services/feedback';

const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<'general' | 'quiz' | 'chatbot' | 'summarization' | 'ui'>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'chatbot', label: 'AI Chatbot' },
    { value: 'summarization', label: 'Content Summarization' },
    { value: 'ui', label: 'User Interface' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      const feedback: FeedbackSubmission = {
        rating,
        category,
        subject: subject.trim() || undefined,
        message: message.trim(),
      };

      await feedbackService.submitFeedback(feedback);
      setIsSubmitted(true);

      // Reset form
      setRating(5);
      setCategory('general');
      setSubject('');
      setMessage('');

      // Hide success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Thank you for your feedback!</h2>
          <p className="text-green-700">Your feedback has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="glass rounded-3xl p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Share Your Feedback
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Help us improve the EduTech platform with your valuable insights
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 shadow-2xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you rate your experience? *
          </label>
          {renderStars()}
          <p className="text-sm text-gray-500 mt-1">{rating} out of 5 stars</p>
        </div>

        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="neumorphism w-full px-3 py-3 focus:outline-none focus:neumorphism-inset transition-all duration-200 rounded-lg"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject (optional)
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief subject line..."
            className="neumorphism w-full px-3 py-3 focus:outline-none focus:neumorphism-inset transition-all duration-200 rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback *
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think..."
            rows={6}
            className="neumorphism w-full px-3 py-3 focus:outline-none focus:neumorphism-inset transition-all duration-200 rounded-lg resize-vertical"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {message.length} characters (minimum 10 required)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || message.trim().length < 10}
          className="neumorphism w-full py-4 text-lg font-semibold hover:neumorphism-pressed disabled:neumorphism-pressed disabled:cursor-not-allowed transition-all duration-200 rounded-lg"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
