import { Message, User, AIResponse } from '../types';
import { IChannelService, IWebChatService } from '../integrations/interfaces';
import AIFactory from '../ai/factory';
import { TelegramServiceSingleton } from '../integrations/telegram/singleton';
import { WebChatService } from '../integrations/webchat/service';
import logger from '../utils/logger';

export class MultiChannelProcessor {
  private channels: Map<string, IChannelService> = new Map();
  private aiFactory: AIFactory;

  constructor() {
    this.aiFactory = AIFactory.getInstance();
    this.initializeChannels();
    this.setupMessageHandlers();
  }

  private initializeChannels(): void {
    // Inicializar Telegram
    try {
      const telegramService = TelegramServiceSingleton.getInstance();
      (telegramService as any).channelType = 'telegram';
      this.channels.set('telegram', telegramService as unknown as IChannelService);
      logger.info('Telegram channel initialized');
    } catch (error) {
      logger.error('Failed to initialize Telegram channel:', error);
    }

    // Inicializar WebChat
    try {
      logger.info('Initializing WebChat service...');
      const webChatService = new WebChatService();
      this.channels.set('webchat', webChatService);
      logger.info('WebChat channel initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize WebChat channel:', error);
    }
  }

  private setupMessageHandlers(): void {
    // Configurar handlers para cada canal
    this.channels.forEach((channel, channelName) => {
      if (channel.onMessage) {
        channel.onMessage(async (message: Message) => {
          await this.processIncomingMessage(message);
        });
        logger.info(`Message handler set up for ${channelName}`);
      }
    });
  }

  private async processIncomingMessage(message: Message): Promise<void> {
    try {
      logger.info(`Processing incoming message from ${message.channel}: ${message.userId} - ${message.content}`);

      // Criar ou buscar usuário
      const user = await this.getOrCreateUser(message);

      // Processar mensagem com IA
      const aiResponse = await this.aiFactory.getAIEngine().processMessage(message.content, user);

      // Enviar resposta de volta para o canal apropriado
      await this.sendResponseToChannel(message.channel, message.userId, aiResponse, message.metadata);

      logger.info(`✅ Response sent successfully to ${message.channel}: ${aiResponse.content.substring(0, 50)}...`);
    } catch (error) {
      logger.error('Error processing incoming message:', error);
      
      // Enviar mensagem de erro amigável
      await this.sendResponseToChannel(message.channel, message.userId, {
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
        confidence: 0.5,
        intent: 'error',
        entities: {},
        suggestedActions: ['retry'],
      }, message.metadata);
    }
  }

  private async getOrCreateUser(message: Message): Promise<User> {
    // Para Telegram
    if (message.channel === 'telegram') {
      return {
        id: message.userId,
        name: message.metadata?.from?.first_name || 'Usuário Telegram',
        telegramId: message.userId,
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
    }

    // Para WebChat
    if (message.channel === 'webchat') {
      const webChatService = this.channels.get('webchat') as unknown as IWebChatService;
      const sessionId = message.metadata?.sessionId;
      
      if (sessionId) {
        const user = await webChatService.validateSession(sessionId);
        if (user) return user;
      }

      return {
        id: message.userId,
        name: `Usuário Web ${message.userId}`,
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
    }

    // Fallback
    return {
      id: message.userId,
      name: 'Usuário',
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
  }

  private async sendResponseToChannel(
    channel: string, 
    userId: string, 
    aiResponse: AIResponse, 
    metadata?: Record<string, any>
  ): Promise<void> {
    const channelService = this.channels.get(channel);
    if (!channelService) {
      logger.error(`Channel not found: ${channel}`);
      return;
    }

    try {
      if (channel === 'telegram') {
        const chatId = metadata?.chatId || userId;
        await channelService.sendMessage(chatId, aiResponse.content, {
          chatId: chatId,
          options: {
            parse_mode: 'Markdown',
          },
        });
      } else if (channel === 'webchat') {
        await channelService.sendMessage(userId, aiResponse.content, {
          sessionId: metadata?.sessionId,
        });
      } else {
        await channelService.sendMessage(userId, aiResponse.content, metadata);
      }
    } catch (error) {
      logger.error(`Error sending response to ${channel}:`, error);
      throw error;
    }
  }

  // Métodos públicos para uso externo

  async processMessage(message: Message): Promise<AIResponse> {
    const user = await this.getOrCreateUser(message);
    return await this.aiFactory.getAIEngine().processMessage(message.content, user);
  }

  async sendMessage(channel: string, userId: string, content: string, metadata?: Record<string, any>): Promise<boolean> {
    const channelService = this.channels.get(channel);
    if (!channelService) {
      logger.error(`Channel not found: ${channel}`);
      return false;
    }

    return await channelService.sendMessage(userId, content, metadata);
  }

  // Métodos específicos para WebChat
  async createWebChatSession(userId: string): Promise<string> {
    const webChatService = this.channels.get('webchat') as unknown as IWebChatService;
    if (!webChatService) {
      throw new Error('WebChat service not available');
    }
    return await webChatService.createSession(userId);
  }

  async getWebChatHistory(sessionId: string): Promise<Message[]> {
    const webChatService = this.channels.get('webchat') as unknown as IWebChatService;
    if (!webChatService) {
      throw new Error('WebChat service not available');
    }
    return await webChatService.getSessionHistory(sessionId);
  }

  async clearWebChatSession(sessionId: string): Promise<void> {
    const webChatService = this.channels.get('webchat') as unknown as IWebChatService;
    if (!webChatService) {
      throw new Error('WebChat service not available');
    }
    await webChatService.clearSession(sessionId);
  }

  // Método para receber mensagem do WebChat
  async receiveWebChatMessage(sessionId: string, content: string, userId: string): Promise<Message> {
    const webChatService = this.channels.get('webchat') as unknown as IWebChatService;
    if (!webChatService) {
      throw new Error('WebChat service not available');
    }
    return await webChatService.receiveMessage({ sessionId, content, userId });
  }

  // Método para obter estatísticas
  getStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    this.channels.forEach((channel, channelName) => {
      if (channelName === 'webchat') {
        const webChatService = channel as unknown as IWebChatService;
        stats[channelName] = (webChatService as any).getStats();
      } else {
        stats[channelName] = {
          connected: channel.isConnected ? channel.isConnected() : true,
          serviceName: channel.getServiceName(),
        };
      }
    });

    return stats;
  }

  // Método para parar todos os canais
  async stop(): Promise<void> {
    const stopPromises = Array.from(this.channels.values()).map(async (channel) => {
      if (channel.stop) {
        try {
          await channel.stop();
        } catch (error) {
          logger.error(`Error stopping channel ${channel.getServiceName()}:`, error);
        }
      }
    });

    await Promise.all(stopPromises);
    logger.info('All channels stopped');
  }
} 