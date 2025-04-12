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
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação quando o componente montar
    const checkAuth = async () => {
      setIsLoading(true);
      const token = getToken();
      const savedUser = getUser();
      
      if (token && savedUser) {
        setUserState(savedUser);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
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
      setIsLoading(false);
      
      return response.data;
    } catch (error) {
      setIsLoading(false);
      throw error;
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
    isAuthenticated: !!user,
    login: loginUser,
    logout: logoutUser,
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