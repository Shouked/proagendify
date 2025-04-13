import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { env } from '../lib/env';

interface TokenPayload {
  id: string;
  role: string;
  tenantId: string;
  iat: number;
  exp: number;
  sub: string;
}

// Esquemas de validação com zod
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['superadmin', 'professional', 'client']).optional(),
  tenantId: z.string().min(1, 'Tenant ID is required'),
});

export class AuthController {
  async login(request: Request, response: Response) {
    try {
      console.log('[AuthController] Iniciando login:', request.body);

      // Validar entrada
      const { email, password } = loginSchema.parse(request.body);

      console.log('[AuthController] Buscando usuário:', email);
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log('[AuthController] Usuário não encontrado:', email);
        throw new AppError('Invalid credentials', 401);
      }

      console.log('[AuthController] Comparando senhas...');
      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        console.log('[AuthController] Senha inválida para:', email);
        throw new AppError('Invalid credentials', 401);
      }

      console.log('[AuthController] Gerando token JWT...');
      const token = sign(
        {
          id: user.id,
          role: user.role,
          tenantId: user.tenantId,
        },
        env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: '1d',
        },
      );

      console.log('[AuthController] Login bem-sucedido:', user.id);
      return response.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
        token,
      });
    } catch (error) {
      console.error('[AuthController] Erro no login:', error);
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.errors,
        });
      }
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async register(request: Request, response: Response) {
    try {
      console.log('[AuthController] Iniciando registro:', request.body);

      // Validar entrada
      const { name, email, password, role, tenantId } = registerSchema.parse(request.body);

      console.log('[AuthController] Verificando se usuário existe:', email);
      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        console.log('[AuthController] Usuário já existe:', email);
        throw new AppError('User already exists', 400);
      }

      console.log('[AuthController] Hashing senha...');
      const hashedPassword = await hash(password, 8);

      console.log('[AuthController] Criando usuário...');
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'client', // Valor padrão se não fornecido
          tenantId,
        },
      });

      console.log('[AuthController] Gerando token JWT...');
      const token = sign(
        {
          id: user.id,
          role: user.role,
          tenantId: user.tenantId,
        },
        env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: '1d',
        },
      );

      console.log('[AuthController] Registro bem-sucedido:', user.id);
      return response.status(201).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
        token,
      });
    } catch (error) {
      console.error('[AuthController] Erro no registro:', error);
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          status: 'error',
          message: 'Validation error',
          errors: error.errors,
        });
      }
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async me(request: Request, response: Response) {
    try {
      console.log('[AuthController] Iniciando me:', request.user);
      const { id } = request.user;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          tenantId: true,
        },
      });

      if (!user) {
        console.log('[AuthController] Usuário não encontrado:', id);
        throw new AppError('User not found', 404);
      }

      return response.json(user);
    } catch (error) {
      console.error('[AuthController] Erro no me:', error);
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async refreshToken(request: Request, response: Response) {
    try {
      console.log('[AuthController] Iniciando refreshToken:', request.body);
      const { token } = request.body;

      const decoded = verify(token, env.JWT_SECRET) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        console.log('[AuthController] Usuário não encontrado:', decoded.id);
        throw new AppError('User not found', 404);
      }

      const newToken = sign(
        {
          id: user.id,
          role: user.role,
          tenantId: user.tenantId,
        },
        env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: '1d',
        },
      );

      console.log('[AuthController] Token atualizado:', user.id);
      return response.json({ token: newToken });
    } catch (error) {
      console.error('[AuthController] Erro no refreshToken:', error);
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      return response.status(401).json({
        status: 'error',
        message: 'Invalid token',
      });
    }
  }

  async forgotPassword(request: Request, response: Response) {
    try {
      console.log('[AuthController] Iniciando forgotPassword:', request.body);
      const { email } = request.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log('[AuthController] Usuário não encontrado:', email);
        throw new AppError('User not found', 404);
      }

      // TODO: Implementar envio de e-mail com token de recuperação
      console.log('[AuthController] Envio de e-mail pendente para:', email);
      return response.json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('[AuthController] Erro no forgotPassword:', error);
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async resetPassword(request: Request, response: Response) {
    try {
      console.log('[AuthController] Iniciando resetPassword:', request.body);
      const { token, password } = request.body;

      // TODO: Implementar validação do token e atualização da senha
      console.log('[AuthController] Reset de senha pendente:', { token });
      return response.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('[AuthController] Erro no resetPassword:', error);
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }

  async changePassword(request: Request, response: Response) {
    try {
      console.log('[AuthController] Iniciando changePassword:', request.body);
      const { id } = request.user;
      const { oldPassword, newPassword } = request.body;

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        console.log('[AuthController] Usuário não encontrado:', id);
        throw new AppError('User not found', 404);
      }

      console.log('[AuthController] Comparando senhas...');
      const passwordMatch = await compare(oldPassword, user.password);

      if (!passwordMatch) {
        console.log('[AuthController] Senha antiga inválida:', id);
        throw new AppError('Invalid password', 401);
      }

      console.log('[AuthController] Hashing nova senha...');
      const hashedPassword = await hash(newPassword, 8);

      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword },
      });

      console.log('[AuthController] Senha alterada com sucesso:', id);
      return response.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('[AuthController] Erro no changePassword:', error);
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  }
}