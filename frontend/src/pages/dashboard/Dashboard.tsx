import React from 'react';
import { StatusEstacoes, AlertasRecentes, estacoesStatus, alertasRecentes } from '../../components/dashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-poppins flex">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-800 tracking-tight">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusEstacoes estacoes={estacoesStatus} />
          <AlertasRecentes alertas={alertasRecentes} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;