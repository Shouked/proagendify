import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type ResponseData = {
  status: string;
  message: string;
  apiUrl?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';
  
  try {
    // Tentar fazer uma requisição para o backend
    const response = await axios.get(`${apiUrl}/health-check`, { 
      timeout: 5000 
    }).catch(error => {
      // Verificar se o endpoint de health-check não existe
      if (error.response && error.response.status === 404) {
        // Tentar outro endpoint como fallback
        return axios.get(`${apiUrl}/auth`, { timeout: 5000 });
      }
      throw error;
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Conexão com o backend estabelecida com sucesso',
      apiUrl
    });
  } catch (error: any) {
    console.error('Erro ao conectar com o backend:', error.message);
    
    let errorMessage = error.message;
    
    // Melhorar a mensagem de erro para facilitar o diagnóstico
    if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Não foi possível conectar ao servidor backend. O servidor está offline ou inacessível.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'O domínio do backend não foi encontrado. Verifique se a URL está correta.';
    } else if (error.response && error.response.status === 401) {
      errorMessage = 'A conexão foi estabelecida, mas o backend retornou erro de autenticação.';
    }
    
    return res.status(500).json({
      status: 'error',
      message: 'Falha ao conectar com o backend',
      apiUrl,
      error: errorMessage
    });
  }
} 