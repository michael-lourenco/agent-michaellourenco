import { Router, Request, Response } from 'express';
import { MockAIEngine, MockKnowledgeBase, MockLangChainService } from '../../ai/mock';

const router = Router();
const aiEngine = new MockAIEngine();
const knowledgeBase = new MockKnowledgeBase();
const langChainService = new MockLangChainService();

// Processar mensagem
router.post('/process', async (req: Request, res: Response) => {
  try {
    const { message, userId, context } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Mock user
    const mockUser = {
      id: userId,
      name: 'Usuário Mock',
      preferences: {
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notificationSettings: {
          email: true,
          push: true,
          sms: false,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = await aiEngine.processMessage(message, mockUser, context);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Análise de sentimento
router.post('/sentiment', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing text field' });
    }

    const sentiment = await aiEngine.analyzeSentiment(text);
    res.json({ sentiment, text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Extrair intenção
router.post('/intent', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Missing text field' });
    }

    const intent = await aiEngine.extractIntent(text);
    res.json({ intent, text });
  } catch (error) {
    res.status(500).json({ error: 'Failed to extract intent' });
  }
});

// Buscar na base de conhecimento
router.post('/knowledge/search', async (req: Request, res: Response) => {
  try {
    const { query, limit } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Missing query field' });
    }

    const results = await knowledgeBase.search(query, limit || 5);
    res.json({ results, query });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search knowledge base' });
  }
});

// Adicionar documento à base de conhecimento
router.post('/knowledge/add', async (req: Request, res: Response) => {
  try {
    const { content, metadata } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Missing content field' });
    }

    await knowledgeBase.addDocument(content, metadata);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add document' });
  }
});

// Gerar resposta com LangChain
router.post('/langchain/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt field' });
    }

    const response = await langChainService.generateResponse(prompt, context);
    res.json({ response, prompt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

export default router; 