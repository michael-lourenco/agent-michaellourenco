// Carregar variáveis de ambiente ANTES de qualquer import
import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import routes from './api/routes';
import logger from './utils/logger';
import MockDatabase from './database/mock';
import { MultiChannelProcessor } from './services/multi-channel-processor';

class Application {
  private app: express.Application;
  private database: MockDatabase;
  private messageProcessor: MultiChannelProcessor;

  constructor() {
    this.app = express();
    this.database = new MockDatabase();
    this.messageProcessor = new MultiChannelProcessor();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Segurança
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
    }));
    
    // CORS
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://michaellourenco.com'] 
        : ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    }));

    // Parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Static files
    this.app.use(express.static('public'));

    // Logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Rotas da API
    this.app.use('/api', routes);

    // Rota raiz
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        message: '🤖 Agente IA Michael Lourenço - Versão Mockada',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/api/health',
          messaging: '/api/messaging',
          ai: '/api/ai',
          web: '/api/web',
        },
      });
    });

    // Rota do chat web
    this.app.get('/chat', (req: Request, res: Response) => {
      res.sendFile('chat.html', { root: 'public' });
    });

    // Rota de playground
    this.app.get('/playground', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>🤖 Agente IA Michael Lourenço - Playground</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 15px;
              padding: 30px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            h1 {
              color: #333;
              text-align: center;
              margin-bottom: 30px;
            }
            .chat-container {
              border: 2px solid #e0e0e0;
              border-radius: 10px;
              height: 400px;
              overflow-y: auto;
              padding: 20px;
              margin-bottom: 20px;
              background: #f9f9f9;
            }
            .message {
              margin-bottom: 15px;
              padding: 10px 15px;
              border-radius: 10px;
              max-width: 80%;
            }
            .user-message {
              background: #007bff;
              color: white;
              margin-left: auto;
            }
            .bot-message {
              background: #e9ecef;
              color: #333;
            }
            .input-container {
              display: flex;
              gap: 10px;
            }
            input[type="text"] {
              flex: 1;
              padding: 12px;
              border: 2px solid #ddd;
              border-radius: 8px;
              font-size: 16px;
            }
            button {
              padding: 12px 24px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
              transition: background 0.3s;
            }
            button:hover {
              background: #0056b3;
            }
            .examples {
              margin-top: 20px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .examples h3 {
              margin-top: 0;
              color: #333;
            }
            .example-btn {
              background: #28a745;
              margin: 5px;
              padding: 8px 16px;
              font-size: 14px;
            }
            .example-btn:hover {
              background: #218838;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🤖 Agente IA Michael Lourenço</h1>
            <div class="chat-container" id="chatContainer">
              <div class="message bot-message">
                Olá! Sou o agente IA da Michael Lourenço. Como posso ajudá-lo hoje?
              </div>
            </div>
            <div class="input-container">
              <input type="text" id="messageInput" placeholder="Digite sua mensagem..." onkeypress="handleKeyPress(event)">
              <button onclick="sendMessage()">Enviar</button>
            </div>
            <div class="examples">
              <h3>Exemplos de perguntas:</h3>
              <button class="example-btn" onclick="sendExample('Olá, como vocês podem me ajudar?')">Saudação</button>
              <button class="example-btn" onclick="sendExample('Quais produtos vocês oferecem?')">Produtos</button>
              <button class="example-btn" onclick="sendExample('Qual é o preço dos seus serviços?')">Preços</button>
              <button class="example-btn" onclick="sendExample('Como posso entrar em contato?')">Contato</button>
            </div>
            
            <div class="telegram-info" style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #2196f3;">
              <h3 style="margin-top: 0; color: #1976d2;">🤖 Telegram Bot</h3>
              <p style="margin: 10px 0; color: #333;">
                <strong>Status:</strong> <span id="telegramStatus">Verificando...</span><br>
                <strong>Serviço:</strong> <span id="telegramService">-</span>
              </p>
              <div id="telegramInstructions" style="display: none;">
                <p style="margin: 10px 0; color: #2e7d32;">
                  ✅ <strong>Bot ativo!</strong> Envie mensagens diretamente para o bot no Telegram.<br>
                  <small>Configure o token no arquivo .env para usar o bot real.</small>
                </p>
              </div>
              <div id="telegramMockInfo" style="display: none;">
                <p style="margin: 10px 0; color: #f57c00;">
                  🔧 <strong>Modo Mock:</strong> Usando simulação do Telegram.<br>
                  <small>Configure TELEGRAM_BOT_TOKEN no .env para usar o bot real.</small>
                </p>
              </div>
            </div>
          </div>

          <script>
            const chatContainer = document.getElementById('chatContainer');
            const messageInput = document.getElementById('messageInput');
            const userId = 'playground_user_' + Date.now();

            function addMessage(content, isUser = false) {
              const messageDiv = document.createElement('div');
              messageDiv.className = \`message \${isUser ? 'user-message' : 'bot-message'}\`;
              messageDiv.textContent = content;
              chatContainer.appendChild(messageDiv);
              chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            async function sendMessage() {
              const message = messageInput.value.trim();
              if (!message) return;

              addMessage(message, true);
              messageInput.value = '';

              try {
                const response = await fetch('/api/ai/process', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    message: message,
                    userId: userId
                  })
                });

                const data = await response.json();
                addMessage(data.content);
              } catch (error) {
                addMessage('Desculpe, ocorreu um erro ao processar sua mensagem.');
                console.error('Error:', error);
              }
            }

            function sendExample(text) {
              messageInput.value = text;
              sendMessage();
            }

            function handleKeyPress(event) {
              if (event.key === 'Enter') {
                sendMessage();
              }
            }

            // Verificar status do Telegram
            async function checkTelegramStatus() {
              try {
                const response = await fetch('/api/telegram/status');
                const data = await response.json();
                
                document.getElementById('telegramStatus').textContent = data.status;
                document.getElementById('telegramService').textContent = data.service;
                
                if (data.service.includes('Real')) {
                  document.getElementById('telegramInstructions').style.display = 'block';
                  document.getElementById('telegramMockInfo').style.display = 'none';
                } else {
                  document.getElementById('telegramInstructions').style.display = 'none';
                  document.getElementById('telegramMockInfo').style.display = 'block';
                }
              } catch (error) {
                document.getElementById('telegramStatus').textContent = 'Erro ao verificar';
                document.getElementById('telegramService').textContent = 'Desconhecido';
              }
            }

            // Verificar status ao carregar a página
            checkTelegramStatus();
          </script>
        </body>
        </html>
      `);
    });

    // Handler de erros
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', err);
      res.status(500).json({ error: 'Internal server error' });
    });

    // 404
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  async start(): Promise<void> {
    try {
      // Conectar ao banco de dados
      await this.database.connect();
      logger.info('Database connected successfully');

      // Iniciar servidor
      this.app.listen(config.server.port, () => {
        logger.info(`🚀 Server running on port ${config.server.port}`);
        logger.info(`📱 Playground available at http://localhost:${config.server.port}/playground`);
        logger.info(`🔗 API available at http://localhost:${config.server.port}/api`);
        logger.info(`💚 Health check at http://localhost:${config.server.port}/api/health`);
      });
    } catch (error) {
      logger.error('Failed to start application:', error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    try {
      await this.messageProcessor.stop();
      await this.database.disconnect();
      logger.info('Application stopped gracefully');
    } catch (error) {
      logger.error('Error stopping application:', error);
    }
  }
}

// Iniciar aplicação
const app = new Application();

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await app.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  await app.stop();
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
}); 