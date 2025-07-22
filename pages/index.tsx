import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Head>
        <title>Michael Lourenço - AI Agent</title>
        <meta name="description" content="Agente de IA especializado em informações sobre Michael Lourenço - Desenvolvedor Backend Senior" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800">
              Michael Lourenço
            </div>
            <div className="flex space-x-6">
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">
                Sobre
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contato
              </a>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Agente de IA
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Conheça Michael Lourenço através de um agente de inteligência artificial 
              especializado em suas informações profissionais e projetos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/chat"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isHovered ? '🚀 Iniciar Conversa' : '💬 Conversar com IA'}
              </Link>
              
              <a 
                href="#features"
                className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
              >
                Saiba Mais
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Como Funciona
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">IA Especializada</h3>
                <p className="text-gray-600">
                  Agente treinado com informações detalhadas sobre Michael Lourenço, 
                  incluindo experiência, projetos e habilidades.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Conversa Natural</h3>
                <p className="text-gray-600">
                  Faça perguntas de forma natural e receba respostas precisas 
                  sobre qualquer aspecto da carreira e projetos.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Multiplataforma</h3>
                <p className="text-gray-600">
                  Acesse através do chat web ou integre com outras plataformas 
                  como Telegram para máxima flexibilidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="container mx-auto px-4 py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Sobre o Projeto
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Este é um projeto de demonstração de um agente de inteligência artificial 
              construído com tecnologias modernas como Node.js, TypeScript e Next.js. 
              O agente utiliza técnicas avançadas de processamento de linguagem natural 
              para fornecer informações precisas sobre Michael Lourenço.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Tecnologias</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Node.js & TypeScript</li>
                  <li>• Next.js & React</li>
                  <li>• Express.js & APIs REST</li>
                  <li>• Integração com IA (Hugging Face)</li>
                  <li>• Telegram Bot API</li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Funcionalidades</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Chat web responsivo</li>
                  <li>• Integração com Telegram</li>
                  <li>• Base de conhecimento estruturada</li>
                  <li>• Processamento de linguagem natural</li>
                  <li>• Arquitetura multi-canal</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pronto para Conversar?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Experimente o agente de IA e descubra mais sobre Michael Lourenço 
              de forma interativa e envolvente.
            </p>
            <Link 
              href="/chat"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Iniciar Conversa Agora
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-4">Michael Lourenço</h3>
            <p className="text-gray-400 mb-6">
              Desenvolvedor Backend Senior | Especialista em Node.js, Python, AWS e GCP
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <a href="mailto:kontempler@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                📧 Email
              </a>
              <a href="https://github.com/michael-lourenco" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                📱 GitHub
              </a>
              <a href="https://www.linkedin.com/in/michael-lourenco/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                💼 LinkedIn
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Michael Lourenço. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
} 