import { Router, Request, Response } from 'express';
import { MockWhatsAppService, MockTelegramService } from '../../integrations/mock';

const router = Router();
const whatsappService = new MockWhatsAppService();
const telegramService = new MockTelegramService();

// Enviar mensagem WhatsApp
router.post('/whatsapp/send', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const success = await whatsappService.sendMessage(phoneNumber, message);
    return res.json({ success, phoneNumber, message });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
});

// Enviar mensagem Telegram
router.post('/telegram/send', async (req: Request, res: Response) => {
  try {
    const { chatId, message } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const success = await telegramService.sendMessage(chatId, message);
    return res.json({ success, chatId, message });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send Telegram message' });
  }
});

// Enviar mensagem genérica
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { channel, userId, message } = req.body;

    if (!channel || !userId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let success = false;
    if (channel === 'whatsapp') {
      success = await whatsappService.sendMessage(userId, message);
    } else if (channel === 'telegram') {
      success = await telegramService.sendMessage(userId, message);
    } else {
      return res.status(400).json({ error: 'Invalid channel' });
    }

    return res.json({ success, channel, userId, message });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router; 