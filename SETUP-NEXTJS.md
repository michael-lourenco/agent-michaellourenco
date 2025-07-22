# 🔧 Configuração Next.js - Resolução de Problemas

## 🚨 Problema Identificado

O chat do Next.js não está funcionando porque o frontend e backend são serviços separados na Vercel. Vou te ajudar a resolver isso.

## 🔧 Soluções

### **Opção 1: Configuração Local (Desenvolvimento)**

1. **Crie o arquivo `.env.local` na raiz do projeto:**
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

2. **Execute os dois serviços:**
```bash
# Terminal 1 - Backend (API)
yarn dev
# Porta 3000

# Terminal 2 - Frontend (Next.js)
yarn dev:next
# Porta 3001
```

3. **Acesse:**
- Página: http://localhost:3001
- Chat: http://localhost:3001/chat

### **Opção 2: Configuração Vercel (Produção)**

#### **Passo 1: Deploy do Backend**
1. Crie um novo projeto na Vercel para o backend
2. Configure as variáveis de ambiente:
   ```
   HUGGINGFACE_API_KEY=sua_chave_aqui
   TELEGRAM_BOT_TOKEN=seu_token_aqui
   ```

#### **Passo 2: Deploy do Frontend**
1. Crie outro projeto na Vercel para o frontend
2. Configure a variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
   ```

### **Opção 3: Solução Híbrida (Recomendada)**

Vou criar uma versão que funciona tanto local quanto na Vercel:

#### **1. Atualizar o `utils/api.ts`:**
```typescript
export class ApiClient {
  private static getApiBaseUrl(): string {
    // Em desenvolvimento local
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3000';
    }
    
    // Em produção (Vercel)
    return process.env.NEXT_PUBLIC_API_URL || 'https://seu-backend.vercel.app';
  }
  
  // ... resto do código
}
```

#### **2. Configurar variáveis de ambiente:**

**Local (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Vercel (Dashboard):**
```bash
NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
```

## 🧪 Teste de Funcionamento

### **1. Teste Local:**
```bash
# Terminal 1
yarn dev

# Terminal 2  
yarn dev:next

# Acesse http://localhost:3001/chat
# Abra o console do navegador (F12)
# Verifique se aparece: "Criando sessão com API: http://localhost:3000"
```

### **2. Teste de Conectividade:**
```bash
# Teste se a API está respondendo
curl http://localhost:3000/api/health

# Deve retornar: {"status":"ok"}
```

## 🔍 Debugging

### **Verificar no Console do Navegador:**

1. **Abra o chat:** http://localhost:3001/chat
2. **Pressione F12** para abrir o console
3. **Procure por estas mensagens:**
   ```
   Criando sessão com API: http://localhost:3000
   Sessão criada com sucesso: session_123...
   ```

### **Se aparecer erro:**
```
Erro ao criar sessão: Error: HTTP error! status: 404
```

**Solução:** Verifique se o backend está rodando na porta 3000

### **Se aparecer erro de CORS:**
```
Access to fetch at 'http://localhost:3000/api/webchat/session' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solução:** O backend já tem CORS configurado, mas se persistir, verifique o arquivo `src/index.ts`

## 🚀 Deploy na Vercel

### **1. Backend (API):**
```bash
# Crie um novo projeto na Vercel
# Conecte com o repositório
# Configure as variáveis de ambiente
# Deploy automático
```

### **2. Frontend (Next.js):**
```bash
# Crie outro projeto na Vercel
# Conecte com o mesmo repositório
# Configure a variável:
# NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
# Deploy automático
```

## 📋 Checklist de Verificação

- [ ] Backend rodando na porta 3000
- [ ] Frontend rodando na porta 3001
- [ ] Arquivo `.env.local` criado
- [ ] Console do navegador sem erros
- [ ] API respondendo em `/api/health`
- [ ] Sessão sendo criada com sucesso
- [ ] Mensagens sendo enviadas e recebidas

## 🆘 Solução de Emergência

Se nada funcionar, você pode usar o chat original:

1. **Acesse:** http://localhost:3000/chat
2. **Este é o chat HTML puro** que funciona diretamente
3. **Funciona localmente** sem problemas

## 📞 Suporte

Se ainda tiver problemas:

1. **Verifique os logs** no console do navegador
2. **Teste a API** diretamente: `curl http://localhost:3000/api/health`
3. **Verifique se ambos os serviços** estão rodando
4. **Confirme as variáveis de ambiente**

---

**Com essas configurações, o chat do Next.js deve funcionar perfeitamente! 🎉** 