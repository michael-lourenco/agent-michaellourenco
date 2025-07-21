#!/usr/bin/env node

/**
 * Script simples para verificar variáveis de ambiente
 * Funciona tanto no Windows quanto no WSL
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 **VERIFICAÇÃO SIMPLES - VARIÁVEIS DE AMBIENTE**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// 1. Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '..', '.env');
console.log('📁 **ARQUIVO .ENV**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Caminho: ${envPath}`);
console.log(`Existe: ${fs.existsSync(envPath) ? '✅ SIM' : '❌ NÃO'}`);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log(`Tamanho: ${envContent.length} caracteres`);
  
  // Verificar se tem a linha do TELEGRAM_BOT_TOKEN
  const lines = envContent.split('\n');
  const telegramLine = lines.find(line => line.startsWith('TELEGRAM_BOT_TOKEN='));
  
  if (telegramLine) {
    console.log('✅ Linha TELEGRAM_BOT_TOKEN encontrada!');
    const token = telegramLine.split('=')[1];
    if (token && token !== 'mock_telegram_token') {
      console.log(`✅ Token configurado: ${token.substring(0, 10)}...`);
    } else {
      console.log('⚠️  Token ainda é mock');
    }
  } else {
    console.log('❌ Linha TELEGRAM_BOT_TOKEN NÃO encontrada!');
  }
}

console.log('');
console.log('🌍 **VARIÁVEIS DE AMBIENTE ATUAIS**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// 2. Verificar variáveis específicas
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
if (telegramToken) {
  if (telegramToken === 'mock_telegram_token') {
    console.log('⚠️  TELEGRAM_BOT_TOKEN: mock_telegram_token');
    console.log('💡 O arquivo .env não está sendo carregado!');
  } else {
    console.log(`✅ TELEGRAM_BOT_TOKEN: ${telegramToken.substring(0, 10)}...`);
  }
} else {
  console.log('❌ TELEGRAM_BOT_TOKEN: NÃO DEFINIDA');
  console.log('💡 O arquivo .env não está sendo carregado!');
}

console.log('');
console.log('🔧 **SOLUÇÕES PARA WSL**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (!telegramToken || telegramToken === 'mock_telegram_token') {
  console.log('1. **Problema**: O arquivo .env não está sendo carregado');
  console.log('');
  console.log('2. **Soluções possíveis**:');
  console.log('');
  console.log('   A) Verificar se o dotenv está sendo importado:');
  console.log('      - Confirme que src/config/index.ts tem:');
  console.log('        import dotenv from "dotenv";');
  console.log('        dotenv.config();');
  console.log('');
  console.log('   B) Verificar ordem de importação:');
  console.log('      - O dotenv deve ser carregado ANTES de usar process.env');
  console.log('');
  console.log('   C) Verificar permissões no WSL:');
  console.log('      - chmod 644 .env');
  console.log('');
  console.log('   D) Verificar encoding do arquivo:');
  console.log('      - Certifique-se de que está em UTF-8 sem BOM');
  console.log('');
  console.log('   E) Testar carregamento manual:');
  console.log('      - Adicione no início do src/index.ts:');
  console.log('        require("dotenv").config();');
  console.log('');
  console.log('3. **Teste rápido**:');
  console.log('   - Execute: node -e "require(\'dotenv\').config(); console.log(process.env.TELEGRAM_BOT_TOKEN)"');
} else {
  console.log('✅ Configuração está funcionando!');
  console.log('💡 Teste com: yarn telegram:info');
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'); 