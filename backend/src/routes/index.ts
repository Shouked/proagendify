import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { clientRoutes } from './client.routes';
import { serviceRoutes } from './service.routes';
import { appointmentRoutes } from './appointment.routes';
import { env } from '../lib/env';
import { prisma } from '../lib/prisma';

const router = Router();

// Rota de health check para verificar se o servidor está funcionando
router.get('/health-check', async (req, res) => {
  try {
    // Verificar conexão com o banco de dados
    const dbStatus = await prisma.$queryRaw`SELECT 1 as status`;
    
    return res.json({
      status: 'success',
      message: 'Backend está funcionando corretamente',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      database: {
        status: 'connected',
        check: dbStatus
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Backend está funcionando, mas há problemas com o banco de dados',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      database: {
        status: 'disconnected',
        error: error.message
      }
    });
  }
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);

export { router as routes }; 