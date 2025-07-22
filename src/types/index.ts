export interface Message {
  id: string;
  userId: string;
  channel: 'whatsapp' | 'telegram' | 'web' | 'webchat';
  content: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  telegramId?: string;
  whatsappId?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface AIResponse {
  content: string;
  confidence: number;
  intent: string;
  entities: Record<string, any>;
  suggestedActions?: string[];
}

export interface Conversation {
  id: string;
  userId: string;
  channel: 'whatsapp' | 'telegram' | 'web' | 'webchat';
  status: 'active' | 'closed' | 'escalated';
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseConfig {
  url: string;
  type: 'postgresql' | 'mysql' | 'mock';
}

export interface AIConfig {
  provider: 'openai' | 'mock';
  apiKey: string;
  model: string;
  temperature: number;
}

export interface MessagingConfig {
  whatsapp: {
    token: string;
    phoneNumberId: string;
  };
  telegram: {
    token: string;
  };
} 