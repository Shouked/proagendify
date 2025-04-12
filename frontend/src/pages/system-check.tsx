import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Link from 'next/link';

interface CheckResult {
  status: string;
  message: string;
  timestamp?: string;
  apiUrl?: string;
  error?: string;
}

export default function SystemCheck() {
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCheck = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verificar diretamente através do API route do Next.js
      const result = await axios.get('/api/check-backend');
      setCheckResult(result.data);
    } catch (err: any) {
      console.error('Erro ao verificar o backend:', err);
      setError(err.message || 'Erro desconhecido ao verificar o backend');
      setCheckResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Executar verificação automaticamente ao carregar a página
    runCheck();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Verificação do Sistema | ProAgendify</title>
        <meta name="description" content="Verificação de conectividade do sistema" />
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Verificação do Sistema <span className="text-blue-600">ProAgendify</span>
          </h1>
          <p className="mt-2 text-gray-600">
            Esta página verifica se o frontend consegue se conectar ao backend corretamente
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Status da Conectividade</h2>
            <button
              onClick={runCheck}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Verificando...' : 'Verificar Novamente'}
            </button>
          </div>

          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
              <p className="font-medium">Erro na verificação:</p>
              <p>{error}</p>
            </div>
          )}

          {checkResult && (
            <div className={`p-4 rounded-md border ${
              checkResult.status === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <p className="font-medium mb-2">
                Status: <span className="capitalize">{checkResult.status}</span>
              </p>
              <p className="mb-2">Mensagem: {checkResult.message}</p>
              {checkResult.apiUrl && (
                <p className="mb-2">URL da API: {checkResult.apiUrl}</p>
              )}
              {checkResult.timestamp && (
                <p className="mb-2">
                  Timestamp: {new Date(checkResult.timestamp).toLocaleString()}
                </p>
              )}
              {checkResult.error && (
                <p className="mt-2 text-red-700">Erro: {checkResult.error}</p>
              )}
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Informações de Ambiente</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="mb-2"><strong>URL da API:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Não definida'}</p>
              <p className="mb-2"><strong>Modo:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Vercel URL:</strong> {process.env.VERCEL_URL || 'Não implantado na Vercel'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Próximos Passos</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              Se a verificação falhar, certifique-se de que o backend está rodando e acessível.
            </li>
            <li>
              Verifique se a URL da API está configurada corretamente no frontend 
              (variável de ambiente <code className="bg-gray-100 p-1 rounded">NEXT_PUBLIC_API_URL</code>).
            </li>
            <li>
              Certifique-se de que o CORS está configurado para permitir requisições do frontend.
            </li>
            <li>
              Para testar o login, acesse a <Link href="/login">
                <a className="text-blue-600 hover:underline">página de login</a>
              </Link>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 