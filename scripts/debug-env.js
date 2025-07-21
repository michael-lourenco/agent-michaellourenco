#!/usr/bin/env node

/**
 * Script para debugar variáveis de ambiente
 * Verifica se o .env está sendo carregado corretamente
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('🔍 **DEBUG - VARIÁVEIS DE AMBIENTE**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// 1. Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '..', '.env');
console.log('📁 **VERIFICAÇÃO DE ARQUIVOS**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Caminho do .env: ${envPath}`);
console.log(`Arquivo .env existe: ${fs.existsSync(envPath) ? '✅ SIM' : '❌ NÃO'}`);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(`Tamanho do arquivo: ${envContent.length} caracteres`);
  console.log('');
  
  // Verificar se tem a linha do TELEGRAM_BOT_TOKEN
  const lines = envContent.split('\n');
  const telegramLine = lines.find(line => line.startsWith('TELEGRAM_BOT_TOKEN='));
  
  if (telegramLine) {
    console.log('✅ Linha TELEGRAM_BOT_TOKEN encontrada!');
    console.log(`Conteúdo: ${telegramLine}`);
    
    const token = telegramLine.split('=')[1];
    if (token && token !== 'mock_telegram_token') {
      console.log(`✅ Token configurado: ${token.substring(0, 10)}...`);
    } else {
      console.log('⚠️  Token ainda é mock');
    }
  } else {
    console.log('❌ Linha TELEGRAM_BOT_TOKEN NÃO encontrada!');
  }
} else {
  console.log('❌ Arquivo .env não existe!');
  console.log('💡 Execute: cp env.example .env');
}

console.log('');
console.log('🔧 **CARREGAMENTO DO DOTENV**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 2. Tentar carregar o dotenv
try {
  const result = dotenv.config();
  
  if (result.error) {
    console.log('❌ Erro ao carregar dotenv:', result.error.message);
  } else {
    console.log('✅ Dotenv carregado com sucesso!');
    console.log(`Arquivo carregado: ${result.parsed ? 'Sim' : 'Não'}`);
  }
} catch (error) {
  console.log('❌ Erro ao carregar dotenv:', error.message);
}

console.log('');
console.log('🌍 **VARIÁVEIS DE AMBIENTE**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 3. Verificar variáveis específicas
const envVars = [
  'NODE_ENV',
  'PORT',
  'TELEGRAM_BOT_TOKEN',
  'WHATSAPP_TOKEN',
  'OPENAI_API_KEY'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('TOKEN') || varName.includes('KEY')) {
      console.log(`${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`${varName}: ${value}`);
    }
  } else {
    console.log(`${varName}: ❌ NÃO DEFINIDA`);
  }
});

console.log('');
console.log('🔍 **VERIFICAÇÃO ESPECÍFICA DO TELEGRAM**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
if (telegramToken) {
  if (telegramToken === 'mock_telegram_token') {
    console.log('⚠️  TELEGRAM_BOT_TOKEN ainda é mock');
    console.log('💡 Configure o token real no arquivo .env');
  } else {
    console.log('✅ TELEGRAM_BOT_TOKEN configurado!');
    console.log(`Token: ${telegramToken.substring(0, 10)}...`);
  }
} else {
  console.log('❌ TELEGRAM_BOT_TOKEN não está definida');
  console.log('💡 Verifique se o arquivo .env existe e tem a linha correta');
}

console.log('');
console.log('🛠️ **SOLUÇÕES POSSÍVEIS**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!fs.existsSync(envPath)) {
  console.log('1. Crie o arquivo .env:');
  console.log('   cp env.example .env');
} else if (!telegramToken || telegramToken === 'mock_telegram_token') {
  console.log('1. Configure o token no arquivo .env:');
  console.log('   TELEGRAM_BOT_TOKEN=SEU_TOKEN_AQUI');
} else {
  console.log('1. ✅ Configuração parece estar correta');
  console.log('2. Teste com: yarn telegram:info');
}

console.log('');
console.log('2. Verifique se não há espaços extras no .env');
console.log('3. Certifique-se de que não há aspas no token');
console.log('4. Reinicie a aplicação após mudanças');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'); 