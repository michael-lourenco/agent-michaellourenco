import OpenAI from 'openai';
import { AIResponse, Message, User } from '../types';
import { IAIEngine, IKnowledgeBase, ILangChainService } from './interfaces';
import logger from '../utils/logger';

// Configuração da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

COMANDOS ESPECIAIS:
- /start - Apresentação inicial
- /help - Lista de comandos disponíveis
- /contato - Informações de contato
- /produtos - Informações sobre produtos
- /precos - Informações sobre preços

Lembre-se: Você é o primeiro contato do cliente com a empresa, então seja sempre útil e profissional.`;

class OpenAIEngine implements IAIEngine {
  private readonly model = 'gpt-3.5-turbo';
  private readonly maxTokens = 500;
  private readonly temperature = 0.7;

  async processMessage(message: string, user: User, context?: Message[]): Promise<AIResponse> {
    logger.info(`OpenAI processing message: "${message}" from user: ${user.id}`);
    
    try {
      // Construir contexto da conversa
      const conversationHistory = this.buildConversationHistory(context);
      
      // Criar prompt com contexto
      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user' as const, content: message }
      ];

      // Chamar API da OpenAI
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      });

      const response = completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.';
      
      // Extrair informações adicionais
      const intent = await this.extractIntent(message);
      const sentiment = await this.analyzeSentiment(message);
      const entities = await this.extractEntities(message);
      
      logger.info(`OpenAI response generated for user ${user.id}: ${response.substring(0, 100)}...`);
      
      return {
        content: response,
        confidence: 0.9, // Alta confiança para respostas da OpenAI
        intent,
        entities,
        suggestedActions: this.getSuggestedActions(intent),
      };
      
    } catch (error: any) {
      logger.error('Error calling OpenAI API:', error);
      
      // Tratamento específico para diferentes tipos de erro
      let errorMessage = 'Desculpe, estou enfrentando dificuldades técnicas no momento.';
      
      if (error?.status === 429) {
        errorMessage = 'Desculpe, atingi meu limite de uso por hoje. Pode tentar novamente amanhã ou entrar em contato diretamente pelo telefone (11) 99999-9999.';
        logger.warn('OpenAI quota exceeded - using fallback response');
      } else if (error?.status === 401) {
        errorMessage = 'Desculpe, há um problema com minha configuração. Entre em contato com o suporte técnico.';
        logger.error('OpenAI authentication error');
      } else if (error?.status === 500) {
        errorMessage = 'Desculpe, o serviço de IA está temporariamente indisponível. Tente novamente em alguns minutos.';
        logger.error('OpenAI server error');
      }
      
      // Fallback para resposta padrão
      return {
        content: errorMessage,
        confidence: 0.5,
        intent: 'error',
        entities: {},
        suggestedActions: ['contact_support'],
      };
    }
  }

  async analyzeSentiment(text: string): Promise<number> {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Analise o sentimento do texto e retorne apenas um número entre -1 (muito negativo) e 1 (muito positivo).'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      const sentiment = parseFloat(response || '0');
      
      return Math.max(-1, Math.min(1, sentiment));
    } catch (error) {
      logger.error('Error analyzing sentiment:', error);
      return 0; // Neutro em caso de erro
    }
  }

  async extractIntent(text: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Analise a intenção do usuário e retorne apenas uma das seguintes opções: greeting, product_info, pricing, contact, support, complaint, feedback, default'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 20,
        temperature: 0.1,
      });

      const intent = completion.choices[0]?.message?.content?.toLowerCase().trim() || 'default';
      return intent;
    } catch (error) {
      logger.error('Error extracting intent:', error);
      return 'default';
    }
  }

  async extractEntities(text: string): Promise<Record<string, any>> {
    try {
      const completion = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'Extraia entidades do texto e retorne apenas um JSON com as entidades encontradas. Exemplo: {"phone": "11999999999", "email": "user@example.com", "product": "software"}'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 100,
        temperature: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      if (response) {
        try {
          return JSON.parse(response);
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

class OpenAIKnowledgeBase implements IKnowledgeBase {
  private documents: Map<string, { content: string; metadata?: Record<string, any> }> = new Map();

  async search(query: string, limit: number = 5): Promise<Array<{ content: string; score: number }>> {
    try {
      // Usar embeddings da OpenAI para busca semântica
      const embedding = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: query,
      });

      const queryEmbedding = embedding.data[0].embedding;
      
      // Calcular similaridade com documentos existentes
      const results: Array<{ content: string; score: number }> = [];
      
      for (const [id, doc] of this.documents) {
        // Aqui você implementaria o cálculo de similaridade com embeddings
        // Por simplicidade, vamos usar busca por palavras-chave
        const score = this.calculateRelevance(query, doc.content);
        if (score > 0.3) { // Threshold mínimo
          results.push({ content: doc.content, score });
        }
      }
      
      // Ordenar por relevância e limitar resultados
      return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
        
    } catch (error) {
      logger.error('Error searching knowledge base:', error);
      return [];
    }
  }

  async addDocument(content: string, metadata?: Record<string, any>): Promise<void> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.documents.set(id, { content, metadata });
    logger.info(`Document added to knowledge base: ${id}`);
  }

  async updateDocument(id: string, content: string, metadata?: Record<string, any>): Promise<void> {
    if (this.documents.has(id)) {
      this.documents.set(id, { content, metadata });
      logger.info(`Document updated in knowledge base: ${id}`);
    } else {
      throw new Error(`Document not found: ${id}`);
    }
  }

  async deleteDocument(id: string): Promise<void> {
    if (this.documents.has(id)) {
      this.documents.delete(id);
      logger.info(`Document deleted from knowledge base: ${id}`);
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

class OpenAILangChainService implements ILangChainService {
  async generateResponse(prompt: string, context?: string): Promise<string> {
    try {
      const fullPrompt = context 
        ? `Contexto: ${context}\n\nPergunta: ${prompt}`
        : prompt;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: fullPrompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || 'Não foi possível gerar uma resposta.';
    } catch (error) {
      logger.error('Error generating response:', error);
      return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
  }

  async summarizeText(text: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Resuma o texto de forma concisa e clara.' },
          { role: 'user', content: text }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      return completion.choices[0]?.message?.content || 'Não foi possível resumir o texto.';
    } catch (error) {
      logger.error('Error summarizing text:', error);
      return 'Erro ao resumir o texto.';
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `Traduza o texto para ${targetLanguage}. Mantenha o tom e estilo original.` },
          { role: 'user', content: text }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return completion.choices[0]?.message?.content || 'Não foi possível traduzir o texto.';
    } catch (error) {
      logger.error('Error translating text:', error);
      return 'Erro ao traduzir o texto.';
    }
  }
}

export { OpenAIEngine, OpenAIKnowledgeBase, OpenAILangChainService }; 