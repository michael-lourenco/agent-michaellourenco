import TelegramBot from 'node-telegram-bot-api';
import { v4 as uuidv4 } from 'uuid';
import { Message, User } from '../../types';
import { ITelegramService } from '../interfaces';
import logger from '../../utils/logger';
import { config } from '../../config';

export class RealTelegramService implements ITelegramService {
  private bot: TelegramBot;
  private readonly serviceName = 'Telegram Real';
  private messageHandlers: Array<(message: Message) => void> = [];

  constructor() {
    if (!config.messaging.telegram.token || config.messaging.telegram.token === 'mock_telegram_token') {
      throw new Error('Telegram bot token não configurado. Configure TELEGRAM_BOT_TOKEN no .env');
    }

    this.bot = new TelegramBot(config.messaging.telegram.token, {
      polling: {
        interval: 300,
        autoStart: false,
        params: {
          timeout: 10,
        },
      },
    });

    this.setupEventHandlers();
    this.startPolling();
    logger.info('Real Telegram service initialized');
  }

  private setupEventHandlers(): void {
    // Handler para mensagens de texto
    this.bot.on('message', async (msg) => {
      try {
        if (msg.text) {
          const message = await this.receiveMessage(msg);
          this.notifyMessageHandlers(message);
        }
      } catch (error) {
        logger.error('Error handling Telegram message:', error);
      }
    });

    // Handler para comandos
    this.bot.onText(/\/start/, async (msg) => {
      try {
        const welcomeMessage = '🤖 Olá! Sou o Agente IA da Michael Lourenço. Como posso ajudá-lo hoje?';
        await this.bot.sendMessage(msg.chat.id, welcomeMessage);
        logger.info(`Welcome message sent to chat ${msg.chat.id}`);
      } catch (error) {
        logger.error('Error sending welcome message:', error);
      }
    });

    // Handler para comandos de ajuda
    this.bot.onText(/\/help/, async (msg) => {
      try {
        const helpMessage = `
🤖 **Comandos Disponíveis:**

/start - Iniciar conversa
/help - Mostrar esta ajuda
/produtos - Informações sobre produtos
/precos - Informações sobre preços
/contato - Informações de contato

Você também pode simplesmente digitar suas perguntas e eu responderei!
        `;
        await this.bot.sendMessage(msg.chat.id, helpMessage, { parse_mode: 'Markdown' });
        logger.info(`Help message sent to chat ${msg.chat.id}`);
      } catch (error) {
        logger.error('Error sending help message:', error);
      }
    });

    // Handler para erro
    this.bot.on('error', (error) => {
      logger.error('Telegram bot error:', error);
    });

    // Handler para polling error
    this.bot.on('polling_error', (error) => {
      logger.error('Telegram polling error:', error);
    });
  }

  async sendMessage(userId: string, content: string, metadata?: Record<string, any>): Promise<boolean> {
    try {
      const chatId = metadata?.chatId || userId;
      await this.bot.sendMessage(chatId, content, {
        parse_mode: 'Markdown',
        ...metadata?.options,
      });
      
      logger.info(`Real Telegram message sent to ${chatId}: ${content.substring(0, 50)}...`);
      return true;
    } catch (error) {
      logger.error('Error sending Telegram message:', error);
      return false;
    }
  }

  async receiveMessage(msg: any): Promise<Message> {
    const telegramMessage: Message = {
      id: uuidv4(),
      userId: msg.from?.id?.toString() || 'unknown_user',
      channel: 'telegram',
      content: msg.text || 'Mensagem sem texto',
      timestamp: new Date(msg.date * 1000), // Telegram usa timestamp em segundos
      direction: 'inbound',
      metadata: {
        telegramMessageId: msg.message_id,
        chatId: msg.chat.id,
        from: msg.from,
        chat: msg.chat,
        date: msg.date,
      },
    };

    logger.info(`Real Telegram message received from ${telegramMessage.userId}: ${telegramMessage.content.substring(0, 50)}...`);
    return telegramMessage;
  }

  async setWebhook(url: string): Promise<boolean> {
    try {
      await this.bot.setWebhook(url);
      logger.info(`Telegram webhook set to: ${url}`);
      return true;
    } catch (error) {
      logger.error('Error setting Telegram webhook:', error);
      return false;
    }
  }

  async processUpdate(update: any): Promise<Message> {
    if (update.message) {
      return this.receiveMessage(update.message);
    }
    throw new Error('Invalid update payload - no message found');
  }

  getServiceName(): string {
    return this.serviceName;
  }

  // Método para registrar handlers de mensagens
  onMessage(handler: (message: Message) => void): void {
    this.messageHandlers.push(handler);
  }

  // Método para notificar todos os handlers registrados
  private notifyMessageHandlers(message: Message): void {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        logger.error('Error in message handler:', error);
      }
    });
  }

  // Método para obter informações do bot
  async getBotInfo(): Promise<any> {
    try {
      const me = await this.bot.getMe();
      logger.info(`Bot info: ${me.username} (${me.first_name})`);
      return me;
    } catch (error) {
      logger.error('Error getting bot info:', error);
      throw error;
    }
  }

  // Método para iniciar o polling com tratamento de erro
  private async startPolling(): Promise<void> {
    try {
      // Primeiro, tenta parar qualquer polling existente
      try {
        this.bot.stopPolling();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
      } catch (error) {
        // Ignora erros ao parar polling
      }

      // Inicia o polling
      await this.bot.startPolling();
      logger.info('Telegram bot polling started successfully');
    } catch (error) {
      logger.error('Error starting Telegram bot polling:', error);
      
      // Se for erro de conflito, aguarda e tenta novamente
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ETELEGRAM') {
        logger.info('Telegram conflict detected, waiting 5 seconds before retry...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        try {
          await this.bot.startPolling();
          logger.info('Telegram bot polling started on retry');
        } catch (retryError) {
          logger.error('Failed to start polling on retry:', retryError);
          throw retryError;
        }
      } else {
        throw error;
      }
    }
  }

  // Método para parar o polling
  async stop(): Promise<void> {
    try {
      this.bot.stopPolling();
      logger.info('Telegram bot polling stopped');
    } catch (error) {
      logger.error('Error stopping Telegram bot:', error);
    }
  }
} 