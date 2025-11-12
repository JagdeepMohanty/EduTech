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
import { ProgressDashboard } from '@/types/progress';
import { progressService } from '@/services/progress';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<ProgressDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await progressService.getDashboard();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      setError(error.response?.data?.detail || 'Failed to load dashboard data');
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          <Typography variant="h6">Error loading dashboard</Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Container>
    );
  }

  if (!dashboardData) {
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
                {dashboardData.total_quizzes}
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
                {dashboardData.average_score}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: getTrendColor(dashboardData.performance_trend || 'stable'), mr: 2 }}>
                  {getTrendIcon(dashboardData.performance_trend || 'stable')}
                </Avatar>
                <Typography variant="h6" component="div">
                  Trend
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ color: getTrendColor(dashboardData.performance_trend || 'stable'), textTransform: 'capitalize' }}
                fontWeight="bold"
              >
                {dashboardData.performance_trend === 'improving' ? 'Improving' : dashboardData.performance_trend === 'needs_improvement' ? 'Needs Work' : 'Stable'}
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
                label="Medium"
                color="secondary"
                size="large"
                sx={{ fontSize: '1.1rem', textTransform: 'capitalize' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" fontWeight="600" mb={3}>
            Recent Quiz Attempts
          </Typography>
          {dashboardData.recent_attempts.length > 0 ? (
            <Grid container spacing={2}>
              {dashboardData.recent_attempts.map((attempt, index) => (
                <Grid item xs={12} sm={6} md={4} key={attempt.id}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="600">
                        Quiz #{index + 1}
                      </Typography>
                      <Chip
                        label={`${attempt.score} points`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Completed: {new Date(attempt.completed_at).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Level: {attempt.adaptive_level}
                    </Typography>
                  </Paper>
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
              <Avatar sx={{ bgcolor: 'grey.300', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                <Quiz sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography color="text.secondary">
                No recent quiz attempts. Take a quiz to get started!
              </Typography>
            </Paper>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" fontWeight="600" mb={3}>
            Activity Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))'
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600">
                    Recent Activity
                  </Typography>
                </Box>
                <Typography variant="h4" color="success.main" fontWeight="bold" mb={1}>
                  {dashboardData.recent_activity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quiz attempts in the last 7 days
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))'
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <School />
                  </Avatar>
                  <Typography variant="h6" fontWeight="600">
                    Learning Progress
                  </Typography>
                </Box>
                <Typography variant="h4" color="primary.main" fontWeight="bold" mb={1}>
                  {dashboardData.performance_trend === 'improving' ? '📈' : dashboardData.performance_trend === 'needs_improvement' ? '📊' : '📈'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dashboardData.performance_trend === 'improving' ? 'Great progress!' : 'Keep learning!'}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
