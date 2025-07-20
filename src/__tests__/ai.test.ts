import { MockAIEngine } from '../ai/mock';
import { User } from '../types';

describe('MockAIEngine', () => {
  let aiEngine: MockAIEngine;
  let mockUser: User;

  beforeEach(() => {
    aiEngine = new MockAIEngine();
    mockUser = {
      id: 'test_user_1',
      name: 'Test User',
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
  });

  describe('processMessage', () => {
    it('should process greeting messages correctly', async () => {
      const response = await aiEngine.processMessage('Olá!', mockUser);
      
      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.confidence).toBeGreaterThan(0.7);
      expect(response.intent).toBe('greeting');
      expect(response.entities).toBeDefined();
    });

    it('should process product info messages correctly', async () => {
      const response = await aiEngine.processMessage('Quais produtos vocês têm?', mockUser);
      
      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.intent).toBe('product_info');
    });

    it('should process pricing messages correctly', async () => {
      const response = await aiEngine.processMessage('Qual é o preço?', mockUser);
      
      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.intent).toBe('pricing');
    });

    it('should process contact messages correctly', async () => {
      const response = await aiEngine.processMessage('Como posso entrar em contato?', mockUser);
      
      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.intent).toBe('contact');
    });
  });

  describe('analyzeSentiment', () => {
    it('should return positive sentiment for positive words', async () => {
      const sentiment = await aiEngine.analyzeSentiment('Gostei muito do produto, é excelente!');
      expect(sentiment).toBeGreaterThan(0);
    });

    it('should return negative sentiment for negative words', async () => {
      const sentiment = await aiEngine.analyzeSentiment('Não gostei, é muito caro e ruim');
      expect(sentiment).toBeLessThan(0);
    });

    it('should return neutral sentiment for neutral text', async () => {
      const sentiment = await aiEngine.analyzeSentiment('Informação sobre o produto');
      expect(sentiment).toBe(0);
    });
  });

  describe('extractIntent', () => {
    it('should extract greeting intent', async () => {
      const intent = await aiEngine.extractIntent('Olá, bom dia!');
      expect(intent).toBe('greeting');
    });

    it('should extract product_info intent', async () => {
      const intent = await aiEngine.extractIntent('O que vocês fazem?');
      expect(intent).toBe('product_info');
    });

    it('should extract pricing intent', async () => {
      const intent = await aiEngine.extractIntent('Quanto custa?');
      expect(intent).toBe('pricing');
    });

    it('should extract contact intent', async () => {
      const intent = await aiEngine.extractIntent('Qual o telefone?');
      expect(intent).toBe('contact');
    });

    it('should return default intent for unknown text', async () => {
      const intent = await aiEngine.extractIntent('Texto aleatório sem contexto');
      expect(intent).toBe('default');
    });
  });

  describe('extractEntities', () => {
    it('should extract phone numbers', async () => {
      const entities = await aiEngine.extractEntities('Meu telefone é (11) 99999-9999');
      expect(entities.phone).toBeDefined();
    });

    it('should extract email addresses', async () => {
      const entities = await aiEngine.extractEntities('Meu email é teste@exemplo.com');
      expect(entities.email).toBeDefined();
    });

    it('should extract money values', async () => {
      const entities = await aiEngine.extractEntities('O preço é R$ 100,00');
      expect(entities.money).toBeDefined();
    });
  });
}); 