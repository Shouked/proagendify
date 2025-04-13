import { PrismaClient } from '@prisma/client';
import { statSync, readdirSync, existsSync, chmodSync } from 'fs';
import { join } from 'path';

console.log("[PRISMA] Inicializando Prisma Client...");

// Registrar informações do ambiente
console.log("[PRISMA] Ambiente de execução:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  - __dirname: ${__dirname}`);
console.log(`  - process.cwd(): ${process.cwd()}`);

// Definir o caminho do cliente Prisma
const clientPath = process.env.NODE_ENV === 'production'
  ? '/opt/render/project/src/backend/dist/node_modules/.prisma/client'
  : join(__dirname, '../node_modules/.prisma/client');

console.log(`[PRISMA] Usando diretório do cliente: ${clientPath}`);

if (!existsSync(clientPath)) {
  console.error(`[PRISMA] ERRO: Diretório do cliente Prisma não encontrado em ${clientPath}`);
} else {
  // Verificar arquivos no diretório
  try {
    const files = readdirSync(clientPath);
    console.log(`[PRISMA] Arquivos encontrados (${files.length}):`, files);

    // Verificar e corrigir permissões dos binários
    const engineFiles = files.filter(f => f.startsWith('query-engine-'));
    if (engineFiles.length > 0) {
      console.log(`[PRISMA] Motores de consulta encontrados (${engineFiles.length}):`, engineFiles);

      engineFiles.forEach(file => {
        const filePath = join(clientPath, file);
        try {
          const stats = statSync(filePath);
          const isExecutable = !!(stats.mode & 0o111);
          console.log(`[PRISMA] Engine ${file}: Tamanho=${stats.size}, Executável=${isExecutable}, Modo=${stats.mode.toString(8)}`);

          if (!isExecutable) {
            chmodSync(filePath, 0o755);
            console.log(`[PRISMA] Permissões aplicadas a ${file}`);
          }
        } catch (statErr) {
          console.error(`[PRISMA] Erro ao verificar ${file}:`, statErr);
        }
      });

      // Configurar o binário específico para o Render
      const linuxEngine = engineFiles.find(f => f.includes('linux-musl-openssl-3.0.x'));
      if (linuxEngine) {
        const enginePath = join(clientPath, linuxEngine);
        console.log(`[PRISMA] Configurando engine: ${enginePath}`);
        process.env.PRISMA_QUERY_ENGINE_BINARY = enginePath;
      } else {
        console.error("[PRISMA] AVISO: Binário linux-musl-openssl-3.0.x não encontrado!");
      }
    } else {
      console.error("[PRISMA] AVISO: Nenhum motor de consulta encontrado!");
    }
  } catch (fsErr) {
    console.error("[PRISMA] Erro ao listar arquivos:", fsErr);
  }
}

// Inicializar o Prisma Client
let prisma: PrismaClient;

try {
  console.log("[PRISMA] Tentando inicializar PrismaClient...");
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  console.log("[PRISMA] PrismaClient inicializado com sucesso!");
} catch (err: any) {
  console.error("[PRISMA] FALHA NA INICIALIZAÇÃO:", err.message);
  console.error("[PRISMA] Stack trace:", err.stack);
  throw new Error(`Falha na inicialização do Prisma Client: ${err.message}`);
}

export { prisma };