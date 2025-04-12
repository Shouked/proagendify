import { PrismaClient } from '@prisma/client';
import { env } from './env'; // Para controle de logs

console.log("[PRISMA] Inicializando Prisma Client...");

let prisma: PrismaClient;

try {
  // Tenta inicializar o PrismaClient normalmente
  prisma = new PrismaClient({
    log: env.isProd ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  console.log("[PRISMA] Prisma Client inicializado com sucesso.");
} catch (e: any) {
  console.error("[PRISMA] Erro ao inicializar Prisma Client:", e.message);
  
  // No ambiente de produção, tentativa alternativa de inicialização
  if (env.isProd) {
    try {
      console.log("[PRISMA] Tentando inicialização alternativa para ambiente de produção...");
      
      // Força Prisma a usar o diretório correto no Render
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = "/opt/render/project/src/backend/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node";
      process.env.PRISMA_SCHEMA_ENGINE_LIBRARY = "/opt/render/project/src/backend/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node";
      
      // Redefinir PrismaClient para evitar problemas de cache
      const { PrismaClient: PrismaClientRetry } = require('@prisma/client');
      prisma = new PrismaClientRetry({
        log: ['error', 'warn'],
        errorFormat: 'pretty',
      });
      console.log("[PRISMA] Prisma Client inicializado com sucesso pela rota alternativa!");
    } catch (retryError: any) {
      console.error("[PRISMA] FALHA CRÍTICA NA INICIALIZAÇÃO ALTERNATIVA:", retryError.message);
      throw new Error(`Falha ao inicializar Prisma Client: ${retryError.message}`);
    }
  } else {
    // Em desenvolvimento, lançar o erro original
    throw new Error(`Falha ao inicializar Prisma Client: ${e.message}`);
  }
}

// Exportar a instância inicializada
export { prisma }; 