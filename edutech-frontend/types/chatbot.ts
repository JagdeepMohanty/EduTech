export interface ChatMessage {
  id?: string;
  user_message: string;
  bot_response: string;
  timestamp?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
}

export interface Conversation {
  id: string;
  user_message: string;
  bot_response: string;
  timestamp: string;
}
