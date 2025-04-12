import { Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
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

export class AuthController {
  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Invalid credentials', 401);
    }

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
  }

  async register(request: Request, response: Response) {
    const { name, email, password, role, tenantId } = request.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        tenantId,
      },
    });

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
  }

  async me(request: Request, response: Response) {
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
      throw new AppError('User not found', 404);
    }

    return response.json(user);
  }

  async refreshToken(request: Request, response: Response) {
    const { token } = request.body;

    try {
      const decoded = verify(token, env.JWT_SECRET) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
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

      return response.json({ token: newToken });
    } catch {
      throw new AppError('Invalid token', 401);
    }
  }

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // TODO: Implementar envio de e-mail com token de recuperação

    return response.json({ message: 'Password reset email sent' });
  }

  async resetPassword(request: Request, response: Response) {
    const { token, password } = request.body;

    // TODO: Implementar validação do token e atualização da senha

    return response.json({ message: 'Password reset successful' });
  }

  async changePassword(request: Request, response: Response) {
    const { id } = request.user;
    const { oldPassword, newPassword } = request.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const passwordMatch = await compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new AppError('Invalid password', 401);
    }

    const hashedPassword = await hash(newPassword, 8);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return response.json({ message: 'Password updated successfully' });
  }
}
