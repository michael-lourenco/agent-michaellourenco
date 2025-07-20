import dotenv from 'dotenv';
import { DatabaseConfig, AIConfig, MessagingConfig } from '../types';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    url: process.env.DATABASE_URL || 'mock://localhost:5432/agent_db',
    type: 'mock' as const,
  } as DatabaseConfig,
  ai: {
    provider: 'mock' as const,
    apiKey: process.env.OPENAI_API_KEY || 'mock_openai_key',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
  } as AIConfig,
  messaging: {
    whatsapp: {
      token: process.env.WHATSAPP_TOKEN || 'mock_whatsapp_token',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || 'mock_phone_number_id',
    },
    telegram: {
      token: process.env.TELEGRAM_BOT_TOKEN || 'mock_telegram_token',
    },
  } as MessagingConfig,
  security: {
    jwtSecret: process.env.JWT_SECRET || 'mock_jwt_secret',
    encryptionKey: process.env.ENCRYPTION_KEY || 'mock_encryption_key',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
}; 