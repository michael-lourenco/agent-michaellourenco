import { Router } from 'express';
import healthRoutes from './health';
import messagingRoutes from './messaging';
import aiRoutes from './ai';
import webInterfaceRoutes from './web-interface';

const router = Router();

// Rotas de saúde
router.use('/health', healthRoutes);

// Rotas de mensagens
router.use('/messaging', messagingRoutes);

// Rotas de IA
router.use('/ai', aiRoutes);

// Rotas da interface web
router.use('/web', webInterfaceRoutes);

export default router; 