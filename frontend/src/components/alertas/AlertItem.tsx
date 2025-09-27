import React from 'react';

type Alert = {
  id?: string;
  stationId: string;
  parameterId?: string;
  parameter?: string;
  description: string;
  threshold: number;
  level: 'warning' | 'critical';
  condition?: 'GREATER_THAN' | 'LESS_THAN' | 'IN_BETWEEN';
  durationMinutes?: number;
  createdAt?: string;
};

type Props = {
  alert: Alert;
  onEdit: (a: Alert) => void;
  onDelete: (id?: string) => void;
};

const AlertItem: React.FC<Props> = ({ alert, onEdit, onDelete }) => {
  return (
  <div className="flex w-full items-start justify-between border p-4 rounded">
      <div className="flex-1 pr-4 min-w-0">
        <div className="flex items-center space-x-3">
          <h3 className="font-semibold text-lg break-words">{alert.parameter ?? alert.description}</h3>
          <span className="text-sm text-gray-500">{alert.stationId}</span>
          <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">{alert.level}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 break-words">{alert.description}</p>
        <p className="text-xs text-gray-400 mt-1">{alert.threshold} — {alert.condition} {alert.durationMinutes ? `(${alert.durationMinutes}m)` : ''}</p>
        <p className="text-xs text-gray-400 mt-1">{alert.createdAt && new Date(alert.createdAt).toLocaleString()}</p>
      </div>
      <div className="flex items-center space-x-2 self-start">
        <button onClick={() => onEdit(alert)} className="text-indigo-600 hover:underline">Editar</button>
        <button onClick={() => onDelete(alert.id)} className="text-red-600 hover:underline">Excluir</button>
      </div>
    </div>
  );
};

export default AlertItem;

