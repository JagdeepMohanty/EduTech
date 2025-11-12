export interface FeedbackSubmission {
  rating: number;
  category: string;
  message: string;
  subject?: string;
}

export interface FeedbackResponse {
  id: string;
  user_id: string;
  rating: number;
  category: string;
  subject?: string;
  message: string;
  submitted_at: string;
  is_resolved: boolean;
}

export interface FeedbackStats {
  total_feedbacks: number;
  average_rating: number;
  category_breakdown: Record<string, number>;
  recent_feedbacks: number;
}