import { Router, Request, Response } from 'express';
import { MultiChannelProcessor } from '../../services/multi-channel-processor';
import logger from '../../utils/logger';

const router = Router();
const processor = new MultiChannelProcessor();

// Criar nova sessão de chat
router.post('/session', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId é obrigatório'
      });
    }

    const sessionId = await processor.createWebChatSession(userId);
    
    logger.info(`WebChat session created: ${sessionId} for user: ${userId}`);
    
    return res.json({
      success: true,
      sessionId,
      message: 'Sessão criada com sucesso'
    });
  } catch (error) {
    logger.error('Error creating web chat session:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao criar sessão'
    });
  }
});

// Enviar mensagem
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { sessionId, content, userId } = req.body;
    
    console.log('Recebida requisição de mensagem:', { sessionId, content: content?.substring(0, 50), userId });
    
    if (!sessionId || !content || !userId) {
      console.log('Campos obrigatórios faltando:', { sessionId: !!sessionId, content: !!content, userId: !!userId });
      return res.status(400).json({
        success: false,
        error: 'sessionId, content e userId são obrigatórios'
      });
    }

    // Receber mensagem do usuário
    const userMessage = await processor.receiveWebChatMessage(sessionId, content, userId);
    
    // Processar com IA
    const aiResponse = await processor.processMessage(userMessage);
    
    logger.info(`WebChat message processed: ${content.substring(0, 50)}...`);
    
    return res.json({
      success: true,
      userMessage: {
        id: userMessage.id,
        content: userMessage.content,
        timestamp: userMessage.timestamp,
        direction: userMessage.direction
      },
      aiResponse: {
        content: aiResponse.content,
        confidence: aiResponse.confidence,
        intent: aiResponse.intent,
        suggestedActions: aiResponse.suggestedActions
      }
    });
  } catch (error) {
    logger.error('Error processing web chat message:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao processar mensagem'
    });
  }
});

// Obter histórico da sessão
router.get('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId é obrigatório'
      });
    }

    const history = await processor.getWebChatHistory(sessionId);
    
    return res.json({
      success: true,
      history: history.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp,
        direction: msg.direction
      }))
    });
  } catch (error) {
    logger.error('Error getting web chat history:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter histórico'
    });
  }
});

// Limpar histórico da sessão
router.delete('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId é obrigatório'
      });
    }

    await processor.clearWebChatSession(sessionId);
    
    logger.info(`WebChat history cleared for session: ${sessionId}`);
    
    return res.json({
      success: true,
      message: 'Histórico limpo com sucesso'
    });
  } catch (error) {
    logger.error('Error clearing web chat history:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao limpar histórico'
    });
  }
});

// Obter estatísticas
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = processor.getStats();
    
    return res.json({
      success: true,
      stats
    });
  } catch (error) {
    logger.error('Error getting stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter estatísticas'
    });
  }
});

// Validar sessão
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId é obrigatório'
      });
    }

    const webChatService = (processor as any).channels.get('webchat');
    if (!webChatService) {
      return res.status(500).json({
        success: false,
        error: 'Serviço WebChat não disponível'
      });
    }

    const user = await webChatService.validateSession(sessionId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Sessão não encontrada'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name
      }
    });
  } catch (error) {
    logger.error('Error validating session:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao validar sessão'
    });
  }
});

export default router; 