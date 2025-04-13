import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';

console.log("[PRISMA] Inicializando Prisma Client...");

// Registrar informações do ambiente
console.log("[PRISMA] Ambiente de execução:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  - __dirname: ${__dirname}`);
console.log(`  - process.cwd(): ${process.cwd()}`);

// Definir o caminho do binário
const clientPath = process.env.NODE_ENV === 'production'
  ? '/opt/render/project/src/backend/dist/prisma'
  : join(__dirname, '../node_modules/.prisma/client');

const enginePath = join(clientPath, 'query-engine-linux-musl-openssl-3.0.x');

if (!existsSync(enginePath)) {
  console.error(`[PRISMA] ERRO: Binário não encontrado em ${enginePath}`);
  throw new Error(`Prisma binary not found at ${enginePath}`);
} else {
  console.log(`[PRISMA] Binário encontrado: ${enginePath}`);
  process.env.PRISMA_QUERY_ENGINE_BINARY = enginePath;
}

// Inicializar o Prisma Client
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

// Função para inicializar e testar a conexão
async function initializePrisma() {
  try {
    console.log("[PRISMA] Testando conexão com o banco...");
    await prisma.$connect();
    console.log("[PRISMA] Conexão com o banco estabelecida com sucesso!");

    console.log("[PRISMA] Testando consulta ao modelo User...");
    await prisma.user.count();
    console.log("[PRISMA] Consulta ao modelo User bem-sucedida!");
  } catch (err) {
    console.error("[PRISMA] FALHA NA INICIALIZAÇÃO:", err);
    throw new Error(`Falha na inicialização do Prisma Client: ${err.message}`);
  }
}

// Executar inicialização
initializePrisma().catch((err) => {
  console.error("[PRISMA] Erro crítico:", err);
  process.exit(1);
});

export { prisma };