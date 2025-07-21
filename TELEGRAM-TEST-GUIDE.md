# 🧪 Guia Rápido - Teste do Bot Telegram

Este guia te ajudará a identificar e testar o bot correto do Telegram.

## 🚀 **Passo a Passo Rápido**

### 1. **Identificar seus Bots**
```bash
# Execute este comando para ver instruções
yarn telegram:list
```

**Ou manualmente:**
1. Abra o Telegram
2. Procure por `@BotFather`
3. Envie `/mybots`
4. Você verá todos os seus bots

### 2. **Obter o Token do Bot Desejado**
1. No @BotFather, clique no bot que você quer usar
2. Clique em "API Token"
3. Copie o token (formato: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 3. **Configurar o Token**
1. Copie `env.example` para `.env`
2. Substitua a linha:
   ```env
   TELEGRAM_BOT_TOKEN=mock_telegram_token
   ```
   Por:
   ```env
   TELEGRAM_BOT_TOKEN=SEU_TOKEN_AQUI
   ```

### 4. **Verificar Informações do Bot**
```bash
yarn telegram:info
```

Este comando mostrará:
- ✅ Nome do bot
- ✅ Username (@nome_do_bot)
- ✅ Link direto para o bot
- ✅ Status de configuração
- ✅ Instruções de teste

### 5. **Iniciar a Aplicação**
```bash
yarn dev
```

### 6. **Testar o Bot**
1. Abra o Telegram
2. Procure pelo bot (usando o username mostrado no passo 4)
3. Clique em "Start" ou envie `/start`
4. Digite qualquer mensagem
5. Veja a resposta automática!

## 🔍 **Comandos Úteis**

| Comando | Descrição |
|---------|-----------|
| `yarn telegram:list` | Instruções para listar bots |
| `yarn telegram:info` | Informações do bot configurado |
| `yarn telegram:cleanup` | Limpar conflitos |
| `yarn telegram:reset` | Resetar o serviço |
| `yarn dev` | Iniciar aplicação |

## 🐛 **Solução de Problemas**

### **Bot não responde**
1. Verifique se a aplicação está rodando (`yarn dev`)
2. Confirme se o token está correto (`yarn telegram:info`)
3. Teste com `/start` primeiro

### **Erro 409 - Conflito**
```bash
# Limpe o conflito
yarn telegram:cleanup

# Reinicie a aplicação
yarn dev
```

### **Token inválido**
1. Verifique se o token está correto
2. Crie um novo bot com @BotFather se necessário
3. Configure o novo token no `.env`

### **Bot não encontrado**
1. Verifique o username no `yarn telegram:info`
2. Procure pelo bot no Telegram usando o username
3. Confirme se o bot está ativo

## 📱 **Exemplo de Teste**

### **Configuração:**
```env
TELEGRAM_BOT_TOKEN=7181944035:AAH7-xNf253eCuG03c21mwfzgm_GtEgGyfU
```

### **Verificação:**
```bash
yarn telegram:info
```

**Saída esperada:**
```
🤖 **INFORMAÇÕES DO BOT**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Nome: Michael Lourenço IA
👤 Username: @michaellourenco_ia_bot
🆔 ID: 7181944035
🔗 Link: https://t.me/michaellourenco_ia_bot
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **Teste no Telegram:**
1. Acesse: https://t.me/michaellourenco_ia_bot
2. Clique em "Start"
3. Digite: "Olá, como vocês podem me ajudar?"
4. Veja a resposta automática!

## 🎯 **Respostas Esperadas**

O bot deve responder a:

- **Saudações**: "Olá! Como posso ajudá-lo hoje?"
- **Produtos**: "Temos uma ampla variedade de produtos..."
- **Preços**: "Nossos preços variam conforme o produto..."
- **Contato**: "Para falar com nosso time comercial..."

## ✅ **Checklist de Teste**

- [ ] Token configurado no `.env`
- [ ] `yarn telegram:info` mostra informações corretas
- [ ] Aplicação rodando (`yarn dev`)
- [ ] Bot encontrado no Telegram
- [ ] Comando `/start` funciona
- [ ] Mensagens recebem resposta automática
- [ ] Logs mostram atividade no console

## 🆘 **Precisa de Ajuda?**

1. Execute `yarn telegram:info` e verifique as informações
2. Confirme se o token está correto
3. Verifique se a aplicação está rodando
4. Teste com comandos simples primeiro (`/start`)
5. Verifique os logs da aplicação para erros

---

**Boa sorte com o teste! 🚀** 