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
          expiresIn: env.JWT_EXPIRES_IN,
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
          expiresIn: env.JWT_EXPIRES_IN,
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
      console.log('[AuthController] Iniciando refreshToken');
      
      // Obter o token do cabeçalho de autorização
      const authHeader = request.headers.authorization;
      
      if (!authHeader) {
        throw new AppError('JWT token is missing', 401);
      }
      
      const [, token] = authHeader.split(' ');
      
      try {
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
            expiresIn: env.JWT_EXPIRES_IN,
          },
        );
        
        console.log('[AuthController] Token atualizado:', user.id);
        return response.json({ token: newToken });
      } catch (error) {
        console.error('[AuthController] Token inválido ou expirado');
        throw new AppError('Invalid token', 401);
      }
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
      
      // Validação básica
      const forgotSchema = z.object({
        email: z.string().email('Invalid email format'),
      });
      
      const { email } = forgotSchema.parse(request.body);
      
      const user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!user) {
        console.log('[AuthController] Usuário não encontrado:', email);
        // Não revelar se o e-mail existe ou não por razões de segurança
        return response.json({ message: 'Password reset email sent if user exists' });
      }
      
      // Gerar token para redefinição de senha (em prod, use um token específico para esse fim)
      const resetToken = sign(
        {
          id: user.id,
          role: user.role,
          purpose: 'password_reset',
        },
        env.JWT_SECRET,
        {
          subject: user.id,
          expiresIn: '1h', // Token de reset expira em 1 hora
        },
      );
      
      // Em um cenário de produção real, aqui você enviaria um e-mail com o link de redefinição
      const resetLink = `${env.get('FRONTEND_URL', 'http://localhost:3000')}/reset-password?token=${resetToken}`;
      
      console.log('[AuthController] Link de reset gerado (não enviado em desenvolvimento):', resetLink);
      
      // Em desenvolvimento, retornamos o token para fins de teste
      if (env.isDev) {
        return response.json({ 
          message: 'Password reset email would be sent in production',
          dev_token: resetToken, // Apenas para desenvolvimento!
          reset_link: resetLink
        });
      }
      
      // Em produção, simplesmente confirme que o email foi enviado
      return response.json({ message: 'Password reset email sent if user exists' });
    } catch (error) {
      console.error('[AuthController] Erro no forgotPassword:', error);
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

  async resetPassword(request: Request, response: Response) {
    try {
      console.log('[AuthController] Iniciando resetPassword:', request.body);
      
      // Validação básica
      const resetSchema = z.object({
        token: z.string().min(1, 'Token is required'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      });
      
      const { token, password } = resetSchema.parse(request.body);
      
      try {
        // Verificar o token (em uma implementação real, você usaria um token específico para reset)
        const decoded = verify(token, env.JWT_SECRET) as TokenPayload;
        
        // Encontrar o usuário
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });
        
        if (!user) {
          console.log('[AuthController] Usuário não encontrado:', decoded.id);
          throw new AppError('User not found', 404);
        }
        
        // Hash a nova senha
        const hashedPassword = await hash(password, 8);
        
        // Atualizar a senha do usuário
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });
        
        console.log('[AuthController] Senha redefinida com sucesso:', user.id);
        return response.json({ message: 'Password reset successful' });
      } catch (error) {
        console.error('[AuthController] Token inválido ou expirado');
        throw new AppError('Invalid or expired token', 401);
      }
    } catch (error) {
      console.error('[AuthController] Erro no resetPassword:', error);
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