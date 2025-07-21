# 🤖 Configuração do Telegram Bot

Este documento explica como configurar o bot do Telegram para funcionar com o Agente IA Michael Lourenço.

## 🚀 Configuração Rápida

### 1. Criar um Bot no Telegram

1. Abra o Telegram e procure por **@BotFather**
2. Envie `/newbot`
3. Escolha um nome para o bot (ex: "Michael Lourenço IA")
4. Escolha um username (ex: "michaellourenco_ia_bot")
5. **Guarde o token** que o BotFather fornecer

### 2. Configurar o Token

1. Copie o arquivo `env.example` para `.env`
2. Substitua a linha:
   ```env
   TELEGRAM_BOT_TOKEN=mock_telegram_token
   ```
   Por:
   ```env
   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
   (Use o token real fornecido pelo BotFather)

### 3. Executar a Aplicação

```bash
yarn dev
```

### 4. Testar o Bot

1. Procure pelo seu bot no Telegram (usando o username que você escolheu)
2. Envie `/start` para iniciar a conversa
3. Digite qualquer mensagem e veja as respostas do agente IA

## 🔧 Funcionalidades do Bot

### Comandos Disponíveis

- `/start` - Iniciar conversa e receber mensagem de boas-vindas
- `/help` - Mostrar lista de comandos disponíveis

### Respostas Inteligentes

O bot responde automaticamente a:
- **Saudações**: "Olá", "Oi", "Bom dia"
- **Produtos**: Perguntas sobre produtos e serviços
- **Preços**: Informações sobre preços e condições
- **Contato**: Informações de contato da empresa
- **Outras perguntas**: Respostas genéricas baseadas em IA

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Telegram App  │───▶│  Real Telegram  │───▶│  Message        │
│   (Usuário)     │    │     Service     │    │  Processor      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   Mock AI       │
                                              │   Engine        │
                                              └─────────────────┘
```

## 🔄 Modos de Operação

### Modo Real (Com Token)
- Conecta ao Telegram Bot API real
- Recebe mensagens em tempo real
- Envia respostas para usuários reais
- Funciona com qualquer usuário do Telegram
- **Singleton Pattern**: Garante apenas uma instância ativa

### Modo Mock (Sem Token)
- Simula o comportamento do Telegram
- Útil para testes e desenvolvimento
- Não requer configuração externa
- Respostas apenas via API

## 🏗️ Arquitetura Singleton

O sistema usa um **Singleton Pattern** para garantir que apenas uma instância do bot Telegram esteja ativa:

```
┌─────────────────┐
│  Application    │
│     (Main)      │
└─────────┬───────┘
          │
┌─────────▼─────────┐
│  TelegramService  │
│    Singleton      │
└─────────┬─────────┘
          │
┌─────────▼─────────┐
│  Real/Mock        │
│  Telegram Bot     │
└───────────────────┘
```

**Benefícios:**
- ✅ Evita conflitos de polling
- ✅ Gerencia recursos eficientemente
- ✅ Fallback automático para mock
- ✅ Reset via API quando necessário

## 📊 Monitoramento

### Logs
O sistema registra automaticamente:
- Mensagens recebidas
- Respostas enviadas
- Erros de conexão
- Status do bot

### Status no Playground
Acesse http://localhost:3000/playground para ver:
- Status do serviço Telegram (Real/Mock)
- Informações sobre o bot
- Instruções de uso

## 🛠️ API Endpoints

### Verificar Status
```bash
GET /api/telegram/status
```

### Enviar Mensagem
```bash
POST /api/telegram/send
{
  "chatId": "123456789",
  "content": "Olá, como vocês podem me ajudar?"
}
```

### Processar Mensagem
```bash
POST /api/telegram/process
{
  "message": {
    "userId": "123456789",
    "content": "Quais produtos vocês têm?",
    "channel": "telegram"
  }
}
```

## 🔒 Segurança

### Token do Bot
- **NUNCA** compartilhe o token do bot
- **NUNCA** commite o token no Git
- Use sempre variáveis de ambiente
- O token dá acesso total ao bot

### Limitações
- O bot só responde a mensagens de texto
- Não processa arquivos, imagens ou áudio
- Rate limiting do Telegram: 30 mensagens por segundo

## 🐛 Troubleshooting

### Bot não responde
1. Verifique se o token está correto
2. Confirme se o bot está ativo no BotFather
3. Verifique os logs da aplicação
4. Teste com `/start` primeiro

### Erro de conexão
1. Verifique sua conexão com a internet
2. Confirme se o token é válido
3. Verifique se não há firewall bloqueando

### Mensagens não chegam
1. Verifique se o bot não foi bloqueado pelo usuário
2. Confirme se o chatId está correto
3. Verifique os logs de erro

### Erro 409: Conflito de Polling
Este erro ocorre quando múltiplas instâncias do bot tentam usar o mesmo token.

**Solução 1: Limpeza Automática**
```bash
# Execute o script de limpeza
yarn telegram:cleanup

# Reinicie a aplicação
yarn dev
```

**Solução 2: Reset via API**
```bash
# Com a aplicação rodando
yarn telegram:reset

# Ou via curl
curl -X POST http://localhost:3000/api/telegram/reset
```

**Solução 3: Limpeza Manual**
1. Pare todas as instâncias da aplicação
2. Aguarde 2-3 minutos
3. Execute `yarn telegram:cleanup`
4. Reinicie a aplicação

**Prevenção:**
- Use apenas uma instância da aplicação por vez
- Configure o singleton corretamente
- Monitore os logs para detectar conflitos

## 📈 Próximos Passos

1. **Personalização**: Customizar respostas para sua empresa
2. **Integração**: Conectar com banco de dados real
3. **IA Avançada**: Implementar OpenAI real
4. **Analytics**: Adicionar métricas de uso
5. **Multi-idioma**: Suporte a outros idiomas

## 📞 Suporte

Para problemas com o bot:
1. Verifique os logs da aplicação
2. Teste com o modo mock primeiro
3. Confirme a configuração do token
4. Verifique a documentação do Telegram Bot API

---

**Desenvolvido com ❤️ pela equipe Michael Lourenço** 