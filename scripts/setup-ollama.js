#!/usr/bin/env node

/**
 * Script para configurar o Ollama
 * IA local gratuita como alternativa à OpenAI
 */

const fs = require('fs');
const path = require('path');

console.log('🦙 **CONFIGURAÇÃO DO OLLAMA**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

console.log('🎯 **O QUE É O OLLAMA?**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('• IA local que roda no seu computador');
console.log('• Totalmente gratuito (sem custos de API)');
console.log('• Modelos como Llama 2, Mistral, CodeLlama');
console.log('• Funciona offline');
console.log('• Privacidade total (dados ficam no seu PC)');
console.log('');

const envPath = path.join(__dirname, '..', '.env');

// Verificar se o arquivo .env existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  console.log('💡 Execute: cp env.example .env');
  process.exit(1);
}

// Ler o arquivo .env
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

// Verificar configuração atual
const ollamaUrlLine = lines.find(line => line.startsWith('OLLAMA_BASE_URL='));
const ollamaModelLine = lines.find(line => line.startsWith('OLLAMA_MODEL='));

const currentUrl = ollamaUrlLine ? ollamaUrlLine.split('=')[1] : null;
const currentModel = ollamaModelLine ? ollamaModelLine.split('=')[1] : null;

console.log('📊 **CONFIGURAÇÃO ATUAL**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (currentUrl && currentUrl !== 'mock_ollama_url') {
  console.log('✅ Ollama configurado!');
  console.log(`URL: ${currentUrl}`);
  console.log(`Modelo: ${currentModel || 'llama2'}`);
} else {
  console.log('⚠️  Ollama não configurado');
}

console.log('');
console.log('🚀 **COMO INSTALAR O OLLAMA**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('1. **Instalar Ollama:**');
console.log('   Acesse: https://ollama.ai/download');
console.log('   Baixe para seu sistema operacional');
console.log('   Instale seguindo as instruções');
console.log('');

console.log('2. **Baixar um modelo:**');
console.log('   # Modelo recomendado (equilibrado)');
console.log('   ollama pull llama2');
console.log('');
console.log('   # Modelo mais rápido');
console.log('   ollama pull mistral');
console.log('');
console.log('   # Modelo para código');
console.log('   ollama pull codellama');
console.log('');

console.log('3. **Testar instalação:**');
console.log('   ollama run llama2 "Olá, como você está?"');
console.log('');

console.log('4. **Configurar no projeto:**');
console.log('   Edite o arquivo .env e adicione:');
console.log('   OLLAMA_BASE_URL=http://localhost:11434');
console.log('   OLLAMA_MODEL=llama2');
console.log('');

console.log('🔧 **CONFIGURAÇÃO AUTOMÁTICA**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Verificar se precisa configurar
if (!currentUrl || currentUrl === 'mock_ollama_url') {
  console.log('📝 Configurando Ollama no .env...');
  
  // Encontrar ou criar linhas do Ollama
  let ollamaUrlIndex = lines.findIndex(line => line.startsWith('OLLAMA_BASE_URL='));
  let ollamaModelIndex = lines.findIndex(line => line.startsWith('OLLAMA_MODEL='));
  
  if (ollamaUrlIndex === -1) {
    // Adicionar linha do OLLAMA_BASE_URL
    lines.push('OLLAMA_BASE_URL=http://localhost:11434');
  } else {
    lines[ollamaUrlIndex] = 'OLLAMA_BASE_URL=http://localhost:11434';
  }
  
  if (ollamaModelIndex === -1) {
    // Adicionar linha do OLLAMA_MODEL
    lines.push('OLLAMA_MODEL=llama2');
  } else {
    lines[ollamaModelIndex] = 'OLLAMA_MODEL=llama2';
  }
  
  // Salvar arquivo
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log('✅ Ollama configurado no .env!');
  console.log('   OLLAMA_BASE_URL=http://localhost:11434');
  console.log('   OLLAMA_MODEL=llama2');
} else {
  console.log('✅ Ollama já está configurado!');
}

console.log('');
console.log('🧪 **TESTE RÁPIDO**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('1. **Iniciar Ollama:**');
console.log('   ollama serve');
console.log('');
console.log('2. **Em outro terminal, testar:**');
console.log('   yarn dev');
console.log('');
console.log('3. **Testar no Telegram:**');
console.log('   Envie uma mensagem para o bot');
console.log('   Verifique os logs da aplicação');
console.log('');

console.log('📊 **COMPARAÇÃO DE MODELOS**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('| Modelo | Tamanho | Velocidade | Qualidade | Uso Recomendado |');
console.log('|--------|---------|------------|-----------|-----------------|');
console.log('| llama2 | 3.8GB | Média | Boa | Geral |');
console.log('| mistral | 4.1GB | Rápida | Muito Boa | Geral |');
console.log('| codellama | 6.7GB | Lenta | Excelente | Código |');
console.log('| llama2:7b | 3.8GB | Rápida | Boa | Desenvolvimento |');
console.log('| llama2:13b | 7.3GB | Média | Muito Boa | Produção |');
console.log('');

console.log('💡 **DICAS IMPORTANTES**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('• **Primeira execução:** Pode demorar para baixar o modelo');
console.log('• **Requisitos:** Pelo menos 8GB de RAM livre');
console.log('• **GPU:** Opcional, mas acelera muito (NVIDIA)');
console.log('• **Internet:** Só para baixar modelos (depois funciona offline)');
console.log('• **Privacidade:** 100% local, dados não saem do seu PC');
console.log('');

console.log('🔄 **ALTERNAR ENTRE IAs**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('• **Mock AI:** yarn switch:ai mock');
console.log('• **Ollama:** yarn switch:ai ollama');
console.log('• **OpenAI:** yarn switch:ai openai');
console.log('');

console.log('📚 **RECURSOS ÚTEIS**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('• Documentação: https://ollama.ai/docs');
console.log('• Modelos disponíveis: https://ollama.ai/library');
console.log('• Comunidade: https://github.com/ollama/ollama');
console.log('• Troubleshooting: https://ollama.ai/docs/troubleshooting');
console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💡 **DICA:** Ollama é perfeito para desenvolvimento e testes!');
console.log('   Use OpenAI apenas para produção ou demonstrações.');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'); 