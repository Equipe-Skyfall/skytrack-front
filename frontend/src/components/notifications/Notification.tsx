// components/notifications/Notification.tsx
import React, { useEffect, useState } from 'react';
import { Bell, X, Eye, EyeOff, Filter } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from '../../context/NotificationContext';
import AlertItem from '../alerts/AlertItem';

const Notification: React.FC = () => {
  const { alerts, unreadCount, markAllAsRead } = useNotifications();
  const [showModal, setShowModal] = useState(false);
  const [previousAlerts, setPreviousAlerts] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filtrar alertas baseado na seleção
  const filteredAlerts = filter === 'unread' 
    ? alerts.filter(alert => !alert.read)
    : alerts;

  // Detectar novos alertas e disparar toasts
  useEffect(() => {
    const currentIds = alerts.map(a => a.id);
    const newAlerts = alerts.filter(a => !previousAlerts.includes(a.id) && !a.read);

    newAlerts.forEach(alert => {
      const message = alert.description || getAlertMessage(alert);
      
      // Toast no estilo do sistema
      toast.info(
        <div className="flex items-start gap-3 p-1">
          <div className={`p-2 rounded-lg ${
            alert.level === 'critical' ? 'bg-red-100' : 'bg-slate-100'
          }`}>
            {alert.level === 'critical' ? '🚨' : '⚠️'}
          </div>
          <div className="flex-1">
            <strong className="text-sm font-semibold text-slate-800 block">
              {message}
            </strong>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(alert.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
        </div>,
        {
          position: 'bottom-right',
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: '!bg-white !border !border-slate-200 !rounded-xl !shadow-lg'
        }
      );
    });

    setPreviousAlerts(currentIds);
  }, [alerts]);

  // Função para gerar mensagem do alerta
  const getAlertMessage = (alert: any) => {
    // Prioriza alert_name vindo do backend
    if (alert.alert_name) {
      return alert.alert_name;
    }
    
    const tipoMap: { [key: string]: string } = {
      TEMPERATURE_HIGH: '🌡️ Temperatura elevada detectada',
      TEMPERATURE_LOW: '🌡️ Temperatura baixa detectada',
      HUMIDITY_HIGH: '💧 Umidade elevada detectada',
      HUMIDITY_LOW: '💧 Umidade baixa detectada',
      RAIN_HEAVY: '🌧️ Chuva intensa detectada',
      PRESSURE_LOW: '📉 Queda de pressão atmosférica',
      WIND_HIGH: '💨 Ventos fortes detectados',
    };
    return tipoMap[alert.tipoAlertaId] || `⚠️ Alerta`;
  };

  // Abrir modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Marcar como lido com feedback
  const handleMarkAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
      // Feedback visual
      toast.success('Todas as notificações marcadas como lidas!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {/* Ícone de notificação limpo */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpenModal}
          className="relative group bg-slate-900 rounded-xl p-3 hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
        >
          <Bell className="h-6 w-6 text-white group-hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Modal limpo sem borda feia */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-lg">
            
            {/* Header do modal */}
            <div className="bg-slate-900 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 rounded-lg p-2">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Notificações
                    </h2>
                    <p className="text-slate-300 text-sm mt-1">
                      {unreadCount > 0 ? `${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}` : 'Todas lidas'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-300 cursor-pointer"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-600" />
                  <span className="text-sm text-slate-700 font-medium">Filtrar:</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === 'all' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === 'unread' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Não lidas
                  </button>
                </div>
              </div>
            </div>

            {/* Corpo do modal */}
            <div className="p-6 bg-slate-50 max-h-[50vh] overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex flex-col items-center gap-4 bg-white rounded-xl p-6">
                    <div className="p-3 bg-slate-100 rounded-xl">
                      <Bell className="h-8 w-8 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-2">
                        {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {filter === 'unread' 
                          ? 'Todas as notificações foram lidas!' 
                          : 'Não há notificações no momento.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map(alert => (
                    <AlertItem
                      key={alert.id}
                      alert={{ 
                        ...alert, 
                        description: alert.description || getAlertMessage(alert),
                        level: alert.level || 'warning',
                        createdAt: alert.createdAt instanceof Date ? alert.createdAt.toISOString() : alert.createdAt
                      }}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer do modal */}
            <div className="border-t border-slate-200 bg-white px-6 py-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">
                  {filteredAlerts.length} de {alerts.length} notificação{alerts.length !== 1 ? 'es' : ''}
                </span>
                <button
                  onClick={handleMarkAsRead}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                    unreadCount > 0 
                      ? 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700 hover:scale-105 active:scale-95' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={unreadCount === 0}
                >
                  {unreadCount > 0 ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {unreadCount > 0 ? 'Marcar como lidas' : 'Todas lidas'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Container para toasts */}
      <ToastContainer
        toastClassName="!bg-white !border !border-slate-200 !rounded-xl !shadow-lg"
        progressClassName="!bg-slate-600"
      />
    </>
  );
};

export default Notification;