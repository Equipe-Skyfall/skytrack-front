import React from 'react';
import AlertItem from './AlertItem';

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
  alerts: Alert[];
  onEdit: (a: Alert) => void;
  onDelete: (id?: string) => void;
};

const AlertList: React.FC<Props> = ({ alerts, onEdit, onDelete }) => {
  return (
    <div className="divide-y">
      {alerts.map((a) => (
        <div key={a.id} className="py-3">
          <AlertItem alert={a} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
};


export default AlertList;

