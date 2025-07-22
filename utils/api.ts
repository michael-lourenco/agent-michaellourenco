// Utilitário para gerenciar chamadas da API
export class ApiClient {
  private static getApiBaseUrl(): string {
    // Em desenvolvimento, usa localhost
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:3000';
    }
    
    // Em produção, usa a variável de ambiente ou fallback
    return process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-url.vercel.app';
  }

  static async createSession(userId: string): Promise<any> {
    const apiUrl = this.getApiBaseUrl();
    console.log('Criando sessão com API:', apiUrl);
    
    try {
      const response = await fetch(`${apiUrl}/api/webchat/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      throw error;
    }
  }

  static async sendMessage(sessionId: string, content: string, userId: string): Promise<any> {
    const apiUrl = this.getApiBaseUrl();
    console.log('Enviando mensagem para API:', apiUrl);
    
    try {
      const requestBody = {
        sessionId,
        content,
        userId,
      };
      
      console.log('Enviando requisição:', requestBody);
      
      const response = await fetch(`${apiUrl}/api/webchat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  static async getHistory(sessionId: string): Promise<any> {
    const apiUrl = this.getApiBaseUrl();
    
    try {
      const response = await fetch(`${apiUrl}/api/webchat/history/${sessionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter histórico:', error);
      throw error;
    }
  }
} 