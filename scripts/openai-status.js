#!/usr/bin/env node

/**
 * Script para verificar status da conta OpenAI
 * Útil para verificar quota, billing e planos
 */

// Carregar variáveis de ambiente ANTES de tudo
require('dotenv').config();

const https = require('https');

console.log('🤖 **STATUS DA CONTA OPENAI**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY || OPENAI_API_KEY === 'mock_openai_key') {
  console.log('❌ OpenAI API Key não configurada');
  console.log('💡 Configure OPENAI_API_KEY no arquivo .env');
  process.exit(1);
}

// Função para fazer requisição HTTPS
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
          resolve({ status: res.statusCode, data: response });
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
async function checkOpenAIStatus() {
  try {
    console.log('📡 Verificando status da conta OpenAI...');
    console.log('');
    
    // 1. Testar se a API key é válida
    console.log('🔑 **VERIFICAÇÃO DA API KEY**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const modelsResponse = await makeRequest('/v1/models');
      
      if (modelsResponse.status === 200) {
        console.log('✅ API Key válida!');
        console.log(`📊 Modelos disponíveis: ${modelsResponse.data.data.length}`);
        
        // Mostrar modelos principais
        const mainModels = modelsResponse.data.data
          .filter(model => model.id.includes('gpt'))
          .slice(0, 5);
        
        console.log('🤖 Modelos GPT disponíveis:');
        mainModels.forEach(model => {
          console.log(`   • ${model.id}`);
        });
      } else {
        console.log('❌ API Key inválida ou erro na API');
        console.log(`Status: ${modelsResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Erro ao verificar API Key:', error.message);
    }
    
    console.log('');
    
    // 2. Verificar uso e billing (se disponível)
    console.log('💰 **INFORMAÇÕES DE BILLING**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const usageResponse = await makeRequest('/v1/dashboard/billing/usage');
      
      if (usageResponse.status === 200) {
        const usage = usageResponse.data;
        console.log('✅ Informações de uso obtidas!');
        console.log('');
        console.log('📊 **USO ATUAL:**');
        console.log(`   • Total de tokens: ${usage.total_usage}`);
        console.log(`   • Custo total: $${(usage.total_usage / 1000 * 0.002).toFixed(4)}`);
        console.log(`   • Período: ${new Date(usage.start_date).toLocaleDateString()} - ${new Date(usage.end_date).toLocaleDateString()}`);
      } else {
        console.log('⚠️  Não foi possível obter informações de uso');
        console.log(`Status: ${usageResponse.status}`);
      }
    } catch (error) {
      console.log('⚠️  Erro ao obter informações de uso:', error.message);
    }
    
    console.log('');
    
    // 3. Verificar subscription (se disponível)
    console.log('📋 **INFORMAÇÕES DE PLANO**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const subscriptionResponse = await makeRequest('/v1/dashboard/billing/subscription');
      
      if (subscriptionResponse.status === 200) {
        const subscription = subscriptionResponse.data;
        console.log('✅ Informações de plano obtidas!');
        console.log('');
        console.log('📋 **PLANO ATUAL:**');
        console.log(`   • Plano: ${subscription.plan.id}`);
        console.log(`   • Status: ${subscription.status}`);
        console.log(`   • Limite: $${subscription.hard_limit_usd}`);
        console.log(`   • Soft limit: $${subscription.soft_limit_usd}`);
        console.log(`   • Sistema: ${subscription.system_hard_limit_usd}`);
      } else {
        console.log('⚠️  Não foi possível obter informações do plano');
        console.log(`Status: ${subscriptionResponse.status}`);
      }
    } catch (error) {
      console.log('⚠️  Erro ao obter informações do plano:', error.message);
    }
    
    console.log('');
    
    // 4. Soluções para quota excedida
    console.log('🛠️ **SOLUÇÕES PARA QUOTA EXCEDIDA**');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('1. **Verificar uso atual:**');
    console.log('   Acesse: https://platform.openai.com/usage');
    console.log('');
    
    console.log('2. **Adicionar método de pagamento:**');
    console.log('   Acesse: https://platform.openai.com/account/billing');
    console.log('');
    
    console.log('3. **Aumentar limite de crédito:**');
    console.log('   Acesse: https://platform.openai.com/account/billing/overview');
    console.log('');
    
    console.log('4. **Usar Mock AI temporariamente:**');
    console.log('   Comente a linha OPENAI_API_KEY no .env');
    console.log('   O sistema automaticamente usará o Mock AI');
    console.log('');
    
    console.log('5. **Configurar alertas de uso:**');
    console.log('   Acesse: https://platform.openai.com/account/billing/overview');
    console.log('   Configure alertas para não exceder o limite');
    console.log('');
    
    console.log('💡 **DICA:** Para desenvolvimento, use o Mock AI');
    console.log('   Para produção, configure billing adequado');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    
    if (error.message.includes('429')) {
      console.log('');
      console.log('🚨 **QUOTA EXCEDIDA DETECTADA**');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Sua conta atingiu o limite de uso gratuito.');
      console.log('');
      console.log('🔧 **SOLUÇÕES IMEDIATAS:**');
      console.log('1. Adicione método de pagamento');
      console.log('2. Use Mock AI temporariamente');
      console.log('3. Aguarde reset mensal (se conta gratuita)');
    }
  }
}

// Executar verificação
checkOpenAIStatus(); 