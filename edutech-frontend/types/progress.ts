export interface RecentAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  answers: number[];
  completed_at: string;
  adaptive_level: string;
}

export interface ProgressDashboard {
  total_quizzes: number;
  average_score: number;
  recent_activity: number;
  subject_performance: any[];
  recent_attempts: RecentAttempt[];
  performance_trend?: string;
}