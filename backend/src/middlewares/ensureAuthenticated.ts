import { Request, Response, NextFunction } from 'express';
import { verify, TokenExpiredError } from 'jsonwebtoken';
import { AppError } from '../errors/AppError';
import { env } from '../lib/env';

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

  const [scheme, token] = authHeader.split(' ');
  
  if (!/^Bearer$/i.test(scheme)) {
    throw new AppError('Token malformatted', 401);
  }

  try {
    const decoded = verify(token, env.JWT_SECRET) as TokenPayload;

    request.user = {
      id: decoded.id,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AppError('Token expired', 401);
    }
    throw new AppError('Invalid JWT token', 401);
  }
} 