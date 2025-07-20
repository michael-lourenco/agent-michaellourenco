import { User, Message, Conversation } from '../types';

export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface IUserRepository {
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findByTelegramId(telegramId: string): Promise<User | null>;
  findByWhatsappId(whatsappId: string): Promise<User | null>;
  update(id: string, updates: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

export interface IMessageRepository {
  create(message: Omit<Message, 'id' | 'timestamp'>): Promise<Message>;
  findById(id: string): Promise<Message | null>;
  findByUserId(userId: string, limit?: number): Promise<Message[]>;
  findByConversationId(conversationId: string): Promise<Message[]>;
  update(id: string, updates: Partial<Message>): Promise<Message | null>;
  delete(id: string): Promise<boolean>;
}

export interface IConversationRepository {
  create(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findByUserId(userId: string): Promise<Conversation[]>;
  findByStatus(status: Conversation['status']): Promise<Conversation[]>;
  update(id: string, updates: Partial<Conversation>): Promise<Conversation | null>;
  delete(id: string): Promise<boolean>;
} 