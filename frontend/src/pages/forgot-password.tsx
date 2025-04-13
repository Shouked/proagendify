import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, informe seu e-mail' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
      const response = await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      
      setMessage({ 
        type: 'success', 
        text: 'Se o e-mail existir em nossa base de dados, enviaremos instruções para redefinir sua senha.' 
      });
      
      // Em ambiente de desenvolvimento, mostrar o token para testes
      if (process.env.NODE_ENV !== 'production' && response.data.dev_token) {
        console.log('Link de redefinição:', response.data.reset_link);
      }
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      setMessage({ 
        type: 'error', 
        text: 'Não foi possível processar sua solicitação. Tente novamente mais tarde.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Head>
        <title>Recuperar Senha | ProAgendify</title>
        <meta name="description" content="Recupere sua senha do ProAgendify" />
      </Head>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <span className="text-blue-600">ProAgendify</span>
          </h1>
          <p className="mt-2 text-gray-600">Recuperação de senha</p>
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu@email.com"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Enviaremos um link para redefinir sua senha.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
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