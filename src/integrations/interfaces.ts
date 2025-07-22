import { Message, User } from '../types';

export interface IMessagingService {
  sendMessage(userId: string, content: string, metadata?: Record<string, any>): Promise<boolean>;
  receiveMessage(message: any): Promise<Message>;
  getServiceName(): string;
}

export interface IWhatsAppService extends IMessagingService {
  verifyWebhook(token: string, challenge: string): string;
  processWebhook(payload: any): Promise<Message>;
}

export interface ITelegramService extends IMessagingService {
  setWebhook(url: string): Promise<boolean>;
  processUpdate(update: any): Promise<Message>;
  onMessage?(handler: (message: Message) => void): void;
  stop?(): Promise<void>;
}

export interface IWebInterfaceService extends IMessagingService {
  createSession(userId: string): Promise<string>;
  validateSession(sessionId: string): Promise<User | null>;
}

// Nova interface para chat web
export interface IWebChatService extends IMessagingService {
  createSession(userId: string): Promise<string>;
  validateSession(sessionId: string): Promise<User | null>;
  getSessionHistory(sessionId: string): Promise<Message[]>;
  clearSession(sessionId: string): Promise<void>;
}

// Interface para canais genéricos
export interface IChannelService extends IMessagingService {
  channelType: 'telegram' | 'whatsapp' | 'web' | 'webchat' | 'api';
  onMessage?(handler: (message: Message) => void): void;
  stop?(): Promise<void>;
  isConnected?(): boolean;
} 