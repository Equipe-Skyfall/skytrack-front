import React from 'react';
import type { AlertasRecentesProps, NivelAlerta } from './types';

const AlertaBadge: React.FC<{ nivel: NivelAlerta }> = ({ nivel }) => {
  const getNivelConfig = (nivel: NivelAlerta) => {
    switch (nivel) {
      case 'baixo':
        return { text: 'Baixo', className: 'bg-gray-500 text-white' };
      case 'medio':
        return { text: 'Médio', className: 'bg-yellow-500 text-white' };
      case 'alto':
        return { text: 'Alto', className: 'bg-green-500 text-white' };
      default:
        return { text: 'Desconhecido', className: 'bg-gray-500 text-white' };
    }
  };

  const { text, className } = getNivelConfig(nivel);
  
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}>
      {text}
    </span>
  );
};

const AlertasRecentes: React.FC<AlertasRecentesProps> = ({ alertas }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <h2 className="text-lg font-semibold text-gray-800">Alertas Recentes</h2>
      </div>

      <div className="space-y-3">
        {alertas.map((alerta) => (
          <div key={alerta.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div>
              <h3 className="font-medium text-gray-900">{alerta.tipo}</h3>
              <p className="text-sm text-gray-500">{alerta.regiao} - {alerta.horario}</p>
            </div>
            <AlertaBadge nivel={alerta.nivel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertasRecentes;