# 🤖 Agente IA Michael Lourenço - Versão Mockada

Esta é a versão mockada do Agente IA Michael Lourenço, implementada com interfaces que podem ser facilmente substituídas pelas implementações reais no futuro.

## 🎯 Objetivos da Versão Mockada

- ✅ Demonstrar a arquitetura completa do sistema
- ✅ Permitir testes e desenvolvimento sem dependências externas
- ✅ Validar o design das interfaces
- ✅ Fornecer um playground funcional para experimentação
- ✅ Facilitar a transição para implementações reais

## 🏗️ Arquitetura Mockada

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mock WhatsApp │    │  Mock Telegram  │    │   Mock Web UI   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     API Gateway           │
                    │   (Express + TypeScript)  │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Mock AI Engine         │
                    │  (LangChain + OpenAI)     │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │   Mock Database           │
                    │  (In-Memory Storage)      │
                    └───────────────────────────┘
```

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
yarn install
# ou
npm install
```

### 2. Executar em Desenvolvimento
```bash
yarn dev
# ou
npm run dev
```

### 3. Acessar o Playground
Abra seu navegador e acesse: http://localhost:3000/playground

## 📱 Funcionalidades Disponíveis

### Playground Interativo
- Interface web para testar o agente IA
- Exemplos de perguntas pré-definidas
- Chat em tempo real com respostas mockadas
- Status do bot Telegram em tempo real

### Bot Telegram Real
- Integração completa com Telegram Bot API
- Respostas automáticas com IA
- Comandos `/start` e `/help`
- Modo mock para desenvolvimento
- Status visível no playground

### API Endpoints

#### Health Check
- `GET /api/health` - Status geral da aplicação
- `GET /api/health/ready` - Verificação de prontidão
- `GET /api/health/live` - Verificação de vida

#### IA Engine
- `POST /api/ai/process` - Processar mensagem
- `POST /api/ai/sentiment` - Análise de sentimento
- `POST /api/ai/intent` - Extração de intenção
- `POST /api/ai/knowledge/search` - Buscar na base de conhecimento
- `POST /api/ai/knowledge/add` - Adicionar documento
- `POST /api/ai/langchain/generate` - Gerar resposta com LangChain

#### Mensagens
- `POST /api/messaging/send` - Enviar mensagem
- `POST /api/messaging/whatsapp/webhook` - Webhook WhatsApp
- `GET /api/messaging/whatsapp/webhook` - Verificação WhatsApp
- `POST /api/messaging/telegram/webhook` - Webhook Telegram

#### Interface Web
- `POST /api/web/session` - Criar sessão
- `GET /api/web/session/:sessionId` - Validar sessão
- `POST /api/web/message` - Enviar mensagem via web
- `POST /api/web/receive` - Receber mensagem via web

#### Telegram
- `GET /api/telegram/status` - Verificar status do bot
- `POST /api/telegram/send` - Enviar mensagem para o Telegram
- `POST /api/telegram/process` - Processar mensagem do Telegram

## 🧪 Testes

### Executar Todos os Testes
```bash
yarn test
# ou
npm test
```

### Executar Testes em Modo Watch
```bash
yarn test:watch
# ou
npm run test:watch
```

### Cobertura de Testes
```bash
yarn test --coverage
```

## 📊 Exemplos de Uso

### 1. Testar o Playground
1. Acesse http://localhost:3000/playground
2. Digite uma mensagem ou use os botões de exemplo
3. Veja as respostas do agente IA

### 2. Testar a API
```bash
# Processar mensagem
curl -X POST http://localhost:3000/api/ai/process \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá, como vocês podem me ajudar?", "userId": "test_user"}'

# Análise de sentimento
curl -X POST http://localhost:3000/api/ai/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "Gostei muito do produto!"}'

# Buscar na base de conhecimento
curl -X POST http://localhost:3000/api/ai/knowledge/search \
  -H "Content-Type: application/json" \
  -d '{"query": "produtos", "limit": 5}'
```

### 3. Testar Webhooks
```bash
# Webhook WhatsApp
curl -X POST http://localhost:3000/api/messaging/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "id": "test_id",
            "from": "test_user",
            "text": {"body": "Olá!"}
          }]
        }
      }]
    }]
  }'

# Webhook Telegram
curl -X POST http://localhost:3000/api/messaging/telegram/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "message_id": 123,
      "from": {"id": 456},
      "text": "Olá!"
    }
  }'
```

### 4. Testar Telegram
```bash
# Verificar informações do bot
yarn telegram:info

# Verificar status do bot
curl -X GET http://localhost:3000/api/telegram/status

# Enviar mensagem para o Telegram
curl -X POST http://localhost:3000/api/telegram/send \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "123456789",
    "content": "Olá! Esta é uma mensagem de teste."
  }'

# Resetar serviço (se houver conflitos)
yarn telegram:reset
```

## 🔧 Configuração

### Variáveis de Ambiente
Copie o arquivo `env.example` para `.env` e configure conforme necessário:

```env
# Server
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
```

### Estrutura de Dados Mockados

#### Usuário Mock
```json
{
  "id": "mock_user_id",
  "name": "João Silva",
  "phone": "+5511999999999",
  "preferences": {
    "language": "pt-BR",
    "timezone": "America/Sao_Paulo",
    "notificationSettings": {
      "email": true,
      "push": true,
      "sms": false
    }
  }
}
```

#### Respostas IA Mockadas
- **Saudação**: Respostas de boas-vindas
- **Produtos**: Informações sobre produtos/serviços
- **Preços**: Informações sobre preços e condições
- **Contato**: Informações de contato
- **Padrão**: Respostas genéricas para perguntas não reconhecidas

## 🔄 Transição para Implementações Reais

### 1. Banco de Dados
- Substituir `MockDatabase` por implementação PostgreSQL
- Manter as mesmas interfaces `IUserRepository`, `IMessageRepository`, `IConversationRepository`

### 2. IA Engine
- Substituir `MockAIEngine` por implementação com OpenAI
- Substituir `MockKnowledgeBase` por Pinecone
- Substituir `MockLangChainService` por LangChain real

### 3. Integrações
- Substituir `MockWhatsAppService` por WhatsApp Business API
- ✅ **Telegram já implementado** - Configure `TELEGRAM_BOT_TOKEN` no .env
- Manter `MockWebInterfaceService` ou implementar interface real

### 4. Configuração
- Atualizar variáveis de ambiente com credenciais reais
- Configurar webhooks para produção
- Implementar autenticação e autorização

## 📈 Próximos Passos

1. **Implementar Banco Real**: PostgreSQL com Prisma/TypeORM
2. **Integrar OpenAI**: Configurar API key e modelos
3. **Configurar Pinecone**: Base de conhecimento vetorial
4. **Implementar WhatsApp**: WhatsApp Business API
5. ✅ **Telegram Implementado**: Configure o token no .env
6. **Adicionar Autenticação**: JWT + middleware de segurança
7. **Implementar Cache**: Redis para performance
8. **Adicionar Monitoramento**: Logs estruturados + métricas

## 🐛 Troubleshooting

### Erro de Porta em Uso
```bash
# Verificar processos na porta 3000
lsof -i :3000
# Matar processo se necessário
kill -9 <PID>
```

### Erro de Dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
yarn install
```

### Erro de TypeScript
```bash
# Verificar tipos
yarn tsc --noEmit
```

## 📞 Suporte

Para dúvidas sobre a versão mockada:
- Verificar logs no console
- Consultar testes unitários
- Revisar interfaces TypeScript
- Testar endpoints individualmente

---

**Desenvolvido com ❤️ pela equipe Michael Lourenço** 