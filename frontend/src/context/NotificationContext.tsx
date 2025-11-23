// context/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAlerts } from '../services/api/alerts';
import { useAuth } from './AuthContext';

type Alert = {
  id: string;
  data: Date;
  stationId: string;
  parameterId: string;
  tipoAlertaId: string;
  medidasId?: string;
  createdAt: Date;
  read?: boolean;
  description?: string;
  level?: 'warning' | 'critical';
};

type NotificationContextType = {
  alerts: Alert[];
  unreadCount: number;
  markAllAsRead: () => void;
  reloadAlerts: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const loadAlerts = async () => {
    try {
      const res = await getAlerts(true); // Busca apenas alertas ativos (is_active=true)
      console.log('🔔 NotificationContext - Alertas recebidos:', res);
      console.log('🔍 Primeiro alerta completo:', res && res[0] ? JSON.stringify(res[0], null, 2) : 'Nenhum alerta');
      
      // Backend já filtra por is_active=true, então não precisa filtrar aqui
      const newAlerts = (res || []).map((alert: Alert) => ({
        ...alert,
        read: alert.read ?? false,
        description: alert.description ?? undefined,
        level: alert.level ?? 'warning',
      }));

      console.log('✅ NotificationContext - Alertas processados:', newAlerts);
      setAlerts(newAlerts);
      setUnreadCount(newAlerts.filter((a: Alert) => !a.read).length);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    }
  };

  useEffect(() => {
    // Só faz polling se houver usuário autenticado ou se for acesso público permitido
    // Para evitar requests desnecessários antes da autenticação
    if (!user) {
      console.log('🔐 NotificationContext - Usuário não autenticado, aguardando...');
      return;
    }

    console.log('👤 NotificationContext - Usuário autenticado, iniciando polling de alertas');
    loadAlerts();
    const interval = setInterval(loadAlerts, 60000); // Polling every 60s
    return () => {
      console.log('🛑 NotificationContext - Limpando interval de polling');
      clearInterval(interval);
    };
  }, [user]);

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ alerts, unreadCount, markAllAsRead, reloadAlerts: loadAlerts }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};