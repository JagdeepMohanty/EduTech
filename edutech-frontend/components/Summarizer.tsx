'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Collapse,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Summarize as SummarizeIcon,
  History,
  ExpandMore,
  ExpandLess,
  TextFields,
  Analytics
} from '@mui/icons-material';
import { SummarizeRequest, SummarizeResponse, SummaryHistory } from '@/types/summarization';
import { summarizationService } from '@/services/summarization';

const Summarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState<SummarizeResponse | null>(null);
  const [history, setHistory] = useState<SummaryHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [maxLength, setMaxLength] = useState(150);
  const [minLength, setMinLength] = useState(30);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const summaryHistory = await summarizationService.getSummaryHistory();
      setHistory(summaryHistory);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const request: SummarizeRequest = {
        text: inputText,
        max_length: maxLength
      };
      const result = await summarizationService.summarizeText(request);
      setSummary(result);
      loadHistory();
    } catch (error) {
      console.error('Error summarizing text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = inputText.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="700" mb={2}
          sx={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
          Content Summarization
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Transform long texts into concise summaries with AI
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextFields color="primary" />
                  Enter text to summarize
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here..."
                  sx={{ mb: 1 }}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Word count: {wordCount}
                  </Typography>
                  {wordCount < 10 && inputText.trim() && (
                    <Chip label="Text must be at least 10 words" color="error" size="small" />
                  )}
                </Box>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Length (words)"
                    value={maxLength}
                    onChange={(e) => setMaxLength(Number(e.target.value))}
                    inputProps={{ min: 30, max: 300 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Min Length (words)"
                    value={minLength}
                    onChange={(e) => setMinLength(Number(e.target.value))}
                    inputProps={{ min: 10, max: 100 }}
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSummarize}
                disabled={!inputText.trim() || isLoading || wordCount < 10}
                startIcon={isLoading ? <CircularProgress size={20} /> : <SummarizeIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1d4ed8, #7c3aed)'
                  }
                }}
              >
                {isLoading ? 'Summarizing...' : 'Summarize Text'}
              </Button>
            </CardContent>
          </Card>

          {summary && (
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Analytics color="success" />
                  Summary Result
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {summary.summary}
                  </Typography>
                </Paper>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Chip label={`Original: ${summary.original_length} words`} color="primary" variant="outlined" />
                  <Chip label={`Summary: ${summary.summary_length} words`} color="secondary" variant="outlined" />
                  <Chip 
                    label={`Compression: ${((1 - summary.summary_length / summary.original_length) * 100).toFixed(1)}%`} 
                    color="success" 
                    variant="outlined" 
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <History color="action" />
                  History
                </Typography>
                <Button
                  size="small"
                  onClick={() => setShowHistory(!showHistory)}
                  endIcon={showHistory ? <ExpandLess /> : <ExpandMore />}
                >
                  {showHistory ? 'Hide' : 'Show'}
                </Button>
              </Box>

              <Collapse in={showHistory}>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {history.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      No summaries yet. Create your first summary!
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {history.map((item) => (
                        <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            {new Date(item.timestamp).toLocaleString()}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                            Original:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem' }}>
                            {item.original_text.substring(0, 100)}...
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                            Summary:
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem' }}>
                            {item.summary}
                          </Typography>
                          <Chip 
                            label={`${item.original_length} → ${item.summary_length} words`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Summarizer;