#!/usr/bin/env node

/**
 * Script para resolver problemas de .env no WSL
 * Verifica e corrige problemas comuns
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 **SOLUÇÃO PARA PROBLEMAS DE .ENV NO WSL**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const envPath = path.join(__dirname, '..', '.env');

// 1. Verificar se o arquivo existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  console.log('💡 Execute: cp env.example .env');
  process.exit(1);
}

// 2. Ler e verificar o conteúdo
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
const telegramLine = lines.find(line => line.startsWith('TELEGRAM_BOT_TOKEN='));

if (!telegramLine) {
  console.log('❌ Linha TELEGRAM_BOT_TOKEN não encontrada!');
  process.exit(1);
}

const token = telegramLine.split('=')[1];
if (!token || token === 'mock_telegram_token') {
  console.log('⚠️  Token ainda é mock!');
  console.log('💡 Configure o token real no arquivo .env');
  process.exit(1);
}

console.log('✅ Token configurado corretamente!');
console.log(`Token: ${token.substring(0, 10)}...`);
console.log('');

// 3. Verificar permissões (WSL)
console.log('🔐 **VERIFICANDO PERMISSÕES (WSL)**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

try {
  const stats = fs.statSync(envPath);
  const mode = stats.mode.toString(8);
  console.log(`Permissões atuais: ${mode}`);
  
  if (mode !== '644') {
    console.log('⚠️  Permissões incorretas!');
    console.log('💡 Execute: chmod 644 .env');
  } else {
    console.log('✅ Permissões corretas!');
  }
} catch (error) {
  console.log('⚠️  Não foi possível verificar permissões');
}

console.log('');

// 4. Verificar encoding
console.log('📝 **VERIFICANDO ENCODING**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar se há caracteres BOM
const buffer = fs.readFileSync(envPath);
if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
  console.log('⚠️  Arquivo tem BOM (Byte Order Mark)!');
  console.log('💡 Isso pode causar problemas no WSL');
  console.log('💡 Salve o arquivo como UTF-8 sem BOM');
} else {
  console.log('✅ Encoding parece correto (UTF-8 sem BOM)');
}

console.log('');

// 5. Testar carregamento do dotenv
console.log('🧪 **TESTANDO CARREGAMENTO DO DOTENV**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

try {
  // Carregar dotenv manualmente
  require('dotenv').config({ path: envPath });
  
  const loadedToken = process.env.TELEGRAM_BOT_TOKEN;
  if (loadedToken && loadedToken !== 'mock_telegram_token') {
    console.log('✅ Dotenv carregou o token corretamente!');
    console.log(`Token carregado: ${loadedToken.substring(0, 10)}...`);
  } else {
    console.log('❌ Dotenv não carregou o token corretamente!');
    console.log('💡 Problema na configuração do dotenv');
  }
} catch (error) {
  console.log('❌ Erro ao carregar dotenv:', error.message);
}

console.log('');
console.log('🛠️ **SOLUÇÕES PARA WSL**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('1. **Se o token não está sendo carregado:**');
console.log('   - Verifique se o dotenv está sendo importado ANTES de usar process.env');
console.log('   - Adicione no início do src/index.ts:');
console.log('     import dotenv from "dotenv";');
console.log('     dotenv.config();');
console.log('');

console.log('2. **Se há problemas de permissão:**');
console.log('   - Execute: chmod 644 .env');
console.log('');

console.log('3. **Se há problemas de encoding:**');
console.log('   - Abra o arquivo .env no editor');
console.log('   - Salve como UTF-8 sem BOM');
console.log('');

console.log('4. **Teste manual:**');
console.log('   - Execute: node -e "require(\'dotenv\').config(); console.log(process.env.TELEGRAM_BOT_TOKEN)"');
console.log('');

console.log('5. **Verifique se não há espaços extras:**');
console.log('   - Certifique-se de que não há espaços antes ou depois do =');
console.log('   - Formato correto: TELEGRAM_BOT_TOKEN=token_aqui');
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💡 **PRÓXIMO PASSO**: Execute "yarn check:env" para verificar se funcionou'); 