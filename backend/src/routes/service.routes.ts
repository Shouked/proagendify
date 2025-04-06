import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';

const serviceRoutes = Router();

// Aplicar middleware de autenticação em todas as rotas
serviceRoutes.use(ensureAuthenticated);

// Listar serviços
serviceRoutes.get('/', async (request, response) => {
  const { tenantId } = request.user;

  const services = await prisma.service.findMany({
    where: {
      tenantId,
    },
  });

  return response.json(services);
});

// Obter um serviço específico
serviceRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;
  const { tenantId } = request.user;

  const service = await prisma.service.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  return response.json(service);
});

// Criar um novo serviço
serviceRoutes.post('/', async (request, response) => {
  const { name, price, duration, description } = request.body;
  const { tenantId } = request.user;

  const service = await prisma.service.create({
    data: {
      name,
      price,
      duration,
      description,
      tenantId,
    },
  });

  return response.status(201).json(service);
});

// Atualizar um serviço
serviceRoutes.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { name, price, duration, description } = request.body;
  const { tenantId } = request.user;

  const serviceExists = await prisma.service.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!serviceExists) {
    throw new AppError('Service not found', 404);
  }

  const service = await prisma.service.update({
    where: {
      id,
    },
    data: {
      name,
      price,
      duration,
      description,
    },
  });

  return response.json(service);
});

// Excluir um serviço
serviceRoutes.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const { tenantId } = request.user;

  const serviceExists = await prisma.service.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!serviceExists) {
    throw new AppError('Service not found', 404);
  }

  await prisma.service.delete({
    where: {
      id,
    },
  });

  return response.status(204).send();
});

export { serviceRoutes };
