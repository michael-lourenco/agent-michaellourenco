#!/usr/bin/env node

/**
 * Script para configurar o arquivo .env
 * Copia env.example para .env se não existir
 */

const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, '..', 'env.example');
const envPath = path.join(__dirname, '..', '.env');

console.log('🔧 **CONFIGURAÇÃO DO ARQUIVO .ENV**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Verificar se .env já existe
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env já existe!');
  console.log('');
  
  // Ler conteúdo atual
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar se tem token configurado
  if (envContent.includes('TELEGRAM_BOT_TOKEN=')) {
    const tokenLine = envContent.split('\n').find(line => line.startsWith('TELEGRAM_BOT_TOKEN='));
    const token = tokenLine.split('=')[1];
    
    if (token && token !== 'mock_telegram_token') {
      console.log('✅ Token do Telegram já configurado!');
      console.log(`Token: ${token.substring(0, 10)}...`);
      console.log('');
      console.log('💡 Para testar o bot:');
      console.log('1. yarn telegram:info');
      console.log('2. yarn dev');
      console.log('3. Teste no Telegram');
    } else {
      console.log('⚠️  Token do Telegram ainda é mock');
      console.log('');
      console.log('🔧 Para configurar o token real:');
      console.log('1. Abra o arquivo .env');
      console.log('2. Substitua a linha:');
      console.log('   TELEGRAM_BOT_TOKEN=mock_telegram_token');
      console.log('3. Pelo token real:');
      console.log('   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz');
      console.log('');
      console.log('💡 Como obter o token:');
      console.log('1. Abra o Telegram');
      console.log('2. Procure por @BotFather');
      console.log('3. Envie /mybots');
      console.log('4. Clique no bot desejado');
      console.log('5. Clique em "API Token"');
    }
  }
} else {
  console.log('📝 Criando arquivo .env...');
  
  // Verificar se env.example existe
  if (!fs.existsSync(envExamplePath)) {
    console.log('❌ Arquivo env.example não encontrado!');
    process.exit(1);
  }
  
  // Copiar env.example para .env
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  fs.writeFileSync(envPath, envExampleContent);
  
  console.log('✅ Arquivo .env criado com sucesso!');
  console.log('');
  console.log('🔧 **PRÓXIMOS PASSOS:**');
  console.log('');
  console.log('1. Configure o token do Telegram:');
  console.log('   - Abra o arquivo .env');
  console.log('   - Substitua a linha:');
  console.log('     TELEGRAM_BOT_TOKEN=mock_telegram_token');
  console.log('   - Pelo token real:');
  console.log('     TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz');
  console.log('');
  console.log('2. Como obter o token:');
  console.log('   - Abra o Telegram');
  console.log('   - Procure por @BotFather');
  console.log('   - Envie /mybots');
  console.log('   - Clique no bot desejado');
  console.log('   - Clique em "API Token"');
  console.log('');
  console.log('3. Testar o bot:');
  console.log('   - yarn telegram:info');
  console.log('   - yarn dev');
  console.log('   - Teste no Telegram');
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💡 **COMANDOS ÚTEIS:**');
console.log('• yarn telegram:list    - Instruções para listar bots');
console.log('• yarn telegram:info    - Ver informações do bot');
console.log('• yarn telegram:cleanup - Limpar conflitos');
console.log('• yarn dev              - Iniciar aplicação');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'); 