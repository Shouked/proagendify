import { PrismaClient } from '@prisma/client';
import { env } from './env'; // Para controle de logs
import * as fs from 'fs';
import * as path from 'path';

console.log("[PRISMA] Inicializando Prisma Client...");

// Verificar arquivos presentes para diagnóstico
try {
  const clientPath = path.join(__dirname, '../node_modules/.prisma/client');
  console.log(`[PRISMA] Verificando arquivos em: ${clientPath}`);
  
  if (fs.existsSync(clientPath)) {
    const files = fs.readdirSync(clientPath);
    console.log(`[PRISMA] Arquivos encontrados (${files.length}):`, files);

    // Verificar binários específicos
    const binaryFiles = files.filter(f => f.includes('.so.node') || f.includes('.dll') || f.includes('.dylib'));
    console.log(`[PRISMA] Binários encontrados (${binaryFiles.length}):`, binaryFiles);
  } else {
    console.log("[PRISMA] Diretório do cliente não encontrado!");
  }
} catch (e: any) {
  console.error("[PRISMA] Erro ao verificar arquivos:", e.message);
}

// Inicializar o Prisma Client
let prisma: PrismaClient;

try {
  prisma = new PrismaClient({
    log: env.isProd ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  console.log("[PRISMA] Prisma Client inicializado com sucesso.");
} catch (e: any) {
  console.error("[PRISMA] FALHA CRÍTICA AO INICIALIZAR PRISMA CLIENT:", e.message);
  console.error("[PRISMA] Stack trace:", e.stack);
  throw new Error(`Falha ao inicializar Prisma Client: ${e.message}`);
}

// Exportar a instância inicializada
export { prisma }; 