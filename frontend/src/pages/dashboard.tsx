import React from 'react';
import { useAuth } from '../components/AuthProvider';
import DashboardLayout from '../components/layout/DashboardLayout';

function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Verificando em client-side se o usuário está autenticado
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Este redirecionamento é tratado pelo próprio AuthProvider
    return null;
  }
  
  return (
    <DashboardLayout title="Dashboard">
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
    </DashboardLayout>
  );
}

export default Dashboard;
