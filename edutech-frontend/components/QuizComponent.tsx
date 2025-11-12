'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Card,
  CardContent,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  NavigateBefore,
  NavigateNext,
  CheckCircle,
  Quiz as QuizIcon,
  ArrowBack
} from '@mui/icons-material';
import { Quiz, Question, QuizResult } from '@/types/quiz';
import { quizService } from '@/services/quiz';

interface QuizComponentProps {
  quizId: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizId }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const quizData = await quizService.getQuiz(quizId);
      setQuiz(quizData);
      setAnswers(new Array(quizData.questions.length).fill(-1));
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const result = await quizService.submitQuizAttempt(quizId, answers);
      setResult(result);
      setShowResult(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading quiz...</Typography>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Quiz not found.</Typography>
      </Container>
    );
  }

  if (showResult && result) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ textAlign: 'center', borderRadius: 4 }}>
          <CardContent sx={{ p: 6 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h3" fontWeight="700" mb={2}>
              Quiz Complete!
            </Typography>
            <Typography variant="h5" mb={4}>{quiz.title}</Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" color="primary.main" fontWeight="700" mb={1}>
                {result.score} / {result.total_questions}
              </Typography>
              <Chip 
                label={`${result.percentage.toFixed(1)}%`} 
                color={result.percentage >= 70 ? 'success' : result.percentage >= 50 ? 'warning' : 'error'}
                size="large"
                sx={{ fontSize: '1.2rem', px: 2, py: 1 }}
              />
            </Box>
            
            <Typography variant="body1" color="text.secondary" mb={4}>
              {result.feedback}
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/quizzes')}
              sx={{ borderRadius: 3, px: 4 }}
            >
              Back to Quizzes
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="700" mb={2}
          sx={{
            background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
          {quiz.title}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Test your knowledge with this interactive quiz
        </Typography>
      </Paper>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body1" fontWeight="600">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </Typography>
              <Chip 
                label={`${Math.round(progress)}% Complete`} 
                color="primary" 
                variant="outlined" 
                size="small" 
              />
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <Paper variant="outlined" sx={{ p: 4, mb: 4, borderRadius: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QuizIcon color="primary" />
              {currentQuestion.question_text}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[currentQuestionIndex] !== -1 ? answers[currentQuestionIndex] : ''}
                onChange={(e) => handleAnswerSelect(currentQuestionIndex, parseInt(e.target.value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <Paper
                    key={index}
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      bgcolor: answers[currentQuestionIndex] === index ? 'primary.50' : 'transparent',
                      borderColor: answers[currentQuestionIndex] === index ? 'primary.main' : 'divider',
                      '&:hover': {
                        bgcolor: 'primary.50',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <FormControlLabel
                      value={index}
                      control={<Radio />}
                      label={option}
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              startIcon={<NavigateBefore />}
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              sx={{ borderRadius: 3, px: 3 }}
            >
              Previous
            </Button>

            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                variant="contained"
                endIcon={<CheckCircle />}
                onClick={handleSubmit}
                disabled={answers.includes(-1)}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #059669, #047857)'
                  }
                }}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<NavigateNext />}
                onClick={handleNext}
                disabled={answers[currentQuestionIndex] === -1}
                sx={{ borderRadius: 3, px: 3 }}
              >
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QuizComponent;