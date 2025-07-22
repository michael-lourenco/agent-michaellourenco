import { IAIEngine } from './interfaces';
import { User, AIResponse } from '../types';
import logger from '../utils/logger';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'google/flan-t5-small';
const BASE_URL = 'https://api-inference.huggingface.co/models/';

// Base de conhecimento estruturada
const KNOWLEDGE_BASE = [
  {
    id: 1,
    question: "Quem é Michael Lourenço?",
    answer: "Michael Lourenço é um desenvolvedor de soluções com mais de 5 anos de experiência, especializado em desenvolvimento backend, arquitetura de sistemas e tecnologias modernas como Node.js, Python, AWS e GCP.",
    keywords: ["michael", "lourenço", "desenvolvedor", "experiência", "backend", "node.js", "python", "aws", "gcp"]
  },
  {
    id: 2,
    question: "Qual é o resumo profissional do Michael Lourenço?",
    answer: "Michael é Backend Senior, com experiência em desenvolvimento de software, APIs, microsserviços, arquitetura de sistemas distribuídos e implementação de soluções em nuvem, sempre focando em performance, escalabilidade e valor ao negócio.",
    keywords: ["backend", "senior", "apis", "microsserviços", "arquitetura", "cloud", "performance", "escalabilidade"]
  },
  {
    id: 3,
    question: "Quais são as principais competências do Michael Lourenço?",
    answer: "As principais competências incluem desenvolvimento de APIs e microsserviços, arquitetura de sistemas distribuídos, implementação de soluções cloud e otimização de performance e escalabilidade.",
    keywords: ["competências", "apis", "microsserviços", "arquitetura", "cloud", "performance", "escalabilidade"]
  },
  {
    id: 4,
    question: "Em quais áreas o Michael atua?",
    answer: "Michael atua em desenvolvimento backend e APIs, arquitetura e design de sistemas, implementação de infraestrutura cloud e mentoria e liderança técnica.",
    keywords: ["áreas", "backend", "apis", "arquitetura", "cloud", "mentoria", "liderança"]
  },
  {
    id: 5,
    question: "Onde o Michael Lourenço trabalhou recentemente?",
    answer: "Ele trabalhou na Pixter como Desenvolvedor Backend Pleno, atuando em projetos de alta escala, arquiteturas serverless e microsserviços, além de migração de sistemas para cloud e desenvolvimento de interfaces mobile.",
    keywords: ["pixter", "backend", "pleno", "projetos", "serverless", "microsserviços", "cloud", "mobile"]
  },
  {
    id: 6,
    question: "Quais tecnologias o Michael utiliza?",
    answer: "Michael utiliza Node.js, Python, AWS, GCP, React, Next.js, Unity, Vuforia, PHP, MySQL, JSON, JavaScript, HTML, CSS, entre outras tecnologias.",
    keywords: ["tecnologias", "node.js", "python", "aws", "gcp", "react", "next.js", "unity", "vuforia", "php", "mysql", "javascript", "html", "css"]
  },
  {
    id: 7,
    question: "Quais são as formações acadêmicas do Michael Lourenço?",
    answer: "Michael possui graduação em Informática para a Gestão de Negócios (Fatec Itapetininga), especialização em Tecnologias para Aplicações Web (Unopar) e especialização em Informática Aplicada à Educação (IFSP Itapetininga).",
    keywords: ["formação", "acadêmica", "graduação", "especialização", "fatec", "unopar", "ifsp", "informática", "gestão", "web", "educação"]
  },
  {
    id: 8,
    question: "Quais idiomas o Michael Lourenço fala?",
    answer: "Michael fala português (nativo) e inglês (intermediário avançado, leitura técnica, conversação e escrita de documentação).",
    keywords: ["idiomas", "português", "inglês", "nativo", "intermediário", "avançado", "técnico"]
  },
  {
    id: 9,
    question: "Quais projetos de destaque estão no portfólio do Michael Lourenço?",
    answer: "Os projetos de destaque incluem ContiGO (jogo de lógica e cálculo), Realidade Aumentada para eventos (11 apps para a Click-Se), HoloSapiens AR (aplicativo de RA para educação científica) e Grancardápio (guia de cardápios, app fullstack para Android e iOS).",
    keywords: ["projetos", "portfólio", "contigo", "realidade aumentada", "holosapiens", "grancardápio", "apps", "android", "ios"]
  },
  {
    id: 10,
    question: "Como entrar em contato com Michael Lourenço?",
    answer: "Para entrar em contato com Michael: Email: kontempler@gmail.com, WhatsApp: +55 15 92000-6629, GitHub: https://github.com/michael-lourenco, LinkedIn: https://www.linkedin.com/in/michael-lourenco/",
    keywords: ["contato", "email", "whatsapp", "github", "linkedin", "kontempler"]
  }
];

const QA_MODEL = 'google/flan-t5-small';

export class HuggingFaceEngine implements IAIEngine {
  private apiKey: string;
  private model: string;

  constructor() {
    if (!HUGGINGFACE_API_KEY) {
      throw new Error('HUGGINGFACE_API_KEY não configurada no .env');
    }
    this.apiKey = HUGGINGFACE_API_KEY;
    // Força o modelo de QA
    this.model = QA_MODEL;
    logger.info(`HuggingFace QA Engine inicializado com modelo: ${this.model}`);
  }

  async processMessage(message: string, user: User): Promise<AIResponse> {
    logger.info(`HuggingFace processando mensagem: "${message}" para usuário: ${user.id}`);
    try {
      // Busca semântica na base de conhecimento
      const relevantInfo = this.findRelevantInformation(message);
      
      if (relevantInfo.length === 0) {
        return {
          content: 'Desculpe, não tenho informações sobre esse assunto. Posso responder sobre a experiência profissional, tecnologias, projetos, formação acadêmica e contatos do Michael Lourenço.',
          confidence: 0.3,
          intent: 'no_info',
          entities: {},
          suggestedActions: ['ask_about_professional_info', 'ask_about_technologies', 'ask_about_projects'],
        };
      }

      // Se encontrou informações relevantes, retorna a resposta mais relevante
      const bestMatch = relevantInfo[0];
      let content = bestMatch.answer;
      
      // Se há múltiplas informações relevantes, combina elas
      if (relevantInfo.length > 1) {
        const additionalInfo = relevantInfo.slice(1).map(info => info.answer).join(' ');
        content = `${bestMatch.answer} ${additionalInfo}`;
      }
      
      logger.info(`HuggingFace resposta: ${content.substring(0, 100)}...`);
      return {
        content,
        confidence: 0.9,
        intent: 'information_request',
        entities: {},
        suggestedActions: ['ask_follow_up', 'request_more_info'],
      };
    } catch (error) {
      logger.error('Erro ao processar mensagem:', error);
      return {
        content: 'Desculpe, não consegui gerar uma resposta no momento.',
        confidence: 0.5,
        intent: 'error',
        entities: {},
        suggestedActions: ['contact_support'],
      };
    }
  }

  private findRelevantInformation(query: string): Array<{question: string, answer: string, score: number}> {
    const queryLower = query.toLowerCase();
    const results: Array<{question: string, answer: string, score: number}> = [];
    
    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      
      // Busca por palavras-chave
      for (const keyword of item.keywords) {
        if (queryLower.includes(keyword.toLowerCase())) {
          score += 2;
        }
      }
      
      // Busca por termos na pergunta
      if (item.question.toLowerCase().includes(queryLower) || queryLower.includes(item.question.toLowerCase())) {
        score += 3;
      }
      
      // Busca por termos na resposta
      if (item.answer.toLowerCase().includes(queryLower)) {
        score += 1;
      }
      
      if (score > 0) {
        results.push({
          question: item.question,
          answer: item.answer,
          score
        });
      }
    }
    
    // Ordena por relevância e retorna os top 3
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  async analyzeSentiment(text: string): Promise<number> {
    // Hugging Face não implementa análise de sentimento real aqui, retorna neutro
    return 0;
  }
  async extractIntent(text: string): Promise<string> {
    // Hugging Face não implementa extração real de intenção aqui, retorna default
    return 'default';
  }
  async extractEntities(text: string): Promise<Record<string, any>> {
    // Hugging Face não implementa extração real de entidades aqui, retorna vazio
    return {};
  }
}

export default HuggingFaceEngine; 