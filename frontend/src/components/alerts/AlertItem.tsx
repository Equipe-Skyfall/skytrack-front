// components/alerts/AlertItem.tsx
import React from 'react';
import { AlertTriangle, AlertCircle, Info, MapPin, Clock, CheckCircle } from 'lucide-react';

type Alert = {
  id?: string;
  stationId: string;
  parameterId?: string;
  parameter?: string;
  description: string;
  threshold?: number;
  level: 'warning' | 'critical';
  condition?: 'GREATER_THAN' | 'LESS_THAN' | 'IN_BETWEEN';
  durationMinutes?: number;
  createdAt?: string;
  read?: boolean;
};

type Props = {
  alert: Alert;
  onEdit: (a: Alert) => void;
  onDelete: (id?: string) => void;
};

const AlertItem: React.FC<Props> = ({ alert }) => {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          badge: "bg-red-500 text-white",
          border: "border-l-red-500",
          bg: "bg-red-50/80 hover:bg-red-50"
        };
      case 'warning':
        return {
          icon: <AlertCircle className="h-5 w-5 text-slate-600" />, // Mudei para slate
          badge: "bg-slate-600 text-white", // Mudei para slate
          border: "border-l-slate-500", // Mudei para slate
          bg: "bg-slate-50/80 hover:bg-slate-50" // Mudei para slate
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          badge: "bg-blue-500 text-white",
          border: "border-l-blue-500",
          bg: "bg-blue-50/80 hover:bg-blue-50"
        };
    }
  };

  const getLevelText = (level: string) => {
    return level === 'critical' ? 'Crítico' : 'Aviso';
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours} h`;
    if (diffDays === 1) return 'Ontem';
    return `Há ${diffDays} dias`;
  };

  const config = getLevelConfig(alert.level);

  return (
    <div className={`${config.bg} ${config.border} border-l-4 rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer border border-slate-200 hover:border-slate-300`}>
      <div className="flex items-start gap-3">
        {/* Ícone do alerta */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200">
            {config.icon}
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
              {getLevelText(alert.level)}
            </span>
            {alert.read && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Lido
              </span>
            )}
          </div>

          {/* Mensagem principal */}
          <h3 className="font-semibold text-slate-900 text-sm mb-2 leading-tight">
            {alert.description}
          </h3>

          {/* Informações secundárias */}
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Estação {alert.stationId.slice(0, 8)}...</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(alert.createdAt)}</span>
            </div>
          </div>

          {/* Informações técnicas (condensadas) */}
          {(alert.threshold || alert.durationMinutes) && (
            <div className="mt-2 pt-2 border-t border-slate-200/50">
              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                {alert.threshold && (
                  <span>Limite: {alert.threshold}</span>
                )}
                {alert.durationMinutes && (
                  <span>Duração: {alert.durationMinutes}min</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertItem;