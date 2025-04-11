import axios from 'axios';
import { getToken, logout } from './auth';

// Garantir que a URL base esteja corretamente formatada
const API_URL = 'https://proagendify.onrender.com/api';

console.log(`Configurando API com baseURL: ${API_URL}`);

// Criamos uma instância do axios
export const api = axios.create({
  baseURL: API_URL,
});

// Flag para verificar se estamos no navegador
const isBrowser = typeof window !== 'undefined';

// Adicionamos um interceptor para todas as requisições
api.interceptors.request.use(
  (config) => {
    console.log('[API] Enviando requisição para:', config.url);
    
    // Apenas tentamos obter o token no navegador
    if (isBrowser) {
      const token = getToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[API] Token adicionado ao cabeçalho');
      } else {
        console.log('[API] Nenhum token disponível');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('[API] Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    console.log('[API] Resposta recebida:', response.status);
    return response;
  },
  (error) => {
    console.error('[API] Erro na resposta:', error.message);
    
    // Se receber erro 401 (não autorizado)
    if (error.response?.status === 401) {
      console.log('[API] Erro 401 - Redirecionando para login');
      if (isBrowser) {
        logout(); // Remove o token e redireciona para login
      }
    }
    
    return Promise.reject(error);
  }
); 