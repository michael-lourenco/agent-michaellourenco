import { AIResponse, Message, User } from '../types';
import { IAIEngine, IKnowledgeBase, ILangChainService } from './interfaces';
import logger from '../utils/logger';

class MockAIEngine implements IAIEngine {
  private readonly responses = {
    greeting: [
      'Olá! Como posso ajudá-lo hoje?',
      'Oi! Seja bem-vindo à Michael Lourenço. Em que posso ser útil?',
      'Olá! Estou aqui para ajudá-lo com suas dúvidas sobre nossos produtos e serviços.',
    ],
    product_info: [
      'Temos uma ampla variedade de produtos de alta qualidade. Pode me dizer qual área específica te interessa?',
      'Nossos produtos são conhecidos pela excelência e durabilidade. Qual categoria você gostaria de conhecer?',
      'Oferecemos soluções personalizadas para diferentes necessidades. Que tipo de produto você está procurando?',
    ],
    pricing: [
      'Nossos preços variam conforme o produto e quantidade. Posso te ajudar a encontrar a melhor opção para seu orçamento.',
      'Temos diferentes faixas de preço para atender diversos perfis. Qual é o seu orçamento aproximado?',
      'Oferecemos condições especiais para compras em quantidade. Gostaria de saber mais sobre nossos preços?',
    ],
    contact: [
      'Para falar com nosso time comercial, você pode ligar para (11) 99999-9999 ou enviar um email para contato@michaellourenco.com',
      'Nossa equipe está disponível de segunda a sexta, das 8h às 18h. Como prefere entrar em contato?',
      'Posso te conectar com um de nossos especialistas. Qual é a melhor forma de contato para você?',
    ],
    default: [
      'Desculpe, não entendi completamente sua pergunta. Pode reformular ou me dar mais detalhes?',
      'Vou te ajudar a encontrar a informação que precisa. Pode ser mais específico?',
      'Não tenho certeza sobre o que você está perguntando. Pode explicar melhor?',
    ],
  };

  async processMessage(message: string, user: User, context?: Message[]): Promise<AIResponse> {
    logger.info(`Processing message: "${message}" from user: ${user.id}`);
    
    const intent = await this.extractIntent(message);
    const sentiment = await this.analyzeSentiment(message);
    const entities = await this.extractEntities(message);
    
    const responses = this.responses[intent as keyof typeof this.responses] || this.responses.default;
    const content = responses[Math.floor(Math.random() * responses.length)];
    
    const confidence = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
    
    return {
      content,
      confidence,
      intent,
      entities,
      suggestedActions: this.getSuggestedActions(intent),
    };
  }

  async analyzeSentiment(text: string): Promise<number> {
    const positiveWords = ['bom', 'ótimo', 'excelente', 'gosto', 'legal', 'interessante', 'obrigado'];
    const negativeWords = ['ruim', 'péssimo', 'não gosto', 'problema', 'difícil', 'caro'];
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (lowerText.includes(word)) score += 0.2;
    });
    
    negativeWords.forEach(word => {
      if (lowerText.includes(word)) score -= 0.2;
    });
    
    return Math.max(-1, Math.min(1, score));
  }

  async extractIntent(text: string): Promise<string> {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('olá') || lowerText.includes('oi') || lowerText.includes('bom dia') || lowerText.includes('boa tarde')) {
      return 'greeting';
    }
    
    if (lowerText.includes('produto') || lowerText.includes('serviço') || lowerText.includes('o que vocês fazem')) {
      return 'product_info';
    }
    
    if (lowerText.includes('preço') || lowerText.includes('valor') || lowerText.includes('quanto custa')) {
      return 'pricing';
    }
    
    if (lowerText.includes('contato') || lowerText.includes('telefone') || lowerText.includes('email') || lowerText.includes('falar')) {
      return 'contact';
    }
    
    return 'default';
  }

  async extractEntities(text: string): Promise<Record<string, any>> {
    const entities: Record<string, any> = {};
    
    // Extrair números de telefone
    const phoneMatch = text.match(/(\+55\s?)?\(?(\d{2})\)?\s?(\d{4,5})-?(\d{4})/);
    if (phoneMatch) {
      entities.phone = phoneMatch[0];
    }
    
    // Extrair emails
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      entities.email = emailMatch[0];
    }
    
    // Extrair valores monetários
    const moneyMatch = text.match(/R?\$?\s*(\d+[.,]\d{2}|\d+)/);
    if (moneyMatch) {
      entities.money = moneyMatch[0];
    }
    
    return entities;
  }

  private getSuggestedActions(intent: string): string[] {
    switch (intent) {
      case 'greeting':
        return ['Ver produtos', 'Falar com atendente', 'Ver preços'];
      case 'product_info':
        return ['Ver catálogo', 'Solicitar orçamento', 'Agendar demonstração'];
      case 'pricing':
        return ['Ver tabela de preços', 'Solicitar orçamento personalizado', 'Falar com comercial'];
      case 'contact':
        return ['Ligar agora', 'Enviar email', 'Agendar reunião'];
      default:
        return ['Ver produtos', 'Falar com atendente', 'Ver preços'];
    }
  }
}

class MockKnowledgeBase implements IKnowledgeBase {
  private documents: Map<string, { content: string; metadata?: Record<string, any> }> = new Map();

  async search(query: string, limit: number = 5): Promise<Array<{ content: string; score: number }>> {
    const results: Array<{ content: string; score: number }> = [];
    
    for (const [id, doc] of this.documents) {
      const score = this.calculateRelevance(query, doc.content);
      if (score > 0.1) {
        results.push({ content: doc.content, score });
      }
    }
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async addDocument(content: string, metadata?: Record<string, any>): Promise<void> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.documents.set(id, { content, metadata });
    logger.info(`Mock document added: ${id}`);
  }

  async updateDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    if (this.documents.has(id)) {
      this.documents.set(id, { content, metadata });
      logger.info(`Mock document updated: ${id}`);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    const deleted = this.documents.delete(id);
    if (deleted) {
      logger.info(`Mock document deleted: ${id}`);
    }
  }

  private calculateRelevance(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);
    
    let matches = 0;
    queryWords.forEach(word => {
      if (contentWords.includes(word)) {
        matches++;
      }
    });
    
    return matches / queryWords.length;
  }
}

class MockLangChainService implements ILangChainService {
  async generateResponse(prompt: string, context?: string): Promise<string> {
    logger.info(`Mock LangChain generating response for prompt: ${prompt.substring(0, 50)}...`);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const responses = [
      'Com base nas informações disponíveis, posso te ajudar com isso.',
      'Entendo sua pergunta. Deixe-me fornecer uma resposta adequada.',
      'Vou analisar o contexto e te dar a melhor resposta possível.',
      'Com base no que você perguntou, aqui está minha resposta.',
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async summarizeText(text: string): Promise<string> {
    logger.info(`Mock LangChain summarizing text: ${text.substring(0, 50)}...`);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return `Resumo: ${text.substring(0, Math.min(100, text.length))}...`;
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    logger.info(`Mock LangChain translating to ${targetLanguage}: ${text.substring(0, 50)}...`);
    
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return `[${targetLanguage.toUpperCase()}] ${text}`;
  }
}

export { MockAIEngine, MockKnowledgeBase, MockLangChainService }; 