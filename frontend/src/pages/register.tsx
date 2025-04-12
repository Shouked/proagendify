import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { postData } from '../lib/api';
import { useAuth } from '../components/AuthProvider';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const validateForm = () => {
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return false;
    }
    
    if (!email.trim()) {
      setError('O email é obrigatório.');
      return false;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, informe um email válido.');
      return false;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Primeiro, registra o usuário
      await postData('/auth/register', {
        name,
        email,
        password,
        role: 'professional',
        tenantId: Date.now().toString(), // Criar um ID de tenant único baseado no timestamp
      });

      // Em seguida, faz login automaticamente
      try {
        await login(email, password);
        router.push('/dashboard');
      } catch (loginError) {
        // Se o login falhar, redireciona para a página de login
        router.push('/login?registered=true');
      }
    } catch (error: any) {
      console.error('Registration error:', error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Este email já está em uso. Por favor, use um email diferente.');
      } else {
        setError('Ocorreu um erro ao criar sua conta. Tente novamente.');
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Head>
        <title>Registro | ProAgendify</title>
        <meta name="description" content="Crie sua conta no ProAgendify" />
      </Head>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">ProAgendify</span>
          </h1>
          <p className="mt-2 text-gray-600">Crie sua conta para começar</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome completo"
              />
            </div>

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
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">Mínimo de 6 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Eu concordo com os{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  termos de serviço
                </a>{' '}
                e{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  política de privacidade
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
