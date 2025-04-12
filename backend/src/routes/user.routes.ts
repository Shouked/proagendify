import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';

const userRoutes = Router();

// Aplicar middleware de autenticação em todas as rotas
userRoutes.use(ensureAuthenticated);

// Listar usuários (somente para superadmin)
userRoutes.get('/', async (request, response) => {
  const { role, tenantId } = request.user;

  if (role !== 'superadmin') {
    throw new AppError('Unauthorized', 403);
  }

  const users = await prisma.user.findMany({
    where: {
      tenantId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return response.json(users);
});

// Obter um usuário específico
userRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;
  const { role, tenantId } = request.user;

  const user = await prisma.user.findUnique({
    where: {
      id,
      tenantId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return response.json(user);
});

export { userRoutes };
