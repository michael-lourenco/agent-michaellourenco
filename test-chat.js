// Script de teste para verificar a API do chat
const API_BASE = 'http://localhost:3000';

async function testChatAPI() {
  console.log('🧪 Testando API do Chat...\n');

  try {
    // 1. Criar sessão
    console.log('1. Criando sessão...');
    const userId = `test_user_${Date.now()}`;
    const sessionResponse = await fetch(`${API_BASE}/api/webchat/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!sessionResponse.ok) {
      throw new Error(`Erro ao criar sessão: ${sessionResponse.status}`);
    }

    const sessionData = await sessionResponse.json();
    console.log('✅ Sessão criada:', sessionData.sessionId);

    // 2. Enviar mensagem
    console.log('\n2. Enviando mensagem...');
    const messageResponse = await fetch(`${API_BASE}/api/webchat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionData.sessionId,
        content: 'Quem é Michael Lourenço?',
        userId: userId
      })
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      throw new Error(`Erro ao enviar mensagem: ${messageResponse.status} - ${errorText}`);
    }

    const messageData = await messageResponse.json();
    console.log('✅ Mensagem enviada e processada');
    console.log('🤖 Resposta da IA:', messageData.aiResponse?.content?.substring(0, 100) + '...');

    // 3. Verificar histórico
    console.log('\n3. Verificando histórico...');
    const historyResponse = await fetch(`${API_BASE}/api/webchat/history/${sessionData.sessionId}`);
    
    if (!historyResponse.ok) {
      throw new Error(`Erro ao obter histórico: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();
    console.log('✅ Histórico obtido:', historyData.history?.length, 'mensagens');

    console.log('\n🎉 Todos os testes passaram! A API está funcionando corretamente.');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    process.exit(1);
  }
}

// Executar teste
testChatAPI(); 