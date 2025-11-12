export interface RecentAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total_questions?: number;
  answers: number[];
  completed_at: string;
  adaptive_level: string;
}

export interface ProgressData {
  total_quizzes: number;
  average_score: number;
  recent_activity: number;
  subject_performance: any[];
  recent_attempts: RecentAttempt[];
  performance_trend: string;
}

export interface ProgressDashboard extends ProgressData {}