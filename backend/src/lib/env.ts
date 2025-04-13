/**
 * Helper para acessar variáveis de ambiente sem depender diretamente do objeto process.env
 */

// Usar any para evitar problemas com tipos durante a compilação no Render
const processEnv = (process.env as any);

// Verificar se estamos em produção ou desenvolvimento
const isProd = processEnv.NODE_ENV === 'production';

// Fazer um log das variáveis de ambiente (sem segredos) para facilitar debug
console.log(`[ENV] Ambiente: ${processEnv.NODE_ENV || 'development'}`);
console.log(`[ENV] Prisma: Database URL configurada: ${processEnv.DATABASE_URL ? 'Sim' : 'Não'}`);
console.log(`[ENV] Redis URL configurada: ${processEnv.REDIS_URL ? 'Sim' : 'Não'}`);
console.log(`[ENV] JWT Secret configurado: ${processEnv.JWT_SECRET ? 'Sim' : 'Não'}`);
console.log(`[ENV] Origens permitidas: ${processEnv.ALLOWED_ORIGINS || 'Padrão'}`);
console.log(`[ENV] Frontend URL: ${processEnv.FRONTEND_URL || 'http://localhost:3000'}`);

export const env = {
  NODE_ENV: processEnv.NODE_ENV || 'development',
  PORT: processEnv.PORT || '3333',
  JWT_SECRET: processEnv.JWT_SECRET || 'default-secret-key-for-dev-only',
  JWT_EXPIRES_IN: processEnv.JWT_EXPIRES_IN || '1d',
  DATABASE_URL: processEnv.DATABASE_URL || '',
  REDIS_URL: processEnv.REDIS_URL || '',
  ALLOWED_ORIGINS: processEnv.ALLOWED_ORIGINS || 'http://localhost:3000',
  FRONTEND_URL: processEnv.FRONTEND_URL || 'http://localhost:3000',
  
  // Helpers
  isProd: isProd,
  isDev: !isProd,
  
  // Função helper para obter qualquer variável de ambiente
  get: (key: string, defaultValue: string = ''): string => {
    return processEnv[key] || defaultValue;
  }
}; 