import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const authRoutes = Router();
const authController = new AuthController();

// Rotas públicas
authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register);

// Rota para refresh token
authRoutes.post('/refresh-token', authController.refreshToken);

// Rota para recuperação de senha
authRoutes.post('/forgot-password', authController.forgotPassword);
authRoutes.post('/reset-password', authController.resetPassword);

// Rotas protegidas
authRoutes.get('/me', ensureAuthenticated, authController.me);
authRoutes.post('/change-password', ensureAuthenticated, authController.changePassword);

export { authRoutes }; 