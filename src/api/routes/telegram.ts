import { Router, Request, Response } from 'express';
import { MessageProcessor } from '../../services/message-processor';

const router = Router();
const messageProcessor = new MessageProcessor();

// Status do bot
router.get('/status', (req: Request, res: Response) => {
  try {
    const serviceName = messageProcessor.getTelegramServiceName();
    return res.json({
      status: 'running',
      service: serviceName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to get status' });
  }
});

// Enviar mensagem
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const success = await messageProcessor.sendTelegramMessage(chatId, message);
    return res.json({ success, chatId, message });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

// Processar mensagem
router.post('/process', async (req: Request, res: Response) => {
  try {
    const { content, userId, metadata } = req.body;

    if (!content || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = {
      id: `msg_${Date.now()}`,
      userId,
      channel: 'telegram' as const,
      content,
      timestamp: new Date(),
      direction: 'inbound' as const,
      metadata
    };

    const response = await messageProcessor.processMessage(message);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process message' });
  }
});

// Reset do singleton
router.post('/reset', (req: Request, res: Response) => {
  try {
    // Importar dinamicamente para evitar dependência circular
    const { TelegramServiceSingleton } = require('../../integrations/telegram/singleton');
    TelegramServiceSingleton.reset();
    return res.json({ success: true, message: 'Telegram service reset' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reset service' });
  }
});

export default router; 