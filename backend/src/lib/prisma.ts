import { PrismaClient, Prisma } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';

console.log("[PRISMA] Inicializando Prisma Client...");

// Registrar informações do ambiente
console.log("[PRISMA] Ambiente de execução:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  - __dirname: ${__dirname}`);
console.log(`  - process.cwd(): ${process.cwd()}`);

// Definir possíveis caminhos do binário
const possiblePaths = [
  // Caminho no ambiente de produção do Render (a partir do diretório dist)
  join(process.cwd(), 'dist/prisma/query-engine-linux-musl-openssl-3.0.x'),
  // Caminho relativo ao diretório atual
  join(__dirname, '../../dist/prisma/query-engine-linux-musl-openssl-3.0.x'),
  // Caminho no ambiente de desenvolvimento
  join(process.cwd(), 'node_modules/.prisma/client/query-engine-linux-musl-openssl-3.0.x')
];

// Encontrar o binário
let enginePath: string | null = null;
for (const path of possiblePaths) {
  console.log(`[PRISMA] Verificando binário em: ${path}`);
  if (existsSync(path)) {
    enginePath = path;
    console.log(`[PRISMA] Binário encontrado: ${enginePath}`);
    break;
  }
}

if (!enginePath) {
  console.error(`[PRISMA] ERRO: Binário não encontrado em nenhum caminho verificado`);
  throw new Error(`Prisma binary not found in any of the checked paths`);
}

// Configurar o caminho do binário
process.env.PRISMA_QUERY_ENGINE_BINARY = enginePath;

// Inicializar o Prisma Client
const prismaOptions: Prisma.PrismaClientOptions = {
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
};

// Criar o cliente
const prisma = new PrismaClient(prismaOptions);

// Testar conexão apenas se não estiver em modo de build
if (process.env.NODE_ENV !== 'test' && !process.env.SKIP_PRISMA_CONNECT) {
  // Função para inicializar e testar a conexão
  async function initializePrisma() {
    try {
      console.log("[PRISMA] Testando conexão com o banco...");
      await prisma.$connect();
      console.log("[PRISMA] Conexão com o banco estabelecida com sucesso!");

      console.log("[PRISMA] Testando consulta ao modelo User...");
      await prisma.user.count();
      console.log("[PRISMA] Consulta ao modelo User bem-sucedida!");
    } catch (err: unknown) {
      console.error("[PRISMA] FALHA NA INICIALIZAÇÃO:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Falha na inicialização do Prisma Client: ${errorMessage}`);
    }
  }

  // Executar inicialização
  initializePrisma().catch((err: unknown) => {
    console.error("[PRISMA] Erro crítico:", err);
    process.exit(1);
  });
}

export { prisma };