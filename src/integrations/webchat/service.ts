import { IWebChatService, IChannelService } from '../interfaces';
import { Message, User } from '../../types';
import logger from '../../utils/logger';

interface ChatSession {
  sessionId: string;
  userId: string;
  user: User;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

export class WebChatService implements IWebChatService, IChannelService {
  channelType: 'webchat' = 'webchat';
  private sessions: Map<string, ChatSession> = new Map();
  private messageHandlers: ((message: Message) => void)[] = [];

  constructor() {
    logger.info('WebChat service initialized');
  }

  async createSession(userId: string): Promise<string> {
    const sessionId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user: User = {
      id: userId,
      name: `Usuário Web ${userId}`,
      preferences: {
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notificationSettings: {
          email: false,
          push: false,
          sms: false,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const session: ChatSession = {
      sessionId,
      userId,
      user,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, session);
    logger.info(`Created web chat session: ${sessionId} for user: ${userId}`);
    
    return sessionId;
  }

  async validateSession(sessionId: string): Promise<User | null> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
      return session.user;
    }
    return null;
  }

  async getSessionHistory(sessionId: string): Promise<Message[]> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date();
      return session.messages;
    }
    return [];
  }

  async clearSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messages = [];
      session.lastActivity = new Date();
      logger.info(`Cleared session history: ${sessionId}`);
    }
  }

  async sendMessage(userId: string, content: string, metadata?: Record<string, any>): Promise<boolean> {
    try {
      const sessionId = metadata?.sessionId;
      if (!sessionId) {
        logger.error('No sessionId provided for web chat message');
        return false;
      }

      const session = this.sessions.get(sessionId);
      if (!session) {
        logger.error(`Session not found: ${sessionId}`);
        return false;
      }

      const message: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.userId,
        channel: 'webchat',
        content,
        timestamp: new Date(),
        direction: 'outbound',
        metadata: {
          sessionId,
          ...metadata,
        },
      };

      session.messages.push(message);
      session.lastActivity = new Date();

      logger.info(`Web chat message sent to session ${sessionId}: ${content.substring(0, 50)}...`);
      return true;
    } catch (error) {
      logger.error('Error sending web chat message:', error);
      return false;
    }
  }

  async receiveMessage(messageData: any): Promise<Message> {
    const { sessionId, content, userId } = messageData;
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.userId,
      channel: 'webchat',
      content,
      timestamp: new Date(),
      direction: 'inbound',
      metadata: {
        sessionId,
        userId,
      },
    };

    session.messages.push(message);
    session.lastActivity = new Date();

    // Notificar handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        logger.error('Error in message handler:', error);
      }
    });

    logger.info(`Web chat message received from session ${sessionId}: ${content.substring(0, 50)}...`);
    return message;
  }

  onMessage(handler: (message: Message) => void): void {
    this.messageHandlers.push(handler);
  }

  getServiceName(): string {
    return 'WebChatService';
  }

  // Método para limpar sessões antigas (pode ser chamado periodicamente)
  cleanupOldSessions(maxAgeHours: number = 24): void {
    const cutoff = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    const sessionsToDelete: string[] = [];

    this.sessions.forEach((session, sessionId) => {
      if (session.lastActivity < cutoff) {
        sessionsToDelete.push(sessionId);
      }
    });

    sessionsToDelete.forEach(sessionId => {
      this.sessions.delete(sessionId);
      logger.info(`Cleaned up old session: ${sessionId}`);
    });
  }

  // Método para obter estatísticas
  getStats(): { totalSessions: number; activeSessions: number } {
    const now = new Date();
    const activeSessions = Array.from(this.sessions.values()).filter(
      session => now.getTime() - session.lastActivity.getTime() < 30 * 60 * 1000 // 30 minutos
    ).length;

    return {
      totalSessions: this.sessions.size,
      activeSessions,
    };
  }
} 