import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ApiClient } from '../utils/api';

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeSession();
  }, []);

  const [userId, setUserId] = useState<string>('');

  const initializeSession = async () => {
    try {
      setError(null);
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setUserId(newUserId);
      
      const data = await ApiClient.createSession(newUserId);
      setSessionId(data.sessionId);
      setIsInitializing(false);
      console.log('Sessão criada com sucesso:', data.sessionId);
    } catch (error) {
      console.error('Erro ao inicializar sessão:', error);
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
      setIsInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: inputMessage,
      timestamp: new Date(),
      direction: 'outbound',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const data = await ApiClient.sendMessage(sessionId, inputMessage, userId);
      
      if (data.success && data.aiResponse) {
        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          content: data.aiResponse.content,
          timestamp: new Date(),
          direction: 'inbound',
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
        direction: 'inbound',
      };
      setMessages(prev => [...prev, errorMessage]);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isInitializing) {
    return (
      <>
        <Head>
          <title>Chat - Michael Lourenço AI Agent</title>
          <meta name="description" content="Converse com o agente de IA sobre Michael Lourenço" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Inicializando sessão...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Chat - Michael Lourenço AI Agent</title>
        <meta name="description" content="Converse com o agente de IA sobre Michael Lourenço" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                ← Voltar
              </Link>
              <h1 className="text-xl font-semibold text-gray-800">Chat com IA</h1>
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 px-4 py-3">
            <div className="max-w-4xl mx-auto">
              <p className="text-red-800 text-sm">
                ⚠️ {error}
              </p>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Olá! Sou o agente de IA do Michael Lourenço
                </h2>
                <p className="text-gray-600 mb-6">
                  Faça perguntas sobre minha experiência, projetos, habilidades ou qualquer outro aspecto da minha carreira.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
                  <p className="text-sm text-blue-800 font-medium mb-2">💡 Exemplos de perguntas:</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• "Quem é Michael Lourenço?"</li>
                    <li>• "Quais são suas principais competências?"</li>
                    <li>• "Em que empresas você trabalhou?"</li>
                    <li>• "Quais projetos você desenvolveu?"</li>
                  </ul>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                    message.direction === 'outbound'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Digitando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Container */}
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta sobre Michael Lourenço..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Enviar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Pressione Enter para enviar, Shift+Enter para nova linha
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 