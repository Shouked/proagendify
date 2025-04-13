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

    // Verificar binários específicos - agora procurando pelo nome sem extensão também
    const binaryFiles = files.filter(f => 
      f.includes('query-engine') || 
      f.includes('.so.node') || 
      f.includes('.dll') || 
      f.includes('.dylib')
    );
    console.log(`[PRISMA] Binários encontrados (${binaryFiles.length}):`, binaryFiles);
    
    // Configurar o Prisma para usar o binário correto
    if (binaryFiles.length > 0) {
      const linuxEngine = binaryFiles.find(f => f.includes('linux-musl') || f.includes('debian'));
      if (linuxEngine) {
        console.log(`[PRISMA] Configurando para usar o binário: ${linuxEngine}`);
        process.env.PRISMA_QUERY_ENGINE_BINARY = path.join(clientPath, linuxEngine);
        // Esta variável é importante para o Prisma encontrar o binário
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(clientPath, linuxEngine);
      }
    }
  } else {
    console.log("[PRISMA] Diretório do cliente não encontrado!");
  }
} catch (e: any) {
  console.error("[PRISMA] Erro ao verificar arquivos:", e.message);
}

// Força carregar o prisma/client da raiz do projeto ao invés do dist
process.env.NODE_PATH = path.join(__dirname, '../..');
require('module').Module._initPaths();

// Inicializar o Prisma Client
let prisma: PrismaClient;

try {
  // Adiciona um pequeno atraso para garantir que tudo esteja configurado
  setTimeout(() => {
    console.log("[PRISMA] Ambiente preparado, configurações aplicadas.");
  }, 500);
  
  prisma = new PrismaClient({
    log: env.isProd ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });
  console.log("[PRISMA] Prisma Client inicializado com sucesso.");
} catch (e: any) {
  console.error("[PRISMA] FALHA CRÍTICA AO INICIALIZAR PRISMA CLIENT:", e.message);
  console.error("[PRISMA] Stack trace:", e.stack);
  
  // Tentativa alternativa com __dirname absoluto
  try {
    console.log("[PRISMA] Tentando abordagem alternativa de inicialização...");
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.resolve('/opt/render/project/src/backend/node_modules/.prisma/client/query-engine-linux-musl-openssl-3.0.x');
    
    // Carregar o cliente diretamente do node_modules raiz
    const { PrismaClient: PrismaFallback } = require('/opt/render/project/src/node_modules/@prisma/client');
    prisma = new PrismaFallback({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });
    console.log("[PRISMA] Inicialização alternativa bem-sucedida!");
  } catch (fallbackError: any) {
    console.error("[PRISMA] Falha na inicialização alternativa:", fallbackError.message);
    throw new Error(`Falha ao inicializar Prisma Client: ${e.message}`);
  }
}

// Exportar a instância inicializada
export { prisma }; 