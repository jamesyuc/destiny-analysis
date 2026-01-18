export interface Slot {
  key: string;
  question_intent: string; // The intent for the AI to ask about
  description?: string;
}

export interface SlotState extends Slot {
  value?: string;
  is_filled: boolean;
}

export interface Dimension {
  id: string; // 'career', 'love', etc.
  label: string;
  description: string;
  slots: Slot[];
}

export interface KnowledgeBase {
  [key: string]: Dimension;
}

export interface UserProfile {
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthHour: string;
  gender: 'male' | 'female';
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
