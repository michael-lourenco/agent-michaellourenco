#!/usr/bin/env node

/**
 * Script para identificar informações do bot Telegram
 * Útil para verificar qual bot está associado ao token
 */

// Carregar variáveis de ambiente ANTES de tudo
require('dotenv').config();

const https = require('https');

// Configuração
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'mock_telegram_token';

if (TELEGRAM_BOT_TOKEN === 'mock_telegram_token') {
  console.log('❌ Token do Telegram não configurado');
  console.log('Configure TELEGRAM_BOT_TOKEN no arquivo .env');
  process.exit(1);
}

console.log('🔍 Verificando informações do bot Telegram...');
console.log('');

// Função para fazer requisição HTTPS
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Função principal
async function getBotInfo() {
  try {
    console.log('📡 Obtendo informações do bot...');
    
    // 1. Informações básicas do bot
    const botInfo = await makeRequest('/getMe');
    if (botInfo.ok) {
      const bot = botInfo.result;
      console.log('🤖 **INFORMAÇÕES DO BOT**');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📝 Nome: ${bot.first_name}`);
      console.log(`👤 Username: @${bot.username}`);
      console.log(`🆔 ID: ${bot.id}`);
      console.log(`🔗 Link: https://t.me/${bot.username}`);
      console.log(`✅ Pode se juntar a grupos: ${bot.can_join_groups ? 'Sim' : 'Não'}`);
      console.log(`📢 Pode ler mensagens: ${bot.can_read_all_group_messages ? 'Sim' : 'Não'}`);
      console.log(`🎯 Suporta comandos inline: ${bot.supports_inline_queries ? 'Sim' : 'Não'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    } else {
      console.log('❌ Erro ao obter informações do bot:', botInfo.description);
      return;
    }

    // 2. Verificar webhook
    console.log('🔗 Verificando configuração de webhook...');
    const webhookInfo = await makeRequest('/getWebhookInfo');
    if (webhookInfo.ok) {
      const webhook = webhookInfo.result;
      console.log('🔗 **CONFIGURAÇÃO DE WEBHOOK**');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🌐 URL: ${webhook.url || 'Nenhuma'}`);
      console.log(`📊 Updates pendentes: ${webhook.pending_update_count}`);
      console.log(`🔒 Certificado: ${webhook.has_custom_certificate ? 'Customizado' : 'Padrão'}`);
      console.log(`🌍 IP: ${webhook.ip_address || 'N/A'}`);
      console.log(`⏰ Último erro: ${webhook.last_error_date ? new Date(webhook.last_error_date * 1000).toLocaleString() : 'Nenhum'}`);
      console.log(`❌ Erro: ${webhook.last_error_message || 'Nenhum'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    }

    // 3. Verificar updates recentes
    console.log('📨 Verificando mensagens recentes...');
    const updates = await makeRequest('/getUpdates', 'POST', {
      limit: 5,
      timeout: 1
    });
    
    if (updates.ok) {
      console.log('📨 **MENSAGENS RECENTES**');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      if (updates.result.length === 0) {
        console.log('📭 Nenhuma mensagem recente encontrada');
        console.log('💡 Envie uma mensagem para o bot para testar');
      } else {
        updates.result.forEach((update, index) => {
          console.log(`📨 Mensagem ${index + 1}:`);
          console.log(`   👤 De: ${update.message?.from?.first_name || 'Desconhecido'} (ID: ${update.message?.from?.id})`);
          console.log(`   💬 Texto: ${update.message?.text || 'Sem texto'}`);
          console.log(`   ⏰ Data: ${new Date(update.message?.date * 1000).toLocaleString()}`);
          console.log('');
        });
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    }

    // 4. Instruções de teste
    console.log('🧪 **COMO TESTAR O BOT**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Abra o Telegram no seu celular/computador');
    console.log(`2. Procure por: @${botInfo.result.username}`);
    console.log(`3. Ou acesse: https://t.me/${botInfo.result.username}`);
    console.log('4. Clique em "Start" ou envie /start');
    console.log('5. Digite qualquer mensagem para testar');
    console.log('');
    console.log('🔧 **COMANDOS DISPONÍVEIS**');
    console.log('• /start - Iniciar conversa');
    console.log('• /help - Ver comandos disponíveis');
    console.log('• Qualquer texto - Resposta automática com IA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    // 5. Status da aplicação
    console.log('🚀 **PRÓXIMOS PASSOS**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Certifique-se de que a aplicação está rodando:');
    console.log('   yarn dev');
    console.log('');
    console.log('2. Teste o bot no Telegram');
    console.log('');
    console.log('3. Verifique os logs da aplicação para ver as mensagens');
    console.log('');
    console.log('4. Se houver problemas, execute:');
    console.log('   yarn telegram:cleanup');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Erro ao obter informações:', error.message);
    
    if (error.code === 'ETELEGRAM') {
      console.log('');
      console.log('💡 Possíveis causas:');
      console.log('1. Token inválido ou expirado');
      console.log('2. Bot foi deletado');
      console.log('3. Problemas de conectividade');
      console.log('');
      console.log('🔧 Soluções:');
      console.log('1. Verifique se o token está correto');
      console.log('2. Crie um novo bot com @BotFather');
      console.log('3. Teste a conectividade com a internet');
    }
  }
}

// Executar verificação
getBotInfo(); 