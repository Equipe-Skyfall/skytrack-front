import React from 'react';
import type { StatusEstacoesProps, StatusEstacao } from './types';

const StatusBadge: React.FC<{ status: StatusEstacao }> = ({ status }) => {
  const getStatusConfig = (status: StatusEstacao) => {
    switch (status) {
      case 'online':
        return { text: 'Online', className: 'bg-green-500 text-white' };
      case 'offline':
        return { text: 'Offline', className: 'bg-red-500 text-white' };
      default:
        return { text: 'Desconhecido', className: 'bg-gray-500 text-white' };
    }
  };

  const { text, className } = getStatusConfig(status);
  
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}>
      {text}
    </span>
  );
};

const StatusEstacoes: React.FC<StatusEstacoesProps> = ({ estacoes }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-gray-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-800">Status das Estações</h2>
      </div>

      <div className="space-y-3">
        {estacoes.map((estacao) => (
          <div key={estacao.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div>
              <h3 className="font-medium text-gray-900">{estacao.nome}</h3>
              <p className="text-sm text-gray-500">Última atualização: {estacao.ultimaAtualizacao}</p>
            </div>
            <StatusBadge status={estacao.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusEstacoes;