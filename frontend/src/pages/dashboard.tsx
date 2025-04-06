import React from 'react';
import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirecionar para o login se não estiver autenticado
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Exibir loading enquanto verifica a sessão
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada (será redirecionado pelo useEffect)
  if (status === 'unauthenticated') {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard | ProAgendify</title>
        <meta name="description" content="Dashboard do ProAgendify" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-blue-600">ProAgendify</span>
          </h1>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">Olá, {session?.user?.name || 'Usuário'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Agendamentos de Hoje</h2>
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <p className="text-gray-500">Nenhum agendamento para hoje</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Clientes</h2>
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <p className="text-gray-500">Clientes cadastrados</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Serviços</h2>
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <p className="text-gray-500">Serviços disponíveis</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Próximos Agendamentos</h2>
          <div className="border rounded-md">
            <div className="py-8 text-center text-gray-500">
              Nenhum agendamento encontrado
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
