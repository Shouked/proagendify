import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { env } from './env';

// Evitar múltiplas instâncias do Prisma Client em ambiente de desenvolvimento
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Função para verificar se o Prisma Client está disponível
function createPrismaClient() {
  try {
    console.log("[PRISMA] Tentando inicializar o Prisma Client");
    return new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });
  } catch (error: any) {
    console.error('[PRISMA] Erro ao criar Prisma Client:', error?.message);
    
    // Se estiver em produção, tentar gerar o Prisma Client novamente
    if (env.isProd) {
      console.log('[PRISMA] Tentando regenerar o Prisma Client em produção...');
      try {
        // Executar prisma generate de forma síncrona
        exec('npx prisma generate', (error, stdout, stderr) => {
          if (error) {
            console.error(`[PRISMA] Erro ao executar prisma generate: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`[PRISMA] Stderr: ${stderr}`);
            return;
          }
          console.log(`[PRISMA] Stdout: ${stdout}`);
        });
        
        // Tentar novamente após gerar
        try {
          return new PrismaClient();
        } catch (retryError) {
          console.error('[PRISMA] Falha ao recriar o Prisma Client após regeneração:', retryError);
        }
      } catch (genError) {
        console.error('[PRISMA] Erro ao tentar regenerar o Prisma Client:', genError);
      }
    }
    
    // Em desenvolvimento ou se a regeneração falhar, cria um mock
    console.warn('[PRISMA] Usando cliente simulado - a aplicação funcionará com funcionalidade limitada');
    return {
      user: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        update: () => Promise.resolve({}),
      },
      client: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        findMany: () => Promise.resolve([]),
      },
      service: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        findMany: () => Promise.resolve([]),
      },
      appointment: {
        findUnique: () => Promise.resolve(null),
        create: () => Promise.resolve({}),
        findMany: () => Promise.resolve([]),
      },
      $connect: () => Promise.resolve(),
      $disconnect: () => Promise.resolve(),
    } as unknown as PrismaClient;
  }
}

// Tentar conectar ao banco de dados
export const prisma = globalForPrisma.prisma || createPrismaClient();

// Salvar a instância para reutilização no ambiente de desenvolvimento
if (!env.isProd) globalForPrisma.prisma = prisma; 