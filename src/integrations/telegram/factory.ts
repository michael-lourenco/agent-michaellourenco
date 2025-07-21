import { ITelegramService } from '../interfaces';
import { MockTelegramService } from '../mock';
import { RealTelegramService } from './real';
import { config } from '../../config';
import logger from '../../utils/logger';

export class TelegramServiceFactory {
  static create(): ITelegramService {
    const token = config.messaging.telegram.token;
    const isMockToken = !token || token === 'mock_telegram_token';
    
    if (isMockToken) {
      logger.info('Using Mock Telegram Service (no real token configured)');
      return new MockTelegramService();
    }
    
    try {
      logger.info('Using Real Telegram Service');
      return new RealTelegramService();
    } catch (error) {
      logger.warn('Failed to create Real Telegram Service, falling back to Mock:', error);
      return new MockTelegramService();
    }
  }

  static createWithMode(mode: 'mock' | 'real'): ITelegramService {
    switch (mode) {
      case 'mock':
        logger.info('Forcing Mock Telegram Service');
        return new MockTelegramService();
      case 'real':
        logger.info('Forcing Real Telegram Service');
        return new RealTelegramService();
      default:
        return this.create();
    }
  }
} 