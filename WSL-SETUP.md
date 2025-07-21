# 🐧 Guia de Configuração para WSL

Este guia resolve problemas específicos de configuração do `.env` no WSL (Windows Subsystem for Linux).

## 🚀 **Configuração Rápida no WSL**

### 1. **Copiar o Projeto**
```bash
# Copie o projeto do Windows para o WSL
cp -r /mnt/c/dev/agent-michaellourenco ~/agent-michaellourenco
cd ~/agent-michaellourenco
```

### 2. **Instalar Dependências**
```bash
# Instalar yarn (se não tiver)
npm install -g yarn

# Instalar dependências do projeto
yarn install
```

### 3. **Configurar o .env**
```bash
# Copiar o arquivo de exemplo
cp env.example .env

# Editar o arquivo .env
nano .env
```

**Configure o token real:**
```env
TELEGRAM_BOT_TOKEN=7181944035:AAH7-xNf253eCuG03c21mwfzgm_GtEgGyfU
```

### 4. **Verificar Configuração**
```bash
# Verificar se está tudo correto
yarn wsl:fix
```

### 5. **Testar o Bot**
```bash
# Verificar informações do bot
yarn telegram:info

# Iniciar aplicação
yarn dev
```

## 🔧 **Soluções para Problemas Comuns**

### **Problema: Token não é reconhecido**

#### **Solução 1: Verificar Permissões**
```bash
# Corrigir permissões do arquivo .env
chmod 644 .env

# Verificar permissões
ls -la .env
```

#### **Solução 2: Verificar Encoding**
```bash
# Verificar se há BOM no arquivo
file .env

# Se houver BOM, recriar o arquivo
rm .env
cp env.example .env
nano .env  # Configure o token real
```

#### **Solução 3: Verificar Formato**
```bash
# Verificar se não há espaços extras
cat .env | grep TELEGRAM_BOT_TOKEN

# Formato correto:
# TELEGRAM_BOT_TOKEN=7181944035:AAH7-xNf253eCuG03c21mwfzgm_GtEgGyfU

# Formato ERRADO:
# TELEGRAM_BOT_TOKEN = 7181944035:AAH7-xNf253eCuG03c21mwfzgm_GtEgGyfU
# TELEGRAM_BOT_TOKEN= 7181944035:AAH7-xNf253eCuG03c21mwfzgm_GtEgGyfU
```

#### **Solução 4: Testar Carregamento Manual**
```bash
# Testar se o dotenv carrega corretamente
node -e "require('dotenv').config(); console.log(process.env.TELEGRAM_BOT_TOKEN)"
```

### **Problema: Aplicação não inicia**

#### **Solução 1: Verificar Node.js**
```bash
# Verificar versão do Node.js
node --version
npm --version
yarn --version

# Se necessário, instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### **Solução 2: Limpar Cache**
```bash
# Limpar cache do yarn
yarn cache clean

# Remover node_modules e reinstalar
rm -rf node_modules
yarn install
```

### **Problema: Erro de Conflito do Telegram**

#### **Solução: Limpar Conflitos**
```bash
# Limpar conflitos de polling
yarn telegram:cleanup

# Resetar serviço
yarn telegram:reset

# Reiniciar aplicação
yarn dev
```

## 🧪 **Scripts de Diagnóstico**

### **Verificar Configuração Completa**
```bash
yarn wsl:fix
```

### **Verificar Variáveis de Ambiente**
```bash
yarn check:env
```

### **Verificar Informações do Bot**
```bash
yarn telegram:info
```

### **Testar Conexão com Telegram**
```bash
# Testar se o token é válido
curl "https://api.telegram.org/bot7181944035:AAH7-xNf253eCuG03c21mwfzgm_GtEgGyfU/getMe"
```

## 📋 **Checklist de Configuração**

- [ ] Projeto copiado para WSL
- [ ] Dependências instaladas (`yarn install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Token real configurado (não mock)
- [ ] Permissões corretas (`chmod 644 .env`)
- [ ] Encoding UTF-8 sem BOM
- [ ] `yarn wsl:fix` executado com sucesso
- [ ] `yarn telegram:info` mostra informações corretas
- [ ] Aplicação inicia sem erros (`yarn dev`)
- [ ] Bot responde no Telegram

## 🐛 **Logs de Debug**

### **Verificar Logs da Aplicação**
```bash
# Iniciar com logs detalhados
DEBUG=* yarn dev

# Ou verificar logs específicos
yarn dev 2>&1 | grep -i telegram
```

### **Verificar Logs do Sistema**
```bash
# Verificar se há erros de permissão
dmesg | grep -i permission

# Verificar uso de memória
free -h

# Verificar espaço em disco
df -h
```

## 🎯 **Comandos Úteis**

| Comando | Descrição |
|---------|-----------|
| `yarn wsl:fix` | Diagnóstico completo para WSL |
| `yarn check:env` | Verificar variáveis de ambiente |
| `yarn telegram:info` | Informações do bot |
| `yarn telegram:cleanup` | Limpar conflitos |
| `yarn dev` | Iniciar aplicação |
| `chmod 644 .env` | Corrigir permissões |

## 🆘 **Ainda com Problemas?**

1. **Execute o diagnóstico completo:**
   ```bash
   yarn wsl:fix
   ```

2. **Verifique os logs:**
   ```bash
   yarn dev 2>&1 | tee app.log
   ```

3. **Teste manualmente:**
   ```bash
   node -e "require('dotenv').config(); console.log('Token:', process.env.TELEGRAM_BOT_TOKEN ? 'OK' : 'FALHOU')"
   ```

4. **Recrie o arquivo .env:**
   ```bash
   rm .env
   cp env.example .env
   nano .env  # Configure o token
   chmod 644 .env
   ```

---

**Boa sorte com a configuração no WSL! 🐧** 