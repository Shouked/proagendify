import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import api from '../lib/api';
import Head from 'next/head';

export default function DebugAuth() {
  const { data: session, status } = useSession();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Função para testar uma requisição autenticada
  const testAuthenticatedRequest = async () => {
    try {
      setError(null);
      const response = await api.get('/auth/me');
      setApiResponse(response.data);
    } catch (err: any) {
      setError(err.message);
      if (err.response) {
        console.error('API Error:', err.response.data);
        setError(JSON.stringify(err.response.data, null, 2));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Head>
        <title>Debug Auth | ProAgendify</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Depuração de Autenticação</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Status da Sessão</h2>
          <p className="mb-2">
            <strong>Status:</strong> {status}
          </p>
          {session ? (
            <div className="mb-4">
              <p className="mb-2">
                <strong>Usuário:</strong> {session.user?.name} ({session.user?.email})
              </p>
              <p className="mb-2">
                <strong>ID:</strong> {session.user?.id}
              </p>
              <p className="mb-2">
                <strong>Perfil:</strong> {session.user?.role}
              </p>
              <p className="mb-2">
                <strong>Token Presente:</strong> {session.accessToken ? 'Sim' : 'Não'}
              </p>
              {session.accessToken && (
                <div className="mt-2">
                  <p className="font-medium">Token (primeiros 20 caracteres):</p>
                  <pre className="bg-gray-100 p-2 rounded mt-1 text-sm">
                    {session.accessToken.substring(0, 20)}...
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-yellow-600">Nenhuma sessão ativa</p>
          )}

          <div className="mt-4 flex gap-3">
            {!session ? (
              <button
                onClick={() => signIn()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Fazer Login
              </button>
            ) : (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sair
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Testar API Autenticada</h2>
          <button
            onClick={testAuthenticatedRequest}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
          >
            Testar Requisição /auth/me
          </button>

          {error && (
            <div className="mt-4">
              <h3 className="font-medium text-red-600">Erro:</h3>
              <pre className="bg-red-50 border border-red-200 p-3 rounded mt-1 text-sm whitespace-pre-wrap">
                {error}
              </pre>
            </div>
          )}

          {apiResponse && (
            <div className="mt-4">
              <h3 className="font-medium text-green-600">Resposta da API:</h3>
              <pre className="bg-green-50 border border-green-200 p-3 rounded mt-1 text-sm whitespace-pre-wrap">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mt-8">
          <p>Esta página é apenas para depuração e não deve ser incluída em produção.</p>
        </div>
      </div>
    </div>
  );
} 