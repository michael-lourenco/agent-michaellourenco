import MockDatabase from '../database/mock';
import { User, Message, Conversation } from '../types';

describe('MockDatabase', () => {
  let database: MockDatabase;

  beforeEach(async () => {
    database = new MockDatabase();
    await database.connect();
  });

  afterEach(async () => {
    await database.disconnect();
  });

  describe('User Repository', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        phone: '+5511999999999',
        preferences: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notificationSettings: {
            email: true,
            push: true,
            sms: false,
          },
        },
      };

      const user = await database.getUserRepository().create(userData);
      
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.phone).toBe(userData.phone);
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('should find user by ID', async () => {
      const userData = {
        name: 'Test User',
        phone: '+5511999999999',
        preferences: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notificationSettings: {
            email: true,
            push: true,
            sms: false,
          },
        },
      };

      const createdUser = await database.getUserRepository().create(userData);
      const foundUser = await database.getUserRepository().findById(createdUser.id);
      
      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.name).toBe(createdUser.name);
    });

    it('should find user by phone', async () => {
      const userData = {
        name: 'Test User',
        phone: '+5511999999999',
        preferences: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notificationSettings: {
            email: true,
            push: true,
            sms: false,
          },
        },
      };

      await database.getUserRepository().create(userData);
      const foundUser = await database.getUserRepository().findByPhone('+5511999999999');
      
      expect(foundUser).toBeDefined();
      expect(foundUser?.phone).toBe('+5511999999999');
    });

    it('should update user', async () => {
      const userData = {
        name: 'Test User',
        phone: '+5511999999999',
        preferences: {
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notificationSettings: {
            email: true,
            push: true,
            sms: false,
          },
        },
      };

      const createdUser = await database.getUserRepository().create(userData);
      const updatedUser = await database.getUserRepository().update(createdUser.id, { name: 'Updated Name' });
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe('Updated Name');
    });
  });

  describe('Message Repository', () => {
    it('should create a new message', async () => {
      const messageData = {
        userId: 'test_user_1',
        channel: 'whatsapp' as const,
        content: 'Test message',
        direction: 'inbound' as const,
      };

      const message = await database.getMessageRepository().create(messageData);
      
      expect(message).toBeDefined();
      expect(message.id).toBeDefined();
      expect(message.userId).toBe(messageData.userId);
      expect(message.content).toBe(messageData.content);
      expect(message.timestamp).toBeDefined();
    });

    it('should find messages by user ID', async () => {
      const messageData = {
        userId: 'test_user_1',
        channel: 'whatsapp' as const,
        content: 'Test message',
        direction: 'inbound' as const,
      };

      await database.getMessageRepository().create(messageData);
      await database.getMessageRepository().create(messageData);
      
      const messages = await database.getMessageRepository().findByUserId('test_user_1');
      
      expect(messages).toBeDefined();
      expect(messages.length).toBe(2);
      expect(messages[0].userId).toBe('test_user_1');
    });
  });

  describe('Conversation Repository', () => {
    it('should create a new conversation', async () => {
      const conversationData = {
        userId: 'test_user_1',
        channel: 'whatsapp' as const,
        status: 'active' as const,
        messages: [],
      };

      const conversation = await database.getConversationRepository().create(conversationData);
      
      expect(conversation).toBeDefined();
      expect(conversation.id).toBeDefined();
      expect(conversation.userId).toBe(conversationData.userId);
      expect(conversation.status).toBe(conversationData.status);
      expect(conversation.createdAt).toBeDefined();
      expect(conversation.updatedAt).toBeDefined();
    });

    it('should find conversations by user ID', async () => {
      const conversationData = {
        userId: 'test_user_1',
        channel: 'whatsapp' as const,
        status: 'active' as const,
        messages: [],
      };

      await database.getConversationRepository().create(conversationData);
      await database.getConversationRepository().create(conversationData);
      
      const conversations = await database.getConversationRepository().findByUserId('test_user_1');
      
      expect(conversations).toBeDefined();
      expect(conversations.length).toBe(2);
      expect(conversations[0].userId).toBe('test_user_1');
    });

    it('should find conversations by status', async () => {
      const activeConversation = {
        userId: 'test_user_1',
        channel: 'whatsapp' as const,
        status: 'active' as const,
        messages: [],
      };

      const closedConversation = {
        userId: 'test_user_2',
        channel: 'telegram' as const,
        status: 'closed' as const,
        messages: [],
      };

      await database.getConversationRepository().create(activeConversation);
      await database.getConversationRepository().create(closedConversation);
      
      const activeConversations = await database.getConversationRepository().findByStatus('active');
      const closedConversations = await database.getConversationRepository().findByStatus('closed');
      
      expect(activeConversations.length).toBe(1);
      expect(closedConversations.length).toBe(1);
      expect(activeConversations[0].status).toBe('active');
      expect(closedConversations[0].status).toBe('closed');
    });
  });

  describe('Health Check', () => {
    it('should return true for health check', async () => {
      const isHealthy = await database.healthCheck();
      expect(isHealthy).toBe(true);
    });
  });
}); 