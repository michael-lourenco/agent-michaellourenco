import { v4 as uuidv4 } from 'uuid';
import { Message, User } from '../types';
import { IWhatsAppService, ITelegramService, IWebInterfaceService } from './interfaces';
import logger from '../utils/logger';

class MockWhatsAppService implements IWhatsAppService {
  private readonly serviceName = 'WhatsApp';

  async sendMessage(userId: string, content: string, metadata?: Record<string, any>): Promise<boolean> {
    logger.info(`Mock WhatsApp sending message to ${userId}: ${content.substring(0, 50)}...`);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 100));
    
    logger.info(`Mock WhatsApp message sent successfully to ${userId}`);
    return true;
  }

  async receiveMessage(message: any): Promise<Message> {
    logger.info('Mock WhatsApp received message');
    
    const mockMessage: Message = {
      id: uuidv4(),
      userId: message.from || 'mock_user_id',
      channel: 'whatsapp',
      content: message.text || 'Mensagem de teste',
      timestamp: new Date(),
      direction: 'inbound',
      metadata: {
        whatsappMessageId: message.id,
        from: message.from,
        to: message.to,
      },
    };
    
    return mockMessage;
  }

  verifyWebhook(token: string, challenge: string): string {
    logger.info(`Mock WhatsApp webhook verification with challenge: ${challenge}`);
    return challenge;
  }

  async processWebhook(payload: any): Promise<Message> {
    logger.info('Mock WhatsApp processing webhook');
    
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages?.[0];
    
    if (messages) {
      return this.receiveMessage({
        id: messages.id,
        from: messages.from,
        text: messages.text?.body,
        timestamp: messages.timestamp,
      });
    }
    
    throw new Error('Invalid webhook payload');
  }

  getServiceName(): string {
    return this.serviceName;
  }
}

class MockTelegramService implements ITelegramService {
  private readonly serviceName = 'Telegram';

  async sendMessage(userId: string, content: string, metadata?: Record<string, any>): Promise<boolean> {
    logger.info(`Mock Telegram sending message to ${userId}: ${content.substring(0, 50)}...`);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 100));
    
    logger.info(`Mock Telegram message sent successfully to ${userId}`);
    return true;
  }

  async receiveMessage(message: any): Promise<Message> {
    logger.info('Mock Telegram received message');
    
    const mockMessage: Message = {
      id: uuidv4(),
      userId: message.from?.id?.toString() || 'mock_user_id',
      channel: 'telegram',
      content: message.text || 'Mensagem de teste',
      timestamp: new Date(),
      direction: 'inbound',
      metadata: {
        telegramMessageId: message.message_id,
        from: message.from,
        chat: message.chat,
      },
    };
    
    return mockMessage;
  }

  async setWebhook(url: string): Promise<boolean> {
    logger.info(`Mock Telegram setting webhook to: ${url}`);
    return true;
  }

  async processUpdate(update: any): Promise<Message> {
    logger.info('Mock Telegram processing update');
    
    if (update.message) {
      return this.receiveMessage(update.message);
    }
    
    throw new Error('Invalid update payload');
  }

  getServiceName(): string {
    return this.serviceName;
  }

  onMessage(handler: (message: Message) => void): void {
    // Mock implementation - não faz nada
    logger.info('Mock Telegram onMessage called (no real handlers)');
  }

  async stop(): Promise<void> {
    logger.info('Mock Telegram service stopped');
  }
}

class MockWebInterfaceService implements IWebInterfaceService {
  private readonly serviceName = 'Web Interface';
  private sessions: Map<string, { userId: string; createdAt: Date }> = new Map();

  async sendMessage(userId: string, content: string, metadata?: Record<string, any>): Promise<boolean> {
    logger.info(`Mock Web Interface sending message to ${userId}: ${content.substring(0, 50)}...`);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 50));
    
    logger.info(`Mock Web Interface message sent successfully to ${userId}`);
    return true;
  }

  async receiveMessage(message: any): Promise<Message> {
    logger.info('Mock Web Interface received message');
    
    const mockMessage: Message = {
      id: uuidv4(),
      userId: message.userId || 'mock_user_id',
      channel: 'web',
      content: message.content || 'Mensagem de teste',
      timestamp: new Date(),
      direction: 'inbound',
      metadata: {
        sessionId: message.sessionId,
        userAgent: message.userAgent,
      },
    };
    
    return mockMessage;
  }

  async createSession(userId: string): Promise<string> {
    const sessionId = uuidv4();
    this.sessions.set(sessionId, {
      userId,
      createdAt: new Date(),
    });
    
    logger.info(`Mock Web Interface session created: ${sessionId} for user: ${userId}`);
    return sessionId;
  }

  async validateSession(sessionId: string): Promise<User | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }
    
    // Simular usuário mock
    const mockUser: User = {
      id: session.userId,
      name: 'Usuário Web',
      preferences: {
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notificationSettings: {
          email: true,
          push: true,
          sms: false,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return mockUser;
  }

  getServiceName(): string {
    return this.serviceName;
  }
}

export { MockWhatsAppService, MockTelegramService, MockWebInterfaceService }; 