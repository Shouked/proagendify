import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);
authRoutes.post('/refresh-token', authController.refreshToken);
authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password', authController.resetPassword);

// Rotas protegidas
authRoutes.use(ensureAuthenticated);
authRoutes.get('/me', authController.me);
authRoutes.put('/change-password', authController.changePassword);

export { authRoutes }; 