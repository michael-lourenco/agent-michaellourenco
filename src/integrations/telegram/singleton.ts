import { ITelegramService } from '../interfaces';
import { TelegramServiceFactory } from './factory';
import logger from '../../utils/logger';

export class TelegramServiceSingleton {
  private static instance: ITelegramService | null = null;
  private static isInitializing = false;

  static getInstance(): ITelegramService {
    if (!TelegramServiceSingleton.instance) {
      if (TelegramServiceSingleton.isInitializing) {
        logger.warn('Telegram service is already being initialized, waiting...');
        // Aguarda um pouco e tenta novamente
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(TelegramServiceSingleton.getInstance());
          }, 1000);
        }) as any;
      }

      TelegramServiceSingleton.isInitializing = true;
      
      try {
        TelegramServiceSingleton.instance = TelegramServiceFactory.create();
        logger.info('Telegram service singleton created');
      } catch (error) {
        logger.error('Error creating Telegram service singleton:', error);
        TelegramServiceSingleton.instance = TelegramServiceFactory.createWithMode('mock');
        logger.info('Falling back to mock Telegram service');
      } finally {
        TelegramServiceSingleton.isInitializing = false;
      }
    }

    return TelegramServiceSingleton.instance;
  }

  static reset(): void {
    if (TelegramServiceSingleton.instance) {
      try {
        if ('stop' in TelegramServiceSingleton.instance) {
          if (TelegramServiceSingleton.instance.stop) {
            TelegramServiceSingleton.instance.stop();
          }
        }
      } catch (error) {
        logger.error('Error stopping Telegram service:', error);
      }
    }
    
    TelegramServiceSingleton.instance = null;
    TelegramServiceSingleton.isInitializing = false;
    logger.info('Telegram service singleton reset');
  }

  static isInitialized(): boolean {
    return TelegramServiceSingleton.instance !== null;
  }
} 