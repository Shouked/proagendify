import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { clientRoutes } from './client.routes';
import { serviceRoutes } from './service.routes';
import { appointmentRoutes } from './appointment.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);

export { router as routes }; 