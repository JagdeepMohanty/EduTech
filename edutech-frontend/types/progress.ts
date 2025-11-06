export interface UserProgress {
  user_id: string;
  total_quizzes_taken: number;
  average_score: number;
  subjects_covered: string[];
  recent_scores: number[];
  improvement_trend: 'improving' | 'stable' | 'declining';
  strengths: string[];
  weaknesses: string[];
  recommended_difficulty: string;
}

export interface ProgressHistory {
  date: string;
  average_score: number;
  quizzes_taken: number;
}

export interface SubjectPerformance {
  subject: string;
  average_score: number;
  total_quizzes: number;
  best_score: number;
  recent_trend: string;
}

export interface AnalyticsData {
  total_users: number;
  total_quizzes: number;
  average_completion_rate: number;
  popular_subjects: string[];
  difficulty_distribution: Record<string, number>;
}
