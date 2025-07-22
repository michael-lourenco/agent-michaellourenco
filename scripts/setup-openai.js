#!/usr/bin/env node

/**
 * Script para configurar a OpenAI
 * Verifica e configura a API key da OpenAI
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 **CONFIGURAÇÃO DA OPENAI**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

const envPath = path.join(__dirname, '..', '.env');

// 1. Verificar se o arquivo .env existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  console.log('💡 Execute: cp env.example .env');
  process.exit(1);
}

// 2. Ler o arquivo .env
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

// 3. Verificar se a OpenAI API key está configurada
const openaiLine = lines.find(line => line.startsWith('OPENAI_API_KEY='));
const currentKey = openaiLine ? openaiLine.split('=')[1] : null;

if (currentKey && currentKey !== 'mock_openai_key') {
  console.log('✅ OpenAI API Key já configurada!');
  console.log(`Key: ${currentKey.substring(0, 10)}...`);
  console.log('');
  console.log('💡 Para testar a OpenAI:');
  console.log('1. yarn dev');
  console.log('2. Teste o bot no Telegram');
  console.log('3. Verifique os logs para confirmar que está usando OpenAI');
} else {
  console.log('⚠️  OpenAI API Key não configurada');
  console.log('');
  console.log('🔧 **COMO CONFIGURAR:**');
  console.log('');
  console.log('1. Acesse: https://platform.openai.com/api-keys');
  console.log('2. Faça login na sua conta OpenAI');
  console.log('3. Clique em "Create new secret key"');
  console.log('4. Copie a chave gerada');
  console.log('5. Abra o arquivo .env');
  console.log('6. Substitua a linha:');
  console.log('   OPENAI_API_KEY=mock_openai_key');
  console.log('7. Pela sua chave real:');
  console.log('   OPENAI_API_KEY=sk-...');
  console.log('');
  console.log('💡 **EXEMPLO:**');
  console.log('OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz');
  console.log('');
  console.log('⚠️  **IMPORTANTE:**');
  console.log('- Nunca compartilhe sua API key');
  console.log('- Não commite o arquivo .env no git');
  console.log('- A chave começa com "sk-"');
  console.log('');
  console.log('🧪 **APÓS CONFIGURAR:**');
  console.log('1. yarn dev');
  console.log('2. Teste o bot no Telegram');
  console.log('3. Verifique se está usando OpenAI real');
}

console.log('');
console.log('🔍 **VERIFICAÇÃO ATUAL**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar se a dependência está instalada
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasOpenAI = packageJson.dependencies && packageJson.dependencies.openai;
  
  if (hasOpenAI) {
    console.log('✅ Dependência OpenAI instalada');
  } else {
    console.log('❌ Dependência OpenAI não instalada');
    console.log('💡 Execute: yarn add openai');
  }
} else {
  console.log('❌ package.json não encontrado');
}

console.log('');
console.log('🎯 **TESTE RÁPIDO**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (currentKey && currentKey !== 'mock_openai_key') {
  console.log('Para testar se a API key funciona:');
  console.log('1. yarn dev');
  console.log('2. Envie uma mensagem para o bot no Telegram');
  console.log('3. Verifique os logs da aplicação');
  console.log('4. Se funcionar, você verá: "OpenAI Engine inicializado com sucesso"');
} else {
  console.log('Configure a API key primeiro para testar');
}

console.log('');
console.log('📚 **RECURSOS ÚTEIS**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('• Documentação OpenAI: https://platform.openai.com/docs');
console.log('• Preços: https://openai.com/pricing');
console.log('• Modelos disponíveis: https://platform.openai.com/docs/models');
console.log('• Exemplos de uso: https://platform.openai.com/examples');
console.log('');
console.log('💡 **DICA:** Comece com o modelo gpt-3.5-turbo (mais barato)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'); 