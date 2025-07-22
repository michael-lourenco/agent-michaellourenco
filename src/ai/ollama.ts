import { AIResponse, Message, User } from '../types';
import { IAIEngine, IKnowledgeBase, ILangChainService } from './interfaces';
import logger from '../utils/logger';

// Tipos para a API do Ollama
interface OllamaResponse {
  response?: string;
  done?: boolean;
  model?: string;
  created_at?: string;
  done_reason?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

// Configuração do Ollama
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

// Sistema de prompt para o agente
const SYSTEM_PROMPT = `Você é um assistente virtual especializado da Michael Lourenço, uma empresa de tecnologia e consultoria.

SEU PAPEL:
- Responder perguntas sobre produtos e serviços da empresa
- Fornecer informações sobre preços e condições
- Conectar clientes com o time comercial quando necessário
- Manter um tom profissional mas amigável
- Ser útil e prestativo

INFORMAÇÕES DA EMPRESA:
- Nome: Michael Lourenço
- Área: Tecnologia e Consultoria
- Contato: (11) 99999-9999 / contato@michaellourenco.com
- Horário: Segunda a sexta, 8h às 18h

DIRETRIZES:
- Sempre seja cordial e profissional
- Se não souber algo específico, sugira falar com o time comercial
- Mantenha respostas concisas mas informativas
- Use linguagem clara e acessível
- Seja proativo em oferecer ajuda adicional

Lembre-se: Você é o primeiro contato do cliente com a empresa, então seja sempre útil e profissional.`;

class OllamaEngine implements IAIEngine {
  private readonly model: string;
  private readonly baseUrl: string;

  constructor() {
    this.model = OLLAMA_MODEL;
    this.baseUrl = OLLAMA_BASE_URL;
  }

  async processMessage(message: string, user: User, context?: Message[]): Promise<AIResponse> {
    logger.info(`Ollama processing message: "${message}" from user: ${user.id}`);
    
    try {
      // Construir contexto da conversa
      const conversationHistory = this.buildConversationHistory(context);
      
      // Criar prompt completo
      const fullPrompt = this.buildFullPrompt(message, conversationHistory);

      // Chamar API do Ollama
      const response = await this.callOllamaAPI(fullPrompt);
      
      // Extrair informações adicionais
      const intent = await this.extractIntent(message);
      const sentiment = await this.analyzeSentiment(message);
      const entities = await this.extractEntities(message);
      
      logger.info(`Ollama response generated for user ${user.id}: ${response.substring(0, 100)}...`);
      
      return {
        content: response,
        confidence: 0.8, // Boa confiança para Ollama
        intent,
        entities,
        suggestedActions: this.getSuggestedActions(intent),
      };
      
    } catch (error) {
      logger.error('Error calling Ollama API:', error);
      
      // Fallback para resposta padrão
      return {
        content: 'Desculpe, estou enfrentando dificuldades técnicas no momento. Pode tentar novamente em alguns instantes ou entrar em contato diretamente pelo telefone (11) 99999-9999.',
        confidence: 0.5,
        intent: 'error',
        entities: {},
        suggestedActions: ['contact_support'],
      };
    }
  }

  async analyzeSentiment(text: string): Promise<number> {
    try {
      const prompt = `Analise o sentimento do texto e retorne apenas um número entre -1 (muito negativo) e 1 (muito positivo).

Texto: "${text}"

Resposta (apenas o número):`;

      const response = await this.callOllamaAPI(prompt);
      const sentiment = parseFloat(response.trim());
      
      return Math.max(-1, Math.min(1, sentiment)) || 0;
    } catch (error) {
      logger.error('Error analyzing sentiment:', error);
      return 0; // Neutro em caso de erro
    }
  }

  async extractIntent(text: string): Promise<string> {
    try {
      const prompt = `Analise a intenção do usuário e retorne apenas uma das seguintes opções: greeting, product_info, pricing, contact, support, complaint, feedback, default

Texto: "${text}"

Resposta (apenas a intenção):`;

      const response = await this.callOllamaAPI(prompt);
      const intent = response.toLowerCase().trim();
      
      // Validar se é uma intenção válida
      const validIntents = ['greeting', 'product_info', 'pricing', 'contact', 'support', 'complaint', 'feedback', 'default'];
      return validIntents.includes(intent) ? intent : 'default';
    } catch (error) {
      logger.error('Error extracting intent:', error);
      return 'default';
    }
  }

  async extractEntities(text: string): Promise<Record<string, any>> {
    try {
      const prompt = `Extraia entidades do texto e retorne apenas um JSON com as entidades encontradas. Exemplo: {"phone": "11999999999", "email": "user@example.com", "product": "software"}

Texto: "${text}"

Resposta (apenas o JSON):`;

      const response = await this.callOllamaAPI(prompt);
      
      // Tentar extrair JSON da resposta
      const jsonMatch = response.match(/\{.*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          return {};
        }
      }
      
      return {};
    } catch (error) {
      logger.error('Error extracting entities:', error);
      return {};
    }
  }

  private async callOllamaAPI(prompt: string): Promise<string> {
    logger.info(`Calling Ollama API with model: ${this.model}, prompt length: ${prompt.length}`);
    
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 500,
          },
        }),
      });

      logger.info(`Ollama API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`Ollama API error: ${response.status} ${response.statusText} - ${errorText}`);
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as OllamaResponse;
      logger.info(`Ollama API response received, response length: ${data.response?.length || 0}`);
      
      return data.response || 'Não foi possível gerar uma resposta.';
    } catch (error) {
      logger.error('Error calling Ollama API:', error);
      throw error;
    }
  }

  private buildConversationHistory(context?: Message[]): Array<{ role: 'user' | 'assistant'; content: string }> {
    if (!context || context.length === 0) {
      return [];
    }

    const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    
    // Pegar as últimas 10 mensagens para não exceder limites
    const recentMessages = context.slice(-10);
    
    for (const message of recentMessages) {
      if (message.direction === 'inbound') {
        history.push({ role: 'user', content: message.content });
      } else {
        history.push({ role: 'assistant', content: message.content });
      }
    }
    
    return history;
  }

  private buildFullPrompt(message: string, history: Array<{ role: 'user' | 'assistant'; content: string }>): string {
    let prompt = `${SYSTEM_PROMPT}\n\n`;
    
    // Adicionar histórico da conversa
    for (const msg of history) {
      prompt += `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}\n`;
    }
    
    // Adicionar mensagem atual
    prompt += `Usuário: ${message}\nAssistente:`;
    
    return prompt;
  }

  private getSuggestedActions(intent: string): string[] {
    const actions: Record<string, string[]> = {
      greeting: ['ask_about_products', 'ask_about_services', 'provide_contact'],
      product_info: ['provide_pricing', 'schedule_consultation', 'send_catalog'],
      pricing: ['schedule_consultation', 'provide_quote', 'discuss_options'],
      contact: ['provide_phone', 'provide_email', 'schedule_call'],
      support: ['escalate_to_support', 'provide_contact', 'create_ticket'],
      complaint: ['apologize', 'escalate_to_support', 'provide_contact'],
      feedback: ['thank_user', 'escalate_to_management', 'request_details'],
      default: ['ask_clarification', 'provide_contact', 'suggest_alternatives'],
    };
    
    return actions[intent] || actions.default;
  }
}

class OllamaKnowledgeBase implements IKnowledgeBase {
  private documents: Map<string, { content: string; metadata?: Record<string, any> }> = new Map();

  async search(query: string, limit: number = 5): Promise<Array<{ content: string; score: number }>> {
    const results: Array<{ content: string; score: number }> = [];
    
    for (const [id, doc] of this.documents) {
      const score = this.calculateRelevance(query, doc.content);
      if (score > 0.3) { // Threshold mínimo
        results.push({ content: doc.content, score });
      }
    }
    
    // Ordenar por relevância e limitar resultados
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async addDocument(content: string, metadata?: Record<string, any>): Promise<void> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.documents.set(id, { content, metadata });
    logger.info(`Document added to Ollama knowledge base: ${id}`);
  }

  async updateDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    if (this.documents.has(id)) {
      this.documents.set(id, { content, metadata });
      logger.info(`Document updated in Ollama knowledge base: ${id}`);
    } else {
      throw new Error(`Document not found: ${id}`);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    if (this.documents.has(id)) {
      this.documents.delete(id);
      logger.info(`Document deleted from Ollama knowledge base: ${id}`);
    } else {
      throw new Error(`Document not found: ${id}`);
    }
  }

  private calculateRelevance(query: string, content: string): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentWords = content.toLowerCase().split(/\s+/);
    
    let matches = 0;
    for (const word of queryWords) {
      if (contentWords.includes(word)) {
        matches++;
      }
    }
    
    return matches / queryWords.length;
  }
}

class OllamaLangChainService implements ILangChainService {
  private readonly baseUrl: string;
  private readonly model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'llama2';
  }

  async generateResponse(prompt: string, context?: string): Promise<string> {
    try {
      const fullPrompt = context 
        ? `Contexto: ${context}\n\nPergunta: ${prompt}`
        : prompt;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: fullPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 300,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json() as OllamaResponse;
      return data.response || 'Não foi possível gerar uma resposta.';
    } catch (error) {
      logger.error('Error generating response:', error);
      return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
  }

  async summarizeText(text: string): Promise<string> {
    try {
      const prompt = `Resuma o seguinte texto de forma concisa e clara:

${text}

Resumo:`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3,
            max_tokens: 200,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json() as OllamaResponse;
      return data.response || 'Não foi possível resumir o texto.';
    } catch (error) {
      logger.error('Error summarizing text:', error);
      return 'Erro ao resumir o texto.';
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const prompt = `Traduza o seguinte texto para ${targetLanguage}. Mantenha o tom e estilo original:

${text}

Tradução:`;

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.3,
            max_tokens: 500,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json() as OllamaResponse;
      return data.response || 'Não foi possível traduzir o texto.';
    } catch (error) {
      logger.error('Error translating text:', error);
      return 'Erro ao traduzir o texto.';
    }
  }
}

export { OllamaEngine, OllamaKnowledgeBase, OllamaLangChainService }; 