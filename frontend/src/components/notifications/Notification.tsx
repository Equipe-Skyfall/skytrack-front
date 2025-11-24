// components/notifications/Notification.tsx
import React, { useEffect, useState } from 'react';
import { Bell, X, Eye, EyeOff, Filter } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';
import AlertItem from '../alerts/AlertItem';

const Notification: React.FC = () => {
  const { alerts, unreadCount, markAllAsRead } = useNotifications();
  const { isDarkMode } = useTheme();
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
      
      // Toast no estilo do sistema com dark mode
      toast.info(
        <div className="flex items-start gap-2 sm:gap-3 p-1">
          <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${
            alert.level === 'critical' 
              ? isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
              : isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <span className="text-base sm:text-lg">{alert.level === 'critical' ? '🚨' : '⚠️'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <strong className={`text-xs sm:text-sm font-semibold block truncate ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              {message}
            </strong>
            <p className={`text-xs mt-0.5 sm:mt-1 truncate ${
              isDarkMode ? 'text-gray-400' : 'text-slate-500'
            }`}>
              {new Date(alert.createdAt).toLocaleString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>,
        {
          position: window.innerWidth < 640 ? 'top-center' : 'bottom-right',
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: `${isDarkMode 
            ? '!bg-slate-800 !border !border-slate-700 !rounded-xl !shadow-lg'
            : '!bg-white !border !border-slate-200 !rounded-xl !shadow-lg'} !max-w-[calc(100vw-2rem)] sm:!max-w-md`
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
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={handleOpenModal}
          className={`relative group rounded-xl p-2.5 sm:p-3 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'bg-slate-900 hover:bg-slate-800'
          }`}
        >
          <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shadow-lg animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Modal limpo sem borda feia */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className={`rounded-xl w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden shadow-lg ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            
            {/* Header do modal */}
            <div className={`p-4 sm:p-6 ${
              isDarkMode ? 'bg-slate-900' : 'bg-slate-900'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className={`rounded-lg p-1.5 sm:p-2 shrink-0 ${
                    isDarkMode ? 'bg-slate-700' : 'bg-slate-800'
                  }`}>
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                      Notificações
                    </h2>
                    <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 truncate ${
                      isDarkMode ? 'text-gray-300' : 'text-slate-300'
                    }`}>
                      {unreadCount > 0 ? `${unreadCount} não lida${unreadCount !== 1 ? 's' : ''}` : 'Todas lidas'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg transition-colors duration-300 cursor-pointer shrink-0 ${
                    isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-800'
                  }`}
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className={`px-4 sm:px-6 py-2 sm:py-3 border-b ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Filter className={`h-3 w-3 sm:h-4 sm:w-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`} />
                  <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>Filtrar:</span>
                </div>
                <div className="flex gap-1.5 sm:gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      filter === 'all' 
                        ? isDarkMode
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-900 text-white shadow-sm'
                        : isDarkMode
                          ? 'bg-slate-600 text-gray-200 border border-slate-500 hover:bg-slate-500'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                      filter === 'unread' 
                        ? isDarkMode
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-900 text-white shadow-sm'
                        : isDarkMode
                          ? 'bg-slate-600 text-gray-200 border border-slate-500 hover:bg-slate-500'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Não lidas
                  </button>
                </div>
              </div>
            </div>

            {/* Corpo do modal */}
            <div className={`p-3 sm:p-6 max-h-[55vh] sm:max-h-[50vh] overflow-y-auto ${
              isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
            }`}>
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <div className={`inline-flex flex-col items-center gap-4 rounded-xl p-6 ${
                    isDarkMode ? 'bg-slate-700' : 'bg-white'
                  }`}>
                    <div className={`p-3 rounded-xl ${
                      isDarkMode ? 'bg-slate-600' : 'bg-slate-100'
                    }`}>
                      <Bell className={`h-8 w-8 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-slate-700'
                      }`}>
                        {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-slate-500'
                      }`}>
                        {filter === 'unread' 
                          ? 'Todas as notificações foram lidas!' 
                          : 'Não há notificações no momento.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-4">
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
            <div className={`border-t px-3 sm:px-6 py-3 sm:py-4 ${
              isDarkMode 
                ? 'border-slate-700 bg-slate-800' 
                : 'border-slate-200 bg-white'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0">
                <span className={`text-xs sm:text-sm text-center sm:text-left ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  {filteredAlerts.length} de {alerts.length} notificação{alerts.length !== 1 ? 'es' : ''}
                </span>
                <button
                  onClick={handleMarkAsRead}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    unreadCount > 0 
                      ? isDarkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 hover:scale-105 active:scale-95'
                        : 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700 hover:scale-105 active:scale-95'
                      : isDarkMode
                        ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  disabled={unreadCount === 0}
                >
                  {unreadCount > 0 ? <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <EyeOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  <span className="truncate">{unreadCount > 0 ? 'Marcar como lidas' : 'Todas lidas'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Container para toasts */}
      <ToastContainer
        toastClassName={isDarkMode 
          ? '!bg-slate-800 !border !border-slate-700 !rounded-xl !shadow-lg'
          : '!bg-white !border !border-slate-200 !rounded-xl !shadow-lg'
        }
        progressClassName={isDarkMode ? '!bg-blue-600' : '!bg-slate-600'}
      />
    </>
  );
};

export default Notification;