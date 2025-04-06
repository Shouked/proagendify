import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

interface TokenPayload {
  id: string;
  role: string;
  tenantId: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    request.user = {
      id: decoded.id,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
} 