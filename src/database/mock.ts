import { v4 as uuidv4 } from 'uuid';
import { User, Message, Conversation, UserPreferences } from '../types';
import { IDatabase, IUserRepository, IMessageRepository, IConversationRepository } from './interfaces';
import logger from '../utils/logger';

class MockDatabase implements IDatabase {
  private users: Map<string, User> = new Map();
  private messages: Map<string, Message> = new Map();
  private conversations: Map<string, Conversation> = new Map();

  async connect(): Promise<void> {
    logger.info('Mock database connected');
    // Inicializar com alguns dados de exemplo
    await this.seedData();
  }

  async disconnect(): Promise<void> {
    logger.info('Mock database disconnected');
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }

  private async seedData(): Promise<void> {
    const defaultPreferences: UserPreferences = {
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notificationSettings: {
        email: true,
        push: true,
        sms: false,
      },
    };

    const mockUser: User = {
      id: uuidv4(),
      name: 'João Silva',
      phone: '+5511999999999',
      preferences: defaultPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(mockUser.id, mockUser);
    logger.info('Mock data seeded');
  }

  getUserRepository(): IUserRepository {
    return new MockUserRepository(this.users);
  }

  getMessageRepository(): IMessageRepository {
    return new MockMessageRepository(this.messages);
  }

  getConversationRepository(): IConversationRepository {
    return new MockConversationRepository(this.conversations);
  }
}

class MockUserRepository implements IUserRepository {
  constructor(private users: Map<string, User>) {}

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    logger.info(`Mock user created: ${user.id}`);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.phone === phone) return user;
    }
    return null;
  }

  async findByTelegramId(telegramId: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.telegramId === telegramId) return user;
    }
    return null;
  }

  async findByWhatsappId(whatsappId: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.whatsappId === whatsappId) return user;
    }
    return null;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    logger.info(`Mock user updated: ${id}`);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = this.users.delete(id);
    if (deleted) {
      logger.info(`Mock user deleted: ${id}`);
    }
    return deleted;
  }
}

class MockMessageRepository implements IMessageRepository {
  constructor(private messages: Map<string, Message>) {}

  async create(messageData: Omit<Message, 'id' | 'timestamp'>): Promise<Message> {
    const message: Message = {
      ...messageData,
      id: uuidv4(),
      timestamp: new Date(),
    };
    this.messages.set(message.id, message);
    logger.info(`Mock message created: ${message.id}`);
    return message;
  }

  async findById(id: string): Promise<Message | null> {
    return this.messages.get(id) || null;
  }

  async findByUserId(userId: string, limit?: number): Promise<Message[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return limit ? userMessages.slice(0, limit) : userMessages;
  }

  async findByConversationId(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.metadata?.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async update(id: string, updates: Partial<Message>): Promise<Message | null> {
    const message = this.messages.get(id);
    if (!message) return null;

    const updatedMessage = { ...message, ...updates };
    this.messages.set(id, updatedMessage);
    logger.info(`Mock message updated: ${id}`);
    return updatedMessage;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = this.messages.delete(id);
    if (deleted) {
      logger.info(`Mock message deleted: ${id}`);
    }
    return deleted;
  }
}

class MockConversationRepository implements IConversationRepository {
  constructor(private conversations: Map<string, Conversation>) {}

  async create(conversationData: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation> {
    const conversation: Conversation = {
      ...conversationData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(conversation.id, conversation);
    logger.info(`Mock conversation created: ${conversation.id}`);
    return conversation;
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.conversations.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async findByStatus(status: Conversation['status']): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(conv => conv.status === status);
  }

  async update(id: string, updates: Partial<Conversation>): Promise<Conversation | null> {
    const conversation = this.conversations.get(id);
    if (!conversation) return null;

    const updatedConversation = { ...conversation, ...updates, updatedAt: new Date() };
    this.conversations.set(id, updatedConversation);
    logger.info(`Mock conversation updated: ${id}`);
    return updatedConversation;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = this.conversations.delete(id);
    if (deleted) {
      logger.info(`Mock conversation deleted: ${id}`);
    }
    return deleted;
  }
}

export default MockDatabase; 