'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Quiz as QuizIcon,
  PlayArrow,
  Subject,
  AccessTime
} from '@mui/icons-material';
import { Quiz } from '@/types/quiz';
import { quizService } from '@/services/quiz';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, [subject]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzes(subject || undefined);
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading quizzes...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" fontWeight="700" mb={4} textAlign="center">
        Available Quizzes
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Subject</InputLabel>
          <Select
            value={subject}
            label="Filter by Subject"
            onChange={(e) => setSubject(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Subjects</MenuItem>
            <MenuItem value="Mathematics">Mathematics</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
            <MenuItem value="Geography">Geography</MenuItem>
            <MenuItem value="Literature">Literature</MenuItem>
            <MenuItem value="General">General</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {quizzes.map((quiz) => (
          <Grid item xs={12} sm={6} md={4} key={quiz.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <QuizIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2" fontWeight="600">
                    {quiz.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Explore {quiz.subject} with {quiz.questions.length} engaging questions
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Chip
                    icon={<Subject />}
                    label={quiz.subject}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<AccessTime />}
                    label={`${quiz.questions.length} questions`}
                    color="secondary"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Link href={`/quiz/${quiz.id}`} style={{ textDecoration: 'none', width: '100%' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<PlayArrow />}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1d4ed8, #7c3aed)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Take Quiz
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {quizzes.length === 0 && (
        <Alert severity="info" sx={{ mt: 4, borderRadius: 3 }}>
          <Typography variant="h6">No quizzes available</Typography>
          <Typography>No quizzes found for the selected subject. Try selecting a different subject or check back later.</Typography>
        </Alert>
      )}
    </Container>
  );
};

export default QuizList;
