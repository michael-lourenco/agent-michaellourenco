import { Router, Request, Response } from 'express';
import { MessageProcessor } from '../../services/message-processor';
import { TelegramServiceSingleton } from '../../integrations/telegram/singleton';

const router = Router();
let messageProcessor: MessageProcessor | null = null;

// Função para obter ou criar o MessageProcessor
function getMessageProcessor(): MessageProcessor {
  if (!messageProcessor) {
    messageProcessor = new MessageProcessor();
  }
  return messageProcessor;
}

// Verificar status do Telegram
router.get('/status', (req: Request, res: Response) => {
  try {
    const processor = getMessageProcessor();
    const serviceName = processor.getTelegramServiceName();
    const status = serviceName.includes('Real') ? 'Ativo' : 'Mock';
    
    res.json({
      status,
      service: serviceName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'Erro',
      service: 'Desconhecido',
      error: 'Erro ao verificar status do Telegram',
    });
  }
});

// Enviar mensagem para o Telegram
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ error: 'Missing chatId or content' });
    }

    const processor = getMessageProcessor();
    const success = await processor.sendTelegramMessage(chatId, content);
    
    res.json({
      success,
      messageId: `telegram_${Date.now()}`,
      chatId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send Telegram message' });
  }
});

// Processar mensagem do Telegram
router.post('/process', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing message' });
    }

    const processor = getMessageProcessor();
    const response = await processor.processMessage(message);
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Resetar o serviço Telegram (útil para resolver conflitos)
router.post('/reset', (req: Request, res: Response) => {
  try {
    TelegramServiceSingleton.reset();
    messageProcessor = null; // Reset do MessageProcessor também
    
    res.json({
      success: true,
      message: 'Telegram service reset successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset Telegram service' });
  }
});

export default router; 