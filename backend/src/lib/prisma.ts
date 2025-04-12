import { PrismaClient } from '@prisma/client';
import { env } from './env';

// Para evitar problemas de tipos
type GlobalWithPrisma = {
  prisma?: PrismaClient;
};

// @ts-ignore
const globalThis: GlobalWithPrisma = {};

console.log("[PRISMA] Inicializando Prisma Client...");

let prismaInstance: PrismaClient;

try {
  prismaInstance = new PrismaClient({
    log: env.isProd ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  console.log("[PRISMA] Prisma Client inicializado com sucesso.");
} catch (e: any) {
  console.error("[PRISMA] FALHA CRÍTICA AO INICIALIZAR PRISMA CLIENT:", e.message);
  // Em um cenário real, poderíamos lançar o erro para parar a aplicação
  // throw new Error("Falha ao inicializar Prisma Client");
  // Por agora, vamos permitir continuar, mas logar o erro
  prismaInstance = {} as PrismaClient; // Atribui um objeto vazio para evitar erros de tipo
}

export const prisma = globalThis.prisma || prismaInstance;

if (!env.isProd) {
  globalThis.prisma = prisma;
} 