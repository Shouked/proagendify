import axios from 'axios';
import { getSession } from 'next-auth/react';

// Garantir que a URL base tenha /api
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseURL = apiBaseUrl?.endsWith('/api') 
  ? apiBaseUrl 
  : `${apiBaseUrl}/api`;

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
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch (error) {
        console.error('Erro ao obter a sessão:', error);
      }
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