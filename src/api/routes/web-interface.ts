import { Router, Request, Response } from 'express';

const router = Router();

// Criar sessão
router.post('/session', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const sessionId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return res.json({
      success: true,
      sessionId,
      userId
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create session' });
  }
});

// Validar sessão
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    // Mock validation
    const isValid = sessionId.startsWith('web_');
    
    return res.json({
      success: true,
      valid: isValid,
      sessionId
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to validate session' });
  }
});

// Enviar mensagem
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { sessionId, content } = req.body;
    
    if (!sessionId || !content) {
      return res.status(400).json({ error: 'sessionId and content are required' });
    }

    // Mock response
    const response = {
      id: `msg_${Date.now()}`,
      content: `Mock response to: ${content}`,
      timestamp: new Date(),
      sessionId
    };
    
    return res.json({
      success: true,
      response
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router; 