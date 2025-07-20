import { Router, Request, Response } from 'express';
import { MockWhatsAppService, MockTelegramService } from '../../integrations/mock';

const router = Router();
const whatsappService = new MockWhatsAppService();
const telegramService = new MockTelegramService();

// Webhook WhatsApp
router.post('/whatsapp/webhook', async (req: Request, res: Response) => {
  try {
    const message = await whatsappService.processWebhook(req.body);
    res.json({ success: true, messageId: message.id });
  } catch (error) {
    res.status(400).json({ error: 'Invalid webhook payload' });
  }
});

// Verificação WhatsApp
router.get('/whatsapp/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === 'mock_token') {
    const response = whatsappService.verifyWebhook(token as string, challenge as string);
    res.send(response);
  } else {
    res.status(403).send('Forbidden');
  }
});

// Webhook Telegram
router.post('/telegram/webhook', async (req: Request, res: Response) => {
  try {
    const message = await telegramService.processUpdate(req.body);
    res.json({ success: true, messageId: message.id });
  } catch (error) {
    res.status(400).json({ error: 'Invalid update payload' });
  }
});

// Enviar mensagem
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { userId, content, channel, metadata } = req.body;

    if (!userId || !content || !channel) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let success = false;
    switch (channel) {
      case 'whatsapp':
        success = await whatsappService.sendMessage(userId, content, metadata);
        break;
      case 'telegram':
        success = await telegramService.sendMessage(userId, content, metadata);
        break;
      default:
        return res.status(400).json({ error: 'Invalid channel' });
    }

    res.json({ success, messageId: `msg_${Date.now()}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router; 