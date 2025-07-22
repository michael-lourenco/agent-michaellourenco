# 🤖 Guia de Configuração da OpenAI

Este guia te ajudará a configurar e usar a OpenAI no seu bot Telegram.

## 🚀 **Configuração Rápida**

### 1. **Obter API Key da OpenAI**
1. Acesse: https://platform.openai.com/api-keys
2. Faça login na sua conta OpenAI
3. Clique em "Create new secret key"
4. Copie a chave gerada (começa com `sk-`)

### 2. **Configurar no Projeto**
```bash
# Verificar configuração atual
yarn setup:openai

# Editar o arquivo .env
nano .env
```

**Configure a API key:**
```env
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 3. **Instalar Dependências**
```bash
# Instalar dependência da OpenAI
yarn add openai

# Ou se estiver no WSL
npm install openai
```

### 4. **Testar**
```bash
# Iniciar aplicação
yarn dev

# Testar no Telegram
# Envie uma mensagem para o bot
```

## 🔧 **Como Funciona**

### **Sistema de Factory**
O projeto usa um sistema de factory que automaticamente escolhe entre:
- **Mock AI** (quando `OPENAI_API_KEY` não está configurado)
- **OpenAI Real** (quando `OPENAI_API_KEY` está configurado)

### **Prompt do Agente**
O agente foi configurado com um prompt específico para a Michael Lourenço:

```
Você é um assistente virtual especializado da Michael Lourenço, uma empresa de tecnologia e consultoria.

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
```

### **Funcionalidades Implementadas**
- ✅ **Processamento de mensagens** com contexto de conversa
- ✅ **Análise de sentimento** das mensagens
- ✅ **Extração de intenção** do usuário
- ✅ **Extração de entidades** (telefone, email, etc.)
- ✅ **Base de conhecimento** com embeddings
- ✅ **Serviços LangChain** (resumo, tradução, etc.)

## 📋 **Comandos Úteis**

| Comando | Descrição |
|---------|-----------|
| `yarn setup:openai` | Verificar configuração da OpenAI |
| `yarn dev` | Iniciar aplicação |
| `yarn telegram:info` | Verificar bot Telegram |
| `yarn check:env` | Verificar variáveis de ambiente |

## 🧪 **Testando a OpenAI**

### **1. Verificar Configuração**
```bash
yarn setup:openai
```

### **2. Iniciar Aplicação**
```bash
yarn dev
```

**Logs esperados:**
```
🔧 Inicializando OpenAI Engine...
✅ OpenAI Engine inicializado com sucesso
🔧 Inicializando OpenAI Knowledge Base...
✅ OpenAI Knowledge Base inicializado com sucesso
🔧 Inicializando OpenAI LangChain Service...
✅ OpenAI LangChain Service inicializado com sucesso
```

### **3. Testar no Telegram**
1. Abra o Telegram
2. Procure pelo seu bot
3. Envie mensagens como:
   - "Olá, como vocês podem me ajudar?"
   - "Quais são os seus produtos?"
   - "Preciso de informações sobre preços"
   - "Como posso entrar em contato?"

### **4. Verificar Respostas**
As respostas devem ser:
- ✅ Mais naturais e contextuais
- ✅ Baseadas no prompt da empresa
- ✅ Com informações específicas da Michael Lourenço
- ✅ Com sugestões de próximos passos

## 💰 **Custos da OpenAI**

### **Modelo gpt-3.5-turbo**
- **Input**: $0.0015 por 1K tokens
- **Output**: $0.002 por 1K tokens

### **Exemplo de Custo**
- Mensagem de 100 tokens: ~$0.0002
- 1000 mensagens: ~$0.20
- 10000 mensagens: ~$2.00

### **Dicas para Economizar**
1. **Use gpt-3.5-turbo** (mais barato que gpt-4)
2. **Limite o contexto** (últimas 10 mensagens)
3. **Configure max_tokens** (500 por resposta)
4. **Monitore o uso** no dashboard da OpenAI

## 🔍 **Monitoramento**

### **Logs da Aplicação**
```bash
# Ver logs em tempo real
yarn dev 2>&1 | grep -i openai

# Logs esperados:
# OpenAI processing message: "Olá" from user: 123456789
# OpenAI response generated for user 123456789: Olá! Como posso ajudá-lo hoje?...
```

### **Dashboard da OpenAI**
- Acesse: https://platform.openai.com/usage
- Monitore uso de tokens
- Verifique custos
- Analise performance

## 🐛 **Solução de Problemas**

### **Erro: "OpenAI API key not found"**
```bash
# Verificar se a key está configurada
yarn setup:openai

# Verificar arquivo .env
cat .env | grep OPENAI_API_KEY
```

### **Erro: "Invalid API key"**
1. Verifique se a key está correta
2. Confirme se começa com `sk-`
3. Verifique se não há espaços extras
4. Teste a key no playground da OpenAI

### **Erro: "Rate limit exceeded"**
1. Aguarde alguns minutos
2. Verifique seu plano da OpenAI
3. Considere upgrade do plano

### **Respostas muito lentas**
1. Verifique sua conexão com a internet
2. Considere usar um modelo mais rápido
3. Reduza o contexto da conversa

### **Fallback para Mock**
Se a OpenAI falhar, o sistema automaticamente:
1. Usa o Mock AI como fallback
2. Envia mensagem de erro amigável
3. Loga o erro para debug

## 🎯 **Personalização**

### **Modificar o Prompt**
Edite o `SYSTEM_PROMPT` em `src/ai/openai.ts`:

```typescript
const SYSTEM_PROMPT = `Seu prompt personalizado aqui...`;
```

### **Ajustar Parâmetros**
```typescript
private readonly model = 'gpt-3.5-turbo';  // ou 'gpt-4'
private readonly maxTokens = 500;          // limite de tokens
private readonly temperature = 0.7;        // criatividade (0-1)
```

### **Adicionar Funcionalidades**
- **Funções customizadas** no prompt
- **Integração com banco de dados**
- **Webhooks para ações**
- **Análise avançada de sentimento**

## 📚 **Recursos Adicionais**

### **Documentação**
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Node.js SDK](https://github.com/openai/openai-node)
- [Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

### **Exemplos**
- [Chat Completions](https://platform.openai.com/docs/api-reference/chat)
- [Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Function Calling](https://platform.openai.com/docs/guides/function-calling)

### **Comunidade**
- [OpenAI Discord](https://discord.gg/openai)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/openai-api)
- [GitHub Discussions](https://github.com/openai/openai-node/discussions)

---

**Boa sorte com a configuração da OpenAI! 🤖** 