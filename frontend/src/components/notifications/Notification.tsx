// components/notifications/Notification.tsx
import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from '../../context/NotificationContext';
import AlertItem from '../alerts/AlertItem';

const Notification: React.FC = () => {
  const { alerts, unreadCount, markAllAsRead } = useNotifications();
  const [showModal, setShowModal] = useState(false);
  const [previousAlerts, setPreviousAlerts] = useState<string[]>([]);

  // Detectar novos alertas e disparar toasts
  useEffect(() => {
    const currentIds = alerts.map(a => a.id);
    const newAlerts = alerts.filter(a => !previousAlerts.includes(a.id) && !a.read);

    newAlerts.forEach(alert => {
      const message = alert.description || getAlertMessage(alert);
      toast.info(
        <div>
          <strong>{message}</strong>
          <p>{new Date(alert.createdAt).toLocaleString()}</p>
        </div>,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    });

    setPreviousAlerts(currentIds);
  }, [alerts]);

  // Função para gerar mensagem do alerta com base em tipoAlertaId
  const getAlertMessage = (alert: any) => {
    // Mapeamento simples; idealmente, buscar de /api/tipo-alerta
    const tipoMap: { [key: string]: string } = {
      TEMPERATURE_HIGH: 'Alerta: Temperatura elevada detectada',
      RAIN_HEAVY: 'Alerta: Vai chover hoje', // Exemplo para pluviômetro
      // Adicione outros mapeamentos conforme necessário
    };
    return tipoMap[alert.tipoAlertaId] || `Alerta: ${alert.parameterId}`;
  };

  // Abrir modal e marcar alertas como lidos
  const handleOpenModal = () => {
    setShowModal(true);
    markAllAsRead();
  };

  return (
    <>
      {/* Ícone de notificação com badge */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleOpenModal}
          className="relative bg-slate-900 text-white rounded-full p-2 hover:bg-slate-800 transition-colors duration-300"
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Modal com histórico de alertas */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg sm:max-w-xl md:max-w-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-800">
                Histórico de Alertas
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-600 hover:text-zinc-800 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-sm text-zinc-600">Nenhum alerta disponível.</p>
              ) : (
                alerts.map(alert => (
                  <AlertItem
                    key={alert.id}
                    alert={{ ...alert, description: alert.description || getAlertMessage(alert) }}
                    onEdit={() => {}} // Pode implementar se necessário
                    onDelete={() => {}} // Pode implementar se necessário
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Container para toasts */}
      <ToastContainer />
    </>
  );
};

export default Notification;