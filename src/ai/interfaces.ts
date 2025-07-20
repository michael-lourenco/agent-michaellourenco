import { AIResponse, Message, User } from '../types';

export interface IAIEngine {
  processMessage(message: string, user: User, context?: Message[]): Promise<AIResponse>;
  analyzeSentiment(text: string): Promise<number>; // -1 to 1 (negative to positive)
  extractIntent(text: string): Promise<string>;
  extractEntities(text: string): Promise<Record<string, any>>;
}

export interface IKnowledgeBase {
  search(query: string, limit?: number): Promise<Array<{ content: string; score: number }>>;
  addDocument(content: string, metadata?: Record<string, any>): Promise<void>;
  updateDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void>;
  deleteDocument(id: string): Promise<void>;
}

export interface ILangChainService {
  generateResponse(prompt: string, context?: string): Promise<string>;
  summarizeText(text: string): Promise<string>;
  translateText(text: string, targetLanguage: string): Promise<string>;
} 