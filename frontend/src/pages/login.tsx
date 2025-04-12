import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login: Usuário já autenticado, redirecionando para dashboard');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Login: Iniciando processo de login com', email);

    try {
      console.log('Login: Chamando API via hook useAuth');
      await login(email, password);
      
      console.log('Login: Login bem-sucedido, redirecionando para dashboard');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login: Erro durante login:', err.message);
      
      // Exibir mensagem amigável baseada no erro
      if (err.response?.status === 401) {
        setError('Credenciais inválidas. Verifique seu email e senha.');
      } else {
        setError(`Erro ao fazer login: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Head>
        <title>Login | ProAgendify</title>
        <meta name="description" content="Faça login na sua conta ProAgendify" />
      </Head>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">ProAgendify</span>
          </h1>
          <p className="mt-2 text-gray-600">Entre na sua conta para continuar</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-500">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
