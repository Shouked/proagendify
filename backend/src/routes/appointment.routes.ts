import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';

const appointmentRoutes = Router();

// Aplicar middleware de autenticação em todas as rotas
appointmentRoutes.use(ensureAuthenticated);

// Listar agendamentos
appointmentRoutes.get('/', async (request, response) => {
  const { tenantId } = request.user;

  const appointments = await prisma.appointment.findMany({
    where: {
      tenantId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
  });

  return response.json(appointments);
});

// Obter um agendamento específico
appointmentRoutes.get('/:id', async (request, response) => {
  const { id } = request.params;
  const { tenantId } = request.user;

  const appointment = await prisma.appointment.findUnique({
    where: {
      id,
      tenantId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
  });

  if (!appointment) {
    throw new AppError('Appointment not found', 404);
  }

  return response.json(appointment);
});

// Criar um novo agendamento
appointmentRoutes.post('/', async (request, response) => {
  const { clientId, serviceId, date, notes } = request.body;
  const { tenantId } = request.user;

  // Verificar se o cliente existe
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
      tenantId,
    },
  });

  if (!client) {
    throw new AppError('Client not found', 404);
  }

  // Verificar se o serviço existe
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
      tenantId,
    },
  });

  if (!service) {
    throw new AppError('Service not found', 404);
  }

  const appointment = await prisma.appointment.create({
    data: {
      clientId,
      serviceId,
      date: new Date(date),
      status: 'scheduled',
      notes,
      tenantId,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
  });

  return response.status(201).json(appointment);
});

// Atualizar um agendamento
appointmentRoutes.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { clientId, serviceId, date, status, notes } = request.body;
  const { tenantId } = request.user;

  const appointmentExists = await prisma.appointment.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!appointmentExists) {
    throw new AppError('Appointment not found', 404);
  }

  // Verificar se o cliente existe, se foi fornecido
  if (clientId) {
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
        tenantId,
      },
    });

    if (!client) {
      throw new AppError('Client not found', 404);
    }
  }

  // Verificar se o serviço existe, se foi fornecido
  if (serviceId) {
    const service = await prisma.service.findUnique({
      where: {
        id: serviceId,
        tenantId,
      },
    });

    if (!service) {
      throw new AppError('Service not found', 404);
    }
  }

  const appointment = await prisma.appointment.update({
    where: {
      id,
    },
    data: {
      clientId,
      serviceId,
      date: date ? new Date(date) : undefined,
      status,
      notes,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
        },
      },
    },
  });

  return response.json(appointment);
});

// Cancelar um agendamento
appointmentRoutes.patch('/:id/cancel', async (request, response) => {
  const { id } = request.params;
  const { tenantId } = request.user;

  const appointmentExists = await prisma.appointment.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!appointmentExists) {
    throw new AppError('Appointment not found', 404);
  }

  const appointment = await prisma.appointment.update({
    where: {
      id,
    },
    data: {
      status: 'canceled',
    },
  });

  return response.json(appointment);
});

// Completar um agendamento
appointmentRoutes.patch('/:id/complete', async (request, response) => {
  const { id } = request.params;
  const { tenantId } = request.user;

  const appointmentExists = await prisma.appointment.findUnique({
    where: {
      id,
      tenantId,
    },
  });

  if (!appointmentExists) {
    throw new AppError('Appointment not found', 404);
  }

  const appointment = await prisma.appointment.update({
    where: {
      id,
    },
    data: {
      status: 'completed',
    },
  });

  return response.json(appointment);
});

export { appointmentRoutes };
