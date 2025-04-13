import { PrismaClient } from '@prisma/client';
import { env } from './env';
import { statSync, readdirSync, existsSync, chmodSync } from 'fs';
import { join, resolve } from 'path';

console.log("[PRISMA] Inicializando Prisma Client...");

// Registrar informações do ambiente
console.log("[PRISMA] Ambiente de execução:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  - __dirname: ${__dirname}`);
console.log(`  - process.cwd(): ${process.cwd()}`);

// Definir possíveis caminhos onde o Prisma Client pode estar
const possiblePaths = [
  join(__dirname, '../node_modules/.prisma/client'),
  join(process.cwd(), 'node_modules/.prisma/client'),
  '/opt/render/project/src/backend/node_modules/.prisma/client',
  '/opt/render/project/src/node_modules/.prisma/client'
];

// Encontrar o primeiro caminho válido
let clientPath = '';
for (const path of possiblePaths) {
  if (existsSync(path)) {
    clientPath = path;
    console.log(`[PRISMA] Diretório do cliente encontrado: ${clientPath}`);
    break;
  }
}

if (!clientPath) {
  console.error("[PRISMA] ERRO: Nenhum diretório do cliente Prisma encontrado!");
} else {
  // Verificar arquivos no diretório
  try {
    const files = readdirSync(clientPath);
    console.log(`[PRISMA] Arquivos encontrados (${files.length}):`, files);

    // Verificar e corrigir permissões dos binários
    const engineFiles = files.filter(f => f.startsWith('query-engine-'));
    if (engineFiles.length > 0) {
      console.log(`[PRISMA] Motores de consulta encontrados (${engineFiles.length}):`, engineFiles);
      
      // Verificar permissões
      engineFiles.forEach(file => {
        const filePath = join(clientPath, file);
        try {
          const stats = statSync(filePath);
          const isExecutable = !!(stats.mode & 0o111);
          console.log(`[PRISMA] Engine ${file}: Tamanho=${stats.size}, Executável=${isExecutable}, Modo=${stats.mode.toString(8)}`);
          
          // Forçar permissões executáveis
          if (!isExecutable) {
            chmodSync(filePath, 0o755);
            console.log(`[PRISMA] Permissões aplicadas a ${file}`);
          }
        } catch (statErr) {
          console.error(`[PRISMA] Erro ao verificar ${file}:`, statErr);
        }
      });
      
      // Definir variáveis de ambiente para ajudar o Prisma a encontrar o binário
      const linuxEngine = engineFiles.find(f => f.includes('linux-musl-openssl-3.0.x'));
      if (linuxEngine) {
        const enginePath = join(clientPath, linuxEngine);
        console.log(`[PRISMA] Configurando engine: ${enginePath}`);
        process.env.PRISMA_QUERY_ENGINE_BINARY = enginePath;
        process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
      }
    } else {
      console.error("[PRISMA] AVISO: Nenhum motor de consulta encontrado!");
    }
  } catch (fsErr) {
    console.error("[PRISMA] Erro ao listar arquivos:", fsErr);
  }
}

// Inicialização simplificada
let prisma: PrismaClient;

try {
  console.log("[PRISMA] Tentando inicializar PrismaClient...");
  
  // Opções de configuração com logs simplificados
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  });
  
  console.log("[PRISMA] PrismaClient inicializado com sucesso!");
} catch (err: any) {
  console.error("[PRISMA] FALHA NA INICIALIZAÇÃO:", err.message);
  console.error("[PRISMA] Stack trace:", err.stack);
  
  throw new Error(`Falha na inicialização do Prisma Client: ${err.message}`);
}

export { prisma }; 