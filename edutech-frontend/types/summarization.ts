export interface SummarizeRequest {
  text: string;
  max_length?: number;
  min_length?: number;
}

export interface SummarizeResponse {
  summary: string;
  original_length: number;
  summary_length: number;
  summary_id: string;
}

export interface SummaryHistory {
  id: string;
  original_text: string;
  summary: string;
  original_length: number;
  summary_length: number;
  timestamp: string;
}
