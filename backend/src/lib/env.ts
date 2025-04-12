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
console.log(`[ENV] JWT Secret configurado: ${processEnv.JWT_SECRET ? 'Sim' : 'Não'}`);

export const env = {
  NODE_ENV: processEnv.NODE_ENV || 'development',
  PORT: processEnv.PORT || '3333',
  JWT_SECRET: processEnv.JWT_SECRET || 'default-secret-key-for-dev-only',
  DATABASE_URL: processEnv.DATABASE_URL || '',
  
  // Helpers
  isProd: isProd,
  isDev: !isProd,
  
  // Função helper para obter qualquer variável de ambiente
  get: (key: string, defaultValue: string = ''): string => {
    return processEnv[key] || defaultValue;
  }
}; 