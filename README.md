Abaixo temos a estrutura final esperada, porém, agora vamos apenas implementar a versão mockada da parte mais inicial deste projeto, sendo que eles devem passar nos testes unitários:
Mock do Telegram bot
Mock do  Web interface
Mock do  Api gateway
Mock do  Langchain + Open Api
Mock do  Base a decidr

Todas as criações devem ser criadas com interfaces que possam ser substituidas futuramente pelas implementações reais.
desta forma poderemos escalar a aplicação com segurança e mais facilidade
Utilize Clean Code e Solid.
Implemente a versão mais simples possivel com estas utilidades.

Retorne uma versão onde eu de yarn run dev e possa experimentar via playground.
Esta aplicação será vendida futuramente para outras empresas, precisando apenas trocar a base de dados

Não precisa adicionar docker e estruturas que nao funcionem mockadas no momento

# 🤖 Agente IA Michael Lourenço

Agente de Inteligência Artificial personalizado para atendimento automatizado nos canais WhatsApp e Telegram da empresa Michael Lourenço.

## 🎯 Objetivos

- Atendimento automatizado 24/7
- Resposta inteligente a dúvidas sobre produtos/serviços
- Integração com WhatsApp Business e Telegram
- Base de conhecimento personalizada e atualizável
- Análise de sentimento e personalização por usuário

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WhatsApp API  │    │  Telegram Bot   │    │   Web Interface │
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
                    │    Core AI Engine         │
                    │  (LangChain + OpenAI)     │
                    └─────────────┬─────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼─────────┐  ┌─────────▼─────────┐  ┌─────────▼─────────┐
│   PostgreSQL      │  │   Pinecone        │  │     Redis         │
│  (Dados Usuários) │  │ (Base Vetorial)   │  │    (Cache)        │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

## 🚀 Funcionalidades

### Core Features
- ✅ Integração com WhatsApp Business API
- ✅ Integração com Telegram Bot API
- ✅ Processamento de linguagem natural
- ✅ Base de conhecimento vetorial
- ✅ Sistema de autenticação e autorização
- ✅ Logs e monitoramento
- ✅ Sistema de feedback e aprendizado

### Features Avançadas
- 🎯 Personalização por perfil de usuário
- 📊 Análise de sentimento em tempo real
- 🔄 Escalação automática para atendente humano
- 📈 Dashboard de métricas e insights
- 🔄 Atualização automática da base de conhecimento
- 🌐 Suporte multi-idioma

## 📋 Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- PostgreSQL 14+
- Redis 6+
- Conta OpenAI API
- Conta Pinecone
- WhatsApp Business API
- Telegram Bot Token

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd agent-michaellourenco
```

### 2. Instale as dependências
```bash
yarn install
# ou
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Execute o projeto
```bash
yarn dev
```

### 5. Acesse as interfaces
- **Chat Web**: http://localhost:3000/chat
- **Playground**: http://localhost:3000
- **API WebChat**: http://localhost:3000/api/webchat

## 💬 Chat Web

O projeto agora inclui um chat web completo que permite conversar com o agente de IA diretamente no navegador:

### **Funcionalidades:**
- ✅ Interface moderna e responsiva
- ✅ Sessões de chat persistentes
- ✅ Histórico de conversas
- ✅ Indicador de digitação
- ✅ Tratamento de erros
- ✅ Design mobile-friendly

### **Como usar o Chat Web:**
1. Acesse http://localhost:3000/chat
2. Uma sessão será criada automaticamente
3. Digite suas perguntas sobre Michael Lourenço
4. O agente responderá com base na base de conhecimento

### **API Endpoints:**
- `POST /api/webchat/session` - Criar nova sessão
- `POST /api/webchat/message` - Enviar mensagem
- `GET /api/webchat/history/:sessionId` - Obter histórico
- `DELETE /api/webchat/history/:sessionId` - Limpar histórico
- `GET /api/webchat/stats` - Estatísticas
- `POST /api/webchat/validate` - Validar sessão

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### 4. Execute o projeto
```bash
# Desenvolvimento
yarn dev
# ou
npm run dev

# Produção
yarn build
yarn start
```

## 📁 Estrutura do Projeto

```
agent-michaellourenco/
├── src/
│   ├── api/
│   │   └── routes/           # Rotas da API
│   ├── ai/                   # Engine de IA
│   ├── integrations/         # Integrações externas
│   ├── utils/                # Utilitários
│   ├── config/               # Configurações
│   └── types/                # Tipos TypeScript
├── docs/                     # Documentação
├── scripts/                  # Scripts de automação
└── docker/                   # Configurações Docker
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agent_db
REDIS_URL=redis://localhost:6379

# AI Services
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENVIRONMENT=your_environment

# Messaging APIs
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
TELEGRAM_BOT_TOKEN=your_telegram_token

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

## 📊 Monitoramento

- **Logs**: Winston + ELK Stack
- **Métricas**: Prometheus + Grafana
- **Health Checks**: Endpoint `/health`
- **Alertas**: Discord/Slack webhooks

## 🔒 Segurança

- Autenticação JWT
- Rate limiting
- Validação de entrada
- Criptografia de dados sensíveis
- Logs de auditoria
- Conformidade com LGPD

## 📈 Roadmap

### Fase 1 - MVP (2-3 semanas)
- [x] Estrutura básica do projeto
- [ ] Integração com WhatsApp
- [ ] Integração com Telegram
- [ ] Base de conhecimento básica
- [ ] Respostas simples

### Fase 2 - IA Avançada (3-4 semanas)
- [ ] LangChain + OpenAI
- [ ] Base vetorial Pinecone
- [ ] Análise de sentimento
- [ ] Personalização

### Fase 3 - Escalabilidade (2-3 semanas)
- [ ] Dashboard admin
- [ ] Métricas avançadas
- [ ] Escalação automática
- [ ] Multi-idioma

### Fase 4 - Otimização (1-2 semanas)
- [ ] Performance tuning
- [ ] Testes automatizados
- [ ] Documentação completa
- [ ] Deploy em produção

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: suporte@michaellourenco.com
- WhatsApp: +55 (11) 99999-9999
- Telegram: @michaellourenco_support

---

**Desenvolvido com ❤️ pela equipe Michael Lourenço** 

## IA Gratuita com Hugging Face

1. Crie uma conta gratuita em https://huggingface.co/
2. Vá em Settings > Access Tokens > New Token (role: read)
3. Copie o token e adicione no seu `.env`:

```
HUGGINGFACE_API_KEY=seu_token_aqui
HUGGINGFACE_MODEL=google/flan-t5-small
```

4. Rode o projeto normalmente (`yarn dev`).
5. O bot usará o Hugging Face como IA padrão se o token estiver configurado. 