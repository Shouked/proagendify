import { PrismaClient } from '@prisma/client';

// Evitar múltiplas instâncias do Prisma Client em ambiente de desenvolvimento
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Função para verificar se o Prisma Client está disponível
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: ['error'],
    });
  } catch (error) {
    console.error('Erro ao criar Prisma Client:', error);
    
    // Se estiver em produção, relançar o erro
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    
    // Em desenvolvimento, cria um mock temporário para não quebrar a aplicação
    return {
      user: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve({}),
      },
      client: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        findMany: () => Promise.resolve([]),
      },
      service: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        findMany: () => Promise.resolve([]),
      },
      appointment: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        findMany: () => Promise.resolve([]),
      },
      $connect: () => Promise.resolve(),
      $disconnect: () => Promise.resolve(),
    } as unknown as PrismaClient;
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 