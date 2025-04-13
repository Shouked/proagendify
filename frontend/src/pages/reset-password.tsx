import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Obter o token da URL
    if (router.isReady) {
      const { token } = router.query;
      if (token && typeof token === 'string') {
        setToken(token);
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Token de redefinição inválido ou ausente. Solicite um novo link de redefinição de senha.' 
        });
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos
    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
      await axios.post(`${apiUrl}/auth/reset-password`, { token, password });
      
      setMessage({ 
        type: 'success', 
        text: 'Senha redefinida com sucesso! Você será redirecionado para a página de login.' 
      });
      
      // Redirecionar para a página de login após 3 segundos
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      
      const errorMsg = error.response?.data?.message || 
                       'Não foi possível redefinir sua senha. O token pode ter expirado ou ser inválido.';
      
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Head>
        <title>Redefinir Senha | ProAgendify</title>
        <meta name="description" content="Redefina sua senha do ProAgendify" />
      </Head>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">ProAgendify</span>
          </h1>
          <p className="mt-2 text-gray-600">Redefinição de senha</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          {message && (
            <div 
              className={`mb-4 p-3 rounded-md border ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nova senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                disabled={!token || isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirme a nova senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                disabled={!token || isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={!token || isSubmitting}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 