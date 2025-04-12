import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { clientRoutes } from './client.routes';
import { serviceRoutes } from './service.routes';
import { appointmentRoutes } from './appointment.routes';

const router = Router();

// Rota de health check para verificar se o servidor está funcionando
router.get('/health-check', (req, res) => {
  return res.json({
    status: 'success',
    message: 'Backend está funcionando corretamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);

export { router as routes }; 