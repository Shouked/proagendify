import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';

const clientRoutes = Router();

// Aplicar middleware de autenticação em todas as rotas
clientRoutes.use(ensureAuthenticated);

// Listar clientes
clientRoutes.get('/', async (request, response) => {
  const { tenantId } = request.user;

  const clients = await prisma.client.findMany({
    where: {
      tenantId,
    },
  });

  return response.json(clients);
});

// Obter um cliente específico
clientRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;
  const { tenantId } = request.user;

  const client = await prisma.client.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  return response.json(client);
});

// Criar um novo cliente
clientRoutes.post('/', async (request, response) => {
  const { name, email, phone, notes } = request.body;
  const { tenantId } = request.user;

  const client = await prisma.client.create({
    data: {
      name,
      email,
      phone,
      notes,
      tenantId,
    },
  });

  return response.status(201).json(client);
});

// Atualizar um cliente
clientRoutes.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { name, email, phone, notes } = request.body;
  const { tenantId } = request.user;

  const clientExists = await prisma.client.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!clientExists) {
    throw new AppError('Client not found', 404);
  }

  const client = await prisma.client.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      phone,
      notes,
    },
  });

  return response.json(client);
});

// Excluir um cliente
clientRoutes.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const { tenantId } = request.user;

  const clientExists = await prisma.client.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!clientExists) {
    throw new AppError('Client not found', 404);
  }

  await prisma.client.delete({
    where: {
      id,
    },
  });

  return response.status(204).send();
});

export { clientRoutes };
