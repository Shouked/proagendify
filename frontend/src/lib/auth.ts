import axios from 'axios';
import React from 'react';

const API_URL = 'https://proagendify.onrender.com/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Funções para gerenciar o token no localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Funções para gerenciar o usuário no localStorage
export const setUser = (user: User): void => {
  localStorage.setItem('auth_user', JSON.stringify(user));
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
  localStorage.removeItem('auth_user');
};

// Funções de autenticação
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
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Função para verificar autenticação e redirecionar se necessário
export const withAuth = (Component: React.ComponentType<any>) => {
  const AuthComponent = (props: any) => {
    // Verificar autenticação apenas no lado do cliente
    if (typeof window !== 'undefined') {
      if (!isAuthenticated()) {
        console.log('Auth: Redirecionando para login (não autenticado)');
        window.location.href = '/login';
        return null;
      }
    }
    
    return React.createElement(Component, props);
  };
  
  return AuthComponent;
}; 