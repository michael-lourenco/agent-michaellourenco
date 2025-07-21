#!/usr/bin/env node

/**
 * Script para listar todos os bots do usuário
 * Útil para identificar qual bot usar
 */

const https = require('https');

console.log('🤖 **LISTA DE BOTS DO TELEGRAM**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

console.log('📝 **COMO IDENTIFICAR SEUS BOTS:**');
console.log('');
console.log('1. Abra o Telegram');
console.log('2. Procure por @BotFather');
console.log('3. Envie /mybots');
console.log('4. Você verá uma lista de todos os seus bots');
console.log('');
console.log('🔧 **COMO OBTER O TOKEN DE UM BOT:**');
console.log('');
console.log('1. Envie /mybots para @BotFather');
console.log('2. Clique no bot desejado');
console.log('3. Clique em "API Token"');
console.log('4. Copie o token (formato: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz)');
console.log('');
console.log('⚙️ **COMO CONFIGURAR O TOKEN:**');
console.log('');
console.log('1. Copie o arquivo env.example para .env');
console.log('2. Substitua a linha:');
console.log('   TELEGRAM_BOT_TOKEN=mock_telegram_token');
console.log('3. Pelo token real:');
console.log('   TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz');
console.log('');
console.log('🧪 **COMO TESTAR O BOT:**');
console.log('');
console.log('1. Execute: yarn telegram:info');
console.log('2. Isso mostrará informações do bot configurado');
console.log('3. Execute: yarn dev');
console.log('4. Teste o bot no Telegram');
console.log('');
console.log('🔍 **COMANDOS ÚTEIS:**');
console.log('');
console.log('• yarn telegram:info    - Ver informações do bot atual');
console.log('• yarn telegram:cleanup - Limpar conflitos');
console.log('• yarn telegram:reset   - Resetar o serviço');
console.log('• yarn dev              - Iniciar aplicação');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Verificar se há token configurado
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'mock_telegram_token') {
  console.log('✅ Token configurado encontrado!');
  console.log('Execute "yarn telegram:info" para ver detalhes do bot.');
} else {
  console.log('❌ Nenhum token configurado.');
  console.log('Configure TELEGRAM_BOT_TOKEN no arquivo .env');
}

console.log('');
console.log('💡 **DICA:** Se você tem vários bots, teste cada um:');
console.log('1. Configure o token no .env');
console.log('2. Execute: yarn telegram:info');
console.log('3. Verifique se é o bot correto');
console.log('4. Teste no Telegram');
console.log('5. Se não for o correto, troque o token e repita'); 