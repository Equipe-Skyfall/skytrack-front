import React from 'react';
import { X } from 'lucide-react';
import type { Alert } from '../../interfaces/alerts';

type Props = {
  open: boolean;
  alert: Alert | null;
  onClose: () => void;
};

const AlertDetailModal: React.FC<Props> = ({ open, alert, onClose }) => {
  if (!open || !alert) return null;

  const formatDate = (iso?: string | Date) => {
    if (!iso) return '-';
    const d = iso instanceof Date ? iso : new Date(iso);
    return d.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b border-zinc-200">
          <h2 className="text-2xl font-bold text-zinc-800 font-poppins">Detalhes do Alerta</h2>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-800">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <div className="text-xs text-zinc-500 font-poppins">ID</div>
              <div className="text-sm text-zinc-800 font-medium break-all font-poppins">{alert.id}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-poppins">Estação</div>
              <div className="text-sm text-zinc-800 font-poppins">{(alert as any).stationName || alert.stationId}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-poppins">Parâmetro</div>
              <div className="text-sm text-zinc-800 font-poppins">{(alert as any).parameterName || alert.parameterId}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-poppins">Tipo de Alerta</div>
              <div className="text-sm text-zinc-800 font-poppins">{(alert as any).tipoAlertaName || alert.tipoAlertaId || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-poppins">Medidas</div>
              <div className="text-sm text-zinc-800 font-poppins">{(alert as any).medidasId || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-poppins">Data (valor)</div>
              <div className="text-sm text-zinc-800 font-poppins">{formatDate((alert as any).data)}</div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Criado em</div>
              <div className="text-sm text-zinc-800">{formatDate(alert.createdAt)}</div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-white border border-gray-300 text-zinc-800 rounded-lg py-2 px-4 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailModal;
