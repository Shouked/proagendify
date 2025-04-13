import axios from 'axios';
import { createContext } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Funções para gerenciar o token no localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Funções para gerenciar o usuário no localStorage
export const setUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('auth_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Erro ao parsear usuário do localStorage:', e);
    return null;
  }
};

export const removeUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user');
  }
};

// Funções de autenticação para compatibilidade com código existente
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  console.log('Auth: Iniciando login direto via API');
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  
  console.log('Auth: Login bem-sucedido, salvando dados');
  const { user, token } = response.data;
  setToken(token);
  setUser(user);
  
  return response.data;
};

export const logout = (): void => {
  console.log('Auth: Fazendo logout');
  removeToken();
  removeUser();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Para compatibilidade com código existente, deixamos o withAuth para ser implementado no AuthProvider 