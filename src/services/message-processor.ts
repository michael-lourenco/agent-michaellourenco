import { Message, User, AIResponse } from '../types';
import { ITelegramService } from '../integrations/interfaces';
import AIFactory from '../ai/factory';
import { TelegramServiceSingleton } from '../integrations/telegram/singleton';
import logger from '../utils/logger';

export class MessageProcessor {
  private telegramService: ITelegramService;
  private aiFactory: AIFactory;

  constructor() {
    this.telegramService = TelegramServiceSingleton.getInstance();
    this.aiFactory = AIFactory.getInstance();
    this.setupMessageHandlers();
  }

  private setupMessageHandlers(): void {
    // Registrar handler para mensagens do Telegram
    if (this.telegramService && 'onMessage' in this.telegramService) {
      this.telegramService.onMessage(async (message: Message) => {
        await this.processIncomingMessage(message);
      });
    }
  }

  private async processIncomingMessage(message: Message): Promise<void> {
    try {
      logger.info(`Processing incoming message from ${message.userId}: ${message.content}`);

      // Criar usuário mock ou buscar do banco de dados
      const user: User = {
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

      // Processar mensagem com IA
      const aiResponse = await this.aiFactory.getAIEngine().processMessage(message.content, user);

      // Enviar resposta de volta para o Telegram
      const chatId = message.metadata?.chatId || message.userId;
      logger.info(`Sending response to chat ${chatId}, content length: ${aiResponse.content.length}`);
      
      try {
        await this.telegramService.sendMessage(chatId, aiResponse.content, {
          chatId: chatId,
          options: {
            parse_mode: 'Markdown',
          },
        });

        logger.info(`✅ Response sent successfully to ${chatId}: ${aiResponse.content.substring(0, 50)}...`);
      } catch (sendError) {
        logger.error(`❌ Error sending message to ${chatId}:`, sendError);
        throw sendError;
      }

    } catch (error) {
      logger.error('Error processing incoming message:', error);
      
      // Enviar mensagem de erro amigável
      const chatId = message.metadata?.chatId || message.userId;
      await this.telegramService.sendMessage(chatId, 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.');
    }
  }

  // Método público para processar mensagens manualmente
  async processMessage(message: Message): Promise<AIResponse> {
    const user: User = {
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

    return await this.aiFactory.getAIEngine().processMessage(message.content, user);
  }

  // Método para enviar mensagem para o Telegram
  async sendTelegramMessage(chatId: string, content: string): Promise<boolean> {
    return await this.telegramService.sendMessage(chatId, content, {
      chatId: chatId,
      options: {
        parse_mode: 'Markdown',
      },
    });
  }

  // Método para obter informações do serviço Telegram
  getTelegramServiceName(): string {
    return this.telegramService.getServiceName();
  }

  // Método para parar o serviço
  async stop(): Promise<void> {
    if (this.telegramService && 'stop' in this.telegramService) {
      await this.telegramService.stop();
    }
  }
} 