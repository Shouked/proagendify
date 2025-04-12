import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContextType, isAuthenticated } from '../lib/auth';

interface AuthProviderProps {
  children: ReactNode;
  value: AuthContextType;
}

export const AuthProviderComponent = ({ children, value }: AuthProviderProps) => {
  return (
    <>{children}</>
  );
};

interface AuthComponentProps {
  Component: React.ComponentType<any>;
  props: any;
}

export const AuthComponent = ({ Component, props }: AuthComponentProps) => {
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