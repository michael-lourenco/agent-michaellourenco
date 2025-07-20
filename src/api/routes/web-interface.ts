import { Router, Request, Response } from 'express';
import { MockWebInterfaceService } from '../../integrations/mock';

const router = Router();
const webService = new MockWebInterfaceService();

// Criar sessão
router.post('/session', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId field' });
    }

    const sessionId = await webService.createSession(userId);
    res.json({ sessionId, userId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Validar sessão
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const user = await webService.validateSession(sessionId);
    if (!user) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ user, sessionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate session' });
  }
});

// Enviar mensagem via web
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { userId, content, sessionId } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const success = await webService.sendMessage(userId, content, { sessionId });
    res.json({ success, messageId: `web_msg_${Date.now()}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Receber mensagem via web
router.post('/receive', async (req: Request, res: Response) => {
  try {
    const message = await webService.receiveMessage(req.body);
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to receive message' });
  }
});

export default router; 