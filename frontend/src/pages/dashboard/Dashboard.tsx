import React from 'react';
import { StatusEstacoes, AlertasRecentes, estacoesStatus, alertasRecentes } from '../../components/dashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status das Estações - Lado Esquerdo */}
        <StatusEstacoes estacoes={estacoesStatus} />
        
        {/* Alertas Recentes - Lado Direito */}
        <AlertasRecentes alertas={alertasRecentes} />
      </div>
    </div>
  );
};

export default Dashboard;