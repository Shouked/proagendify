import axios from 'axios';
import { getSession } from 'next-auth/react';

// Garantir que a URL base esteja corretamente formatada
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
// Remove a barra no final, se existir
const cleanUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
const baseURL = `${cleanUrl}/api`;

console.log(`Configurando API com baseURL: ${baseURL}`);

// Criamos uma instância do axios
export const api = axios.create({
  baseURL,
});

// Flag para verificar se estamos no navegador
const isBrowser = typeof window !== 'undefined';

// Adicionamos um interceptor para todas as requisições
api.interceptors.request.use(
  async (config) => {
    // Apenas tentamos obter a sessão no navegador
    if (isBrowser) {
      console.log('[API Interceptor] Tentando obter sessão para:', config.url);
      try {
        const session = await getSession();
        console.log('[API Interceptor] Sessão obtida:', session);
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
          console.log('[API Interceptor] Cabeçalho Authorization adicionado.');
        } else {
          console.warn('[API Interceptor] Sessão encontrada, mas sem accessToken.');
        }
      } catch (error) {
        console.error('[API Interceptor] Erro ao obter a sessão:', error);
      }
    } else {
      console.log('[API Interceptor] Não estamos no browser, pulando getSession.');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isBrowser && error.response?.status === 401) {
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
); 