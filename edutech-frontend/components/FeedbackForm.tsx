'use client';

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Send,
  CheckCircle
} from '@mui/icons-material';
import { FeedbackSubmission } from '@/types/feedback';
import { feedbackService } from '@/services/feedback';

const FeedbackForm: React.FC = () => {
  const [rating, setRating] = useState<number | null>(5);
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
    if (!message.trim() || !rating) return;

    setIsSubmitting(true);
    try {
      const feedbackData: FeedbackSubmission = {
        rating,
        category,
        message: message.trim(),
        subject: subject.trim() || undefined
      };
      
      await feedbackService.submitFeedback(feedbackData);
      
      setIsSubmitted(true);
      setRating(5);
      setCategory('general');
      setSubject('');
      setMessage('');
      
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'success.50' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="600" color="success.main" mb={2}>
            Thank you for your feedback!
          </Typography>
          <Typography color="success.dark">
            Your feedback has been submitted successfully and will help us improve the platform.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="700" mb={2}
          sx={{
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
          Share Your Feedback
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Help us improve the EduTech platform with your valuable insights
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FeedbackIcon color="primary" />
              How would you rate your experience? *
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                size="large"
                sx={{ fontSize: '2rem' }}
              />
              <Typography variant="body2" color="text.secondary">
                {rating} out of 5 stars
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select
                value={category}
                label="Category *"
                onChange={(e) => setCategory(e.target.value as any)}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Subject (optional)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief subject line..."
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Your Feedback *"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think..."
              required
              helperText={`${message.length} characters (minimum 10 required)`}
            />
          </Box>

          {message.trim().length < 10 && message.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              Please provide at least 10 characters of feedback.
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting || message.trim().length < 10 || !rating}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
            sx={{
              py: 1.5,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7c3aed, #db2777)'
              }
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FeedbackForm;