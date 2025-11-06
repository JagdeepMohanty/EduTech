export interface Question {
  id?: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  difficulty: string;
}

export interface Quiz {
  id?: string;
  title: string;
  description: string;
  subject: string;
  questions: Question[];
  created_at?: string;
  updated_at?: string;
}

export interface QuizAttempt {
  id?: string;
  user_id: string;
  quiz_id: string;
  answers: number[];
  score?: number;
  completed_at?: string;
  adaptive_level?: string;
}

export interface QuizResult {
  quiz_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  feedback: string;
}

export interface QuizCreate {
  title: string;
  description: string;
  subject: string;
  questions: Question[];
}

export interface QuizAttemptCreate {
  quiz_id: string;
  answers: number[];
}
