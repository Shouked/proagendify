/**
 * Helper para acessar variáveis de ambiente sem depender diretamente do objeto process.env
 */

// Usar any para evitar problemas com tipos durante a compilação no Render
const processEnv = (process.env as any);

export const env = {
  NODE_ENV: processEnv.NODE_ENV || 'development',
  PORT: processEnv.PORT || '3333',
  JWT_SECRET: processEnv.JWT_SECRET || 'default-secret-key-for-dev-only',
  DATABASE_URL: processEnv.DATABASE_URL || '',
  
  // Função helper para obter qualquer variável de ambiente
  get: (key: string, defaultValue: string = ''): string => {
    return processEnv[key] || defaultValue;
  }
}; 