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