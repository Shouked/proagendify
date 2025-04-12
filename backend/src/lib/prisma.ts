import { PrismaClient } from '@prisma/client';
import { env } from './env'; // Para controle de logs
import * as fs from 'fs';
import * as path from 'path';

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
      
      // Verificar a existência dos arquivos para diagnóstico
      try {
        const enginePath = "/opt/render/project/src/backend/node_modules/.prisma/client";
        console.log("[PRISMA] Verificando arquivos em:", enginePath);
        if (fs.existsSync(enginePath)) {
          const files = fs.readdirSync(enginePath);
          console.log("[PRISMA] Arquivos encontrados:", files);
        } else {
          console.log("[PRISMA] Diretório não encontrado:", enginePath);
        }
      } catch (fsError: any) {
        console.error("[PRISMA] Erro ao listar arquivos:", fsError.message);
      }
      
      // Redefinir PrismaClient para evitar problemas de cache
      const PrismaClientRetry = PrismaClient;
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