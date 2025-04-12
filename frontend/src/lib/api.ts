import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getToken } from './auth';

// Definindo a URL base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

// Criação da instância do axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // timeout padrão de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de requisições para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptador de respostas para tratar erros comuns
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      // O servidor retornou um código de status diferente de 2xx
      const { status } = error.response;
      
      // Tratamento para erros de autenticação
      if (status === 401) {
        // Se o usuário não estiver autenticado, redirecionar para login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }
      }
      
      // Tratamento para erros de permissão
      if (status === 403) {
        console.error('Erro de permissão:', error.response.data);
      }
      
      // Tratamento para erros de validação
      if (status === 422) {
        console.error('Erro de validação:', error.response.data);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro de conexão com o servidor:', error.request);
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error('Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Funções de requisição tipadas
export async function fetchData<T>(url: string, config?: any): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

export async function postData<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

export async function putData<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

export async function patchData<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.patch<T>(url, data, config);
  return response.data;
}

export async function deleteData<T>(url: string, config?: any): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
}

// Exportar a instância da API para uso direto, se necessário
export default api; 