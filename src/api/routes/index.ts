import { Router } from 'express';
import healthRoutes from './health';
import messagingRoutes from './messaging';
import aiRoutes from './ai';
import webInterfaceRoutes from './web-interface';
import telegramRoutes from './telegram';
import webchatRoutes from './webchat';

const router = Router();

// Rotas de saúde
router.use('/health', healthRoutes);

// Rotas de mensagens
router.use('/messaging', messagingRoutes);

// Rotas de IA
router.use('/ai', aiRoutes);

// Rotas da interface web
router.use('/web', webInterfaceRoutes);

// Rotas do Telegram
router.use('/telegram', telegramRoutes);

// Rotas do WebChat
router.use('/webchat', webchatRoutes);

export default router; 