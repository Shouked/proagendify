import { PrismaClient } from '@prisma/client';
import { env } from './env'; // Para controle de logs

console.log("[PRISMA] Inicializando Prisma Client...");

let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: env.isProd ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  console.log("[PRISMA] Prisma Client inicializado com sucesso.");
} catch (e: any) {
  console.error("[PRISMA] FALHA CRÍTICA AO INICIALIZAR PRISMA CLIENT:", e.message);
  // Lançar o erro para parar a aplicação se a inicialização falhar
  throw new Error(`Falha ao inicializar Prisma Client: ${e.message}`);
}

// Exportar a instância inicializada
export { prisma }; 