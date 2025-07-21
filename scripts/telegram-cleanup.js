#!/usr/bin/env node

/**
 * Script para limpar instâncias do bot Telegram
 * Útil quando há conflitos de polling
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

console.log('🔧 Iniciando limpeza do bot Telegram...');

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
async function cleanupTelegramBot() {
  try {
    console.log('📡 Verificando informações do bot...');
    
    // 1. Obter informações do bot
    const botInfo = await makeRequest('/getMe');
    if (botInfo.ok) {
      console.log(`✅ Bot encontrado: ${botInfo.result.first_name} (@${botInfo.result.username})`);
    } else {
      console.log('❌ Erro ao obter informações do bot:', botInfo.description);
      return;
    }

    // 2. Parar webhook se estiver ativo
    console.log('🔗 Verificando webhook...');
    const webhookInfo = await makeRequest('/getWebhookInfo');
    if (webhookInfo.ok && webhookInfo.result.url) {
      console.log(`🔗 Webhook ativo: ${webhookInfo.result.url}`);
      console.log('🔄 Removendo webhook...');
      
      const deleteWebhook = await makeRequest('/deleteWebhook');
      if (deleteWebhook.ok) {
        console.log('✅ Webhook removido com sucesso');
      } else {
        console.log('❌ Erro ao remover webhook:', deleteWebhook.description);
      }
    } else {
      console.log('ℹ️  Nenhum webhook ativo');
    }

    // 3. Limpar updates pendentes
    console.log('🧹 Limpando updates pendentes...');
    const getUpdates = await makeRequest('/getUpdates', 'POST', {
      offset: -1,
      limit: 1
    });
    
    if (getUpdates.ok) {
      console.log(`✅ Updates limpos. Último update ID: ${getUpdates.result.length > 0 ? getUpdates.result[0].update_id : 'Nenhum'}`);
    } else {
      console.log('❌ Erro ao limpar updates:', getUpdates.description);
    }

    console.log('🎉 Limpeza concluída!');
    console.log('');
    console.log('📝 Próximos passos:');
    console.log('1. Reinicie a aplicação: yarn dev');
    console.log('2. Teste o bot no Telegram');
    console.log('3. Se ainda houver problemas, aguarde alguns minutos e tente novamente');

  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error.message);
    
    if (error.code === 'ETELEGRAM') {
      console.log('');
      console.log('💡 Dicas para resolver:');
      console.log('1. Aguarde alguns minutos antes de tentar novamente');
      console.log('2. Verifique se não há outras instâncias da aplicação rodando');
      console.log('3. Confirme se o token está correto');
    }
  }
}

// Executar limpeza
cleanupTelegramBot(); 