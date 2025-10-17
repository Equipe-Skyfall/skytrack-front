// context/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAlerts } from '../services/api/alerts';

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
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadAlerts = async () => {
    try {
      const res = await getAlerts();
      const newAlerts = (res || []).map((alert: Alert) => ({
        ...alert,
        read: alert.read ?? false,
        description: alert.description ?? undefined, // Será preenchido em Notification.tsx
        level: alert.level ?? 'warning',
      }));

      setAlerts(newAlerts);
      setUnreadCount(newAlerts.filter(a => !a.read).length);
    } catch (err) {
      console.error('Erro ao carregar alertas:', err);
    }
  };

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 60000); // Polling a cada 60s
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ alerts, unreadCount, markAllAsRead }}>
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