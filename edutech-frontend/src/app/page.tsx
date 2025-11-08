import Link from 'next/link'
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  Chip
} from '@mui/material'
import {
  Chat,
  Summarize,
  TrendingUp,
  PlayArrow,
  Quiz,
  PersonAdd
} from '@mui/icons-material'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          mb: 6,
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box display="flex" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} mb={3}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 60,
                    height: 60,
                    mr: 2,
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <Logo size={32} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      color: '#1e293b',
                      textShadow: '0 2px 4px rgba(255,255,255,0.8)',
                      mb: 1
                    }}
                  >
                    EduTech — Learn Smarter
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                    <Chip label="Adaptive lessons" size="small" sx={{ bgcolor: 'rgba(59,130,246,0.9)', color: 'white', fontWeight: 600 }} />
                    <Chip label="AI summarizer" size="small" sx={{ bgcolor: 'rgba(139,92,246,0.9)', color: 'white', fontWeight: 600 }} />
                    <Chip label="Progress tracking" size="small" sx={{ bgcolor: 'rgba(16,185,129,0.9)', color: 'white', fontWeight: 600 }} />
                  </Box>
                </Box>
              </Box>

              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                Build your skills with bite-sized lessons, instant summarization, and adaptive quizzes. 
                Track progress and get help from an AI tutor whenever you need it.
              </Typography>

              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <Link href="/register" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PersonAdd />}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1d4ed8, #7c3aed)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>
                </Link>

                <Link href="/quizzes" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Quiz />}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      color: '#1e293b',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,1)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Explore Quizzes
                  </Button>
                </Link>

                <Link href="/summarize" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<PlayArrow />}
                    sx={{ 
                      borderRadius: 3, 
                      px: 3,
                      borderColor: 'rgba(30,41,59,0.8)',
                      color: '#1e293b',
                      fontWeight: 600,
                      bgcolor: 'rgba(255,255,255,0.7)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        borderColor: '#1e293b'
                      }
                    }}
                  >
                    Try Summarizer
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h5" fontWeight="600" mb={2}>
                  Today's Focus
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Complete a 10-min quiz to keep your streak going.
                </Typography>
                <Link href="/quizzes" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Quiz />}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      background: 'linear-gradient(45deg, #10b981, #3b82f6)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #059669, #1d4ed8)'
                      }
                    }}
                  >
                    Start Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h2" fontWeight="700" mb={6}>
          Core Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  <Chat sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" component="h4" fontWeight="600" mb={2}>
                  AI Chatbot
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get instant answers and learning guidance from our intelligent AI assistant.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar
                  sx={{
                    bgcolor: 'secondary.main',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
                  }}
                >
                  <Summarize sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" component="h4" fontWeight="600" mb={2}>
                  Smart Summarizer
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quickly digest long articles and notes with AI-powered summarization.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Avatar
                  sx={{
                    bgcolor: 'success.main',
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <TrendingUp sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography variant="h6" component="h4" fontWeight="600" mb={2}>
                  Progress Tracking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  See your growth with comprehensive analytics and easy-to-read metrics.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}