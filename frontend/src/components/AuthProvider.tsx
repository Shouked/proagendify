import React, { useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { 
  AuthContext, 
  AuthContextType, 
  User, 
  setToken, 
  getToken, 
  setUser, 
  getUser, 
  removeToken, 
  removeUser, 
  isAuthenticated 
} from '../lib/auth';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Configurar interceptor para refresh token
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
    
    // Configurar interceptor de resposta para lidar com erros de token expirado
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Se for erro 401 (não autorizado) e não for uma tentativa de refresh token
        if (error.response?.status === 401 && 
            !originalRequest._retry && 
            originalRequest.url !== `${apiUrl}/auth/refresh-token`) {
          
          originalRequest._retry = true;
          
          try {
            // Tentar renovar o token
            const token = getToken();
            if (token) {
              const refreshResponse = await axios.post(`${apiUrl}/auth/refresh-token`, {}, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              
              const newToken = refreshResponse.data.token;
              setToken(newToken);
              
              // Atualizar o cabeçalho da requisição original e reenviar
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Se falhar o refresh, fazer logout
            logoutUser();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Limpar interceptor quando o componente for desmontado
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    // Verificar autenticação quando o componente montar
    const checkAuth = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = getToken();
        const savedUser = getUser();
        
        if (token && savedUser) {
          // Validar o token no servidor
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
          try {
            await axios.get(`${apiUrl}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            setUserState(savedUser);
          } catch (error) {
            console.error('Erro ao validar token:', error);
            // Se o token for inválido ou expirado, fazer logout silencioso
            removeToken();
            removeUser();
          }
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        setError('Erro ao verificar autenticação');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });
      
      const userData = response.data.user;
      const token = response.data.token;
      
      setToken(token);
      setUser(userData);
      setUserState(userData);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    removeToken();
    removeUser();
    setUserState(null);
    router.push('/login');
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginUser,
    logout: logoutUser,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Higher-order component para páginas protegidas
export const withAuth = (Component: React.ComponentType<any>) => {
  const WithAuthComponent = (props: any) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    
    useEffect(() => {
      // Verificar autenticação apenas no lado do cliente
      if (typeof window !== 'undefined') {
        if (!isAuthenticated()) {
          console.log('Auth: Redirecionando para login (não autenticado)');
          router.push('/login');
        } else {
          setIsChecking(false);
        }
      }
    }, [router]);
    
    if (isChecking) {
      // Adicionar um componente de carregamento aqui se desejar
      return <div>Carregando...</div>;
    }
    
    return <Component {...props} />;
  };
  
  return WithAuthComponent;
}; 