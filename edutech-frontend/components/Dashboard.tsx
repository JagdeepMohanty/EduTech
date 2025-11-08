'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Avatar,
  Paper,
  Alert
} from '@mui/material';
import {
  Quiz,
  TrendingUp,
  School,
  EmojiEvents,
  CheckCircle,
  Warning,
  BarChart
} from '@mui/icons-material';
import { UserProgress, ProgressHistory, SubjectPerformance } from '@/types/progress';
import { progressService } from '@/services/progress';

const Dashboard: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [progressHistory, setProgressHistory] = useState<ProgressHistory[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo purposes when API is not available
      const mockProgress = {
        total_quizzes_taken: 12,
        average_score: 85,
        improvement_trend: 'improving',
        recommended_difficulty: 'medium',
        strengths: ['Mathematics', 'Science'],
        weaknesses: ['History']
      };
      const mockHistory = [
        { date: '2024-01-01', average_score: 80 },
        { date: '2024-01-02', average_score: 85 },
        { date: '2024-01-03', average_score: 90 }
      ];
      const mockSubjects = [
        { subject: 'Mathematics', average_score: 90, total_quizzes: 5, best_score: 95 },
        { subject: 'Science', average_score: 85, total_quizzes: 4, best_score: 92 },
        { subject: 'History', average_score: 75, total_quizzes: 3, best_score: 80 }
      ];
      
      setUserProgress(mockProgress);
      setProgressHistory(mockHistory);
      setSubjectPerformance(mockSubjects);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!userProgress) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          <Typography variant="h6">No progress data available yet</Typography>
          <Typography>Take some quizzes to see your analytics!</Typography>
        </Alert>
      </Container>
    );
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'success.main';
      case 'declining': return 'error.main';
      default: return 'text.secondary';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp color="success" />;
      case 'declining': return <TrendingUp color="error" sx={{ transform: 'rotate(180deg)' }} />;
      default: return <BarChart color="action" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: 4
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Learning Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track your progress and discover insights about your learning journey
        </Typography>
      </Paper>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <Quiz />
                </Avatar>
                <Typography variant="h6" component="div">
                  Total Quizzes
                </Typography>
              </Box>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                {userProgress.total_quizzes_taken}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <EmojiEvents />
                </Avatar>
                <Typography variant="h6" component="div">
                  Average Score
                </Typography>
              </Box>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                {userProgress.average_score}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: getTrendColor(userProgress.improvement_trend), mr: 2 }}>
                  {getTrendIcon(userProgress.improvement_trend)}
                </Avatar>
                <Typography variant="h6" component="div">
                  Trend
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ color: getTrendColor(userProgress.improvement_trend), textTransform: 'capitalize' }}
                fontWeight="bold"
              >
                {userProgress.improvement_trend}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <School />
                </Avatar>
                <Typography variant="h6" component="div">
                  Recommended Level
                </Typography>
              </Box>
              <Chip
                label={userProgress.recommended_difficulty}
                color="secondary"
                size="large"
                sx={{ fontSize: '1.1rem', textTransform: 'capitalize' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2" fontWeight="600">
              Progress Over Time
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {progressHistory.length > 0 ? (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))'
              }}
            >
              <Box sx={{ height: 300, display: 'flex', alignItems: 'end', gap: 1 }}>
                {progressHistory.map((entry, index) => (
                  <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: `${(entry.average_score / 100) * 250}px`,
                        background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                        }
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        transform: 'rotate(-45deg)',
                        fontSize: '0.7rem',
                        color: 'text.secondary'
                      }}
                    >
                      {new Date(entry.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                bgcolor: 'grey.50'
              }}
            >
              <Avatar sx={{ bgcolor: 'grey.300', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                <BarChart sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography color="text.secondary">
                No progress data for the selected period.
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" fontWeight="600" mb={3}>
            Subject Performance
          </Typography>
          {subjectPerformance.length > 0 ? (
            <Grid container spacing={3}>
              {subjectPerformance.map((subject) => (
                <Grid item xs={12} md={6} lg={4} key={subject.subject}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" component="h3" mb={2} fontWeight="600">
                        {subject.subject}
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Average Score:
                          </Typography>
                          <Chip
                            label={`${subject.average_score}%`}
                            color="success"
                            size="small"
                          />
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Total Quizzes:
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            {subject.total_quizzes}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                          <Typography variant="body2" color="text.secondary">
                            Best Score:
                          </Typography>
                          <Chip
                            label={`${subject.best_score}%`}
                            color="primary"
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="body2">Progress</Typography>
                          <Typography variant="body2" fontWeight="600">
                            {subject.average_score}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={subject.average_score}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)'
                            }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                bgcolor: 'grey.50'
              }}
            >
              <Typography color="text.secondary">
                No subject performance data available.
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Strengths and Weaknesses */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
                  <CheckCircle sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h5" component="h2" color="success.main" fontWeight="600">
                  Strengths
                </Typography>
              </Box>
              {userProgress.strengths.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {userProgress.strengths.map((strength, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        bgcolor: 'success.50'
                      }}
                    >
                      <CheckCircle sx={{ color: 'success.main', mr: 2 }} />
                      <Typography variant="body1">{strength}</Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: 'grey.50'
                  }}
                >
                  <Typography color="text.secondary">
                    No strengths identified yet.
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 48, height: 48 }}>
                  <Warning sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h5" component="h2" color="warning.main" fontWeight="600">
                  Areas for Improvement
                </Typography>
              </Box>
              {userProgress.weaknesses.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {userProgress.weaknesses.map((weakness, index) => (
                    <Paper
                      key={index}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 2,
                        bgcolor: 'warning.50'
                      }}
                    >
                      <Warning sx={{ color: 'warning.main', mr: 2 }} />
                      <Typography variant="body1">{weakness}</Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: 'grey.50'
                  }}
                >
                  <Typography color="text.secondary">
                    No weaknesses identified. Great job!
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
