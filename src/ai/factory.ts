import { IAIEngine, IKnowledgeBase, ILangChainService } from './interfaces';
import { MockAIEngine, MockKnowledgeBase, MockLangChainService } from './mock';
import { OpenAIEngine, OpenAIKnowledgeBase, OpenAILangChainService } from './openai';
import { OllamaEngine, OllamaKnowledgeBase, OllamaLangChainService } from './ollama';
import { HuggingFaceEngine } from './huggingface';
import logger from '../utils/logger';

export class AIFactory {
  private static instance: AIFactory;
  private aiEngine: IAIEngine | null = null;
  private knowledgeBase: IKnowledgeBase | null = null;
  private langChainService: ILangChainService | null = null;

  private constructor() {}

  static getInstance(): AIFactory {
    if (!AIFactory.instance) {
      AIFactory.instance = new AIFactory();
    }
    return AIFactory.instance;
  }

  getAIEngine(): IAIEngine {
    if (!this.aiEngine) {
      this.aiEngine = this.createAIEngine();
    }
    return this.aiEngine;
  }

  getKnowledgeBase(): IKnowledgeBase {
    if (!this.knowledgeBase) {
      this.knowledgeBase = this.createKnowledgeBase();
    }
    return this.knowledgeBase;
  }

  getLangChainService(): ILangChainService {
    if (!this.langChainService) {
      this.langChainService = this.createLangChainService();
    }
    return this.langChainService;
  }

  private createAIEngine(): IAIEngine {
    // Hugging Face
    if (process.env.HUGGINGFACE_API_KEY) {
      try {
        logger.info('🔗 Inicializando HuggingFace Engine...');
        return new HuggingFaceEngine();
      } catch (err) {
        logger.error('Erro ao inicializar HuggingFace Engine:', err);
      }
    }
    // OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'mock_openai_key') {
      try {
        logger.info('🔗 Inicializando OpenAI Engine...');
        return new OpenAIEngine();
      } catch (err) {
        logger.error('Erro ao inicializar OpenAI Engine:', err);
      }
    }
    // Ollama
    if (process.env.OLLAMA_BASE_URL && process.env.OLLAMA_MODEL) {
      try {
        logger.info('🔗 Inicializando Ollama Engine...');
        return new OllamaEngine();
      } catch (err) {
        logger.error('Erro ao inicializar Ollama Engine:', err);
      }
    }
    // Mock
    logger.info('🔗 Inicializando MockAI Engine...');
    return new MockAIEngine();
  }

  private createKnowledgeBase(): IKnowledgeBase {
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (openaiKey && openaiKey !== 'mock_openai_key') {
      try {
        logger.info('🔧 Inicializando OpenAI Knowledge Base...');
        const kb = new OpenAIKnowledgeBase();
        logger.info('✅ OpenAI Knowledge Base inicializado com sucesso');
        return kb;
      } catch (error) {
        logger.error('❌ Erro ao inicializar OpenAI Knowledge Base, usando Mock:', error);
        return new MockKnowledgeBase();
      }
    } else {
      logger.info('🤖 Usando Mock Knowledge Base (OPENAI_API_KEY não configurado)');
      return new MockKnowledgeBase();
    }
  }

  private createLangChainService(): ILangChainService {
    const openaiKey = process.env.OPENAI_API_KEY;
    
    if (openaiKey && openaiKey !== 'mock_openai_key') {
      try {
        logger.info('🔧 Inicializando OpenAI LangChain Service...');
        const service = new OpenAILangChainService();
        logger.info('✅ OpenAI LangChain Service inicializado com sucesso');
        return service;
      } catch (error) {
        logger.error('❌ Erro ao inicializar OpenAI LangChain Service, usando Mock:', error);
        return new MockLangChainService();
      }
    } else {
      logger.info('🤖 Usando Mock LangChain Service (OPENAI_API_KEY não configurado)');
      return new MockLangChainService();
    }
  }

  // Método para resetar as instâncias (útil para testes)
  reset(): void {
    this.aiEngine = null;
    this.knowledgeBase = null;
    this.langChainService = null;
    logger.info('🔄 AI Factory resetada');
  }

  // Método para verificar qual engine está sendo usado
  getCurrentEngineInfo(): { type: string; status: string } {
    const engine = this.getAIEngine();
    const isOpenAI = engine.constructor.name === 'OpenAIEngine';
    
    return {
      type: isOpenAI ? 'OpenAI' : 'Mock',
      status: isOpenAI ? 'Real AI' : 'Mock AI'
    };
  }
}

export default AIFactory; 