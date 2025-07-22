#!/usr/bin/env node

/**
 * Script para alternar entre Mock AI e OpenAI
 * Útil para desenvolvimento e quando quota é excedida
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 **ALTERNAR ENTRE MOCK AI E OPENAI**');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
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

// Encontrar a linha da OpenAI
const openaiLineIndex = lines.findIndex(line => line.startsWith('OPENAI_API_KEY='));
const currentKey = openaiLineIndex >= 0 ? lines[openaiLineIndex].split('=')[1] : null;

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);
const mode = args[0];

if (!mode || (mode !== 'mock' && mode !== 'openai' && mode !== 'ollama')) {
  console.log('❌ Modo não especificado ou inválido!');
  console.log('');
  console.log('🔧 **USO:**');
  console.log('   yarn switch:ai mock    - Usar Mock AI');
  console.log('   yarn switch:ai ollama  - Usar Ollama (local)');
  console.log('   yarn switch:ai openai  - Usar OpenAI');
  console.log('');
  console.log('📊 **STATUS ATUAL:**');
  
  if (currentKey && currentKey !== 'mock_openai_key') {
    console.log('   ✅ OpenAI configurado');
    console.log(`   Key: ${currentKey.substring(0, 10)}...`);
  } else {
    console.log('   🤖 Mock AI configurado');
  }
  
  console.log('');
  console.log('💡 **EXEMPLOS:**');
  console.log('   yarn switch:ai mock    # Para desenvolvimento ou quota excedida');
  console.log('   yarn switch:ai ollama  # Para IA local gratuita');
  console.log('   yarn switch:ai openai  # Para usar IA real');
  
  process.exit(1);
}

// Função para fazer backup
function createBackup() {
  const backupPath = envPath + '.backup';
  fs.copyFileSync(envPath, backupPath);
  console.log('💾 Backup criado: .env.backup');
}

// Função para alternar para Mock
function switchToMock() {
  if (currentKey === 'mock_openai_key') {
    console.log('🤖 Já está usando Mock AI');
    return;
  }
  
  createBackup();
  
  // Salvar a chave original
  const originalKeyPath = path.join(__dirname, '..', '.env.openai.key');
  if (currentKey && currentKey !== 'mock_openai_key') {
    fs.writeFileSync(originalKeyPath, currentKey);
    console.log('💾 Chave OpenAI salva em: .env.openai.key');
  }
  
  // Alterar para mock
  lines[openaiLineIndex] = 'OPENAI_API_KEY=mock_openai_key';
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log('✅ Alternado para Mock AI');
  console.log('');
  console.log('💡 **PRÓXIMOS PASSOS:**');
  console.log('1. Reinicie a aplicação: yarn dev');
  console.log('2. Teste o bot no Telegram');
  console.log('3. Para voltar ao OpenAI: yarn switch:ai openai');
}

// Função para alternar para Ollama
function switchToOllama() {
  // Verificar se Ollama está configurado
  const ollamaUrlLine = lines.find(line => line.startsWith('OLLAMA_BASE_URL='));
  const ollamaModelLine = lines.find(line => line.startsWith('OLLAMA_MODEL='));
  
  if (ollamaUrlLine && ollamaUrlLine.split('=')[1] !== 'mock_ollama_url') {
    console.log('🦙 Já está usando Ollama');
    return;
  }
  
  createBackup();
  
  // Configurar Ollama
  let ollamaUrlIndex = lines.findIndex(line => line.startsWith('OLLAMA_BASE_URL='));
  let ollamaModelIndex = lines.findIndex(line => line.startsWith('OLLAMA_MODEL='));
  
  if (ollamaUrlIndex === -1) {
    lines.push('OLLAMA_BASE_URL=http://localhost:11434');
  } else {
    lines[ollamaUrlIndex] = 'OLLAMA_BASE_URL=http://localhost:11434';
  }
  
  if (ollamaModelIndex === -1) {
    lines.push('OLLAMA_MODEL=llama2');
  } else {
    lines[ollamaModelIndex] = 'OLLAMA_MODEL=llama2';
  }
  
  // Desabilitar OpenAI
  lines[openaiLineIndex] = 'OPENAI_API_KEY=mock_openai_key';
  
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log('✅ Alternado para Ollama');
  console.log('URL: http://localhost:11434');
  console.log('Modelo: llama2');
  console.log('');
  console.log('💡 **PRÓXIMOS PASSOS:**');
  console.log('1. Instale o Ollama: https://ollama.ai/download');
  console.log('2. Baixe um modelo: ollama pull llama2');
  console.log('3. Inicie o servidor: ollama serve');
  console.log('4. Reinicie a aplicação: yarn dev');
  console.log('5. Para voltar ao Mock: yarn switch:ai mock');
}

// Função para alternar para OpenAI
function switchToOpenAI() {
  if (currentKey && currentKey !== 'mock_openai_key') {
    console.log('✅ Já está usando OpenAI');
    return;
  }
  
  createBackup();
  
  // Tentar restaurar chave salva
  const originalKeyPath = path.join(__dirname, '..', '.env.openai.key');
  let openaiKey = 'mock_openai_key';
  
  if (fs.existsSync(originalKeyPath)) {
    openaiKey = fs.readFileSync(originalKeyPath, 'utf8').trim();
    console.log('💾 Chave OpenAI restaurada do backup');
  } else {
    console.log('⚠️  Nenhuma chave OpenAI encontrada no backup');
    console.log('💡 Configure manualmente no arquivo .env:');
    console.log('   OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz');
    console.log('');
    console.log('🔗 Obter chave em: https://platform.openai.com/api-keys');
    return;
  }
  
  // Alterar para OpenAI
  lines[openaiLineIndex] = `OPENAI_API_KEY=${openaiKey}`;
  
  // Desabilitar Ollama
  const ollamaUrlIndex = lines.findIndex(line => line.startsWith('OLLAMA_BASE_URL='));
  if (ollamaUrlIndex !== -1) {
    lines[ollamaUrlIndex] = 'OLLAMA_BASE_URL=mock_ollama_url';
  }
  
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log('✅ Alternado para OpenAI');
  console.log(`Key: ${openaiKey.substring(0, 10)}...`);
  console.log('');
  console.log('💡 **PRÓXIMOS PASSOS:**');
  console.log('1. Reinicie a aplicação: yarn dev');
  console.log('2. Teste o bot no Telegram');
  console.log('3. Para voltar ao Mock: yarn switch:ai mock');
  console.log('4. Verificar status: yarn openai:status');
}

// Executar a alternância
if (mode === 'mock') {
  switchToMock();
} else if (mode === 'ollama') {
  switchToOllama();
} else if (mode === 'openai') {
  switchToOpenAI();
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💡 **DICA:** Use Mock AI para desenvolvimento e testes');
console.log('   Use OpenAI para produção e demonstrações');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'); 