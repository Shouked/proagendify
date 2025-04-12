import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function TestApi() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || '');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const testDirectConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const response = await axios.get(`${baseUrl}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResponse(response.data);
    } catch (err: any) {
      console.error('Erro na conexão:', err);
      setError(err.message);
      if (err.response) {
        setError(JSON.stringify(err.response.data, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const response = await axios.post(`${baseUrl}/api/auth/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResponse(response.data);
      if (response.data.token) {
        setToken(response.data.token);
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message);
      if (err.response) {
        setError(JSON.stringify(err.response.data, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthenticatedRequest = async () => {
    if (!token) {
      setError('Token não disponível. Faça login primeiro.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
      const response = await axios.get(`${baseUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setResponse(response.data);
    } catch (err: any) {
      console.error('Erro na requisição autenticada:', err);
      setError(err.message);
      if (err.response) {
        setError(JSON.stringify(err.response.data, null, 2));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Head>
        <title>Teste de API | ProAgendify</title>
      </Head>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teste Direto da API</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Configuração</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da API</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="https://seu-api.com/api"
            />
            <p className="text-xs text-gray-500 mt-1">URL atual: {process.env.NEXT_PUBLIC_API_URL}</p>
          </div>
          
          <button
            onClick={testDirectConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Testar Conexão Básica
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Teste de Login</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <button
            onClick={testLogin}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Testar Login
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Teste de Requisição Autenticada</h2>
          {token && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700">Token obtido:</p>
              <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-x-auto">
                {token.substring(0, 30)}...
              </pre>
            </div>
          )}
          
          <button
            onClick={testAuthenticatedRequest}
            disabled={isLoading || !token}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Testar Endpoint Autenticado
          </button>
        </div>
        
        {isLoading && (
          <div className="text-center py-4">
            <p>Carregando...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-red-600 mb-2">Erro:</h3>
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}
        
        {response && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-medium text-green-600 mb-2">Resposta:</h3>
            <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 