import { useState, useEffect, useCallback } from 'react';
import { 
  getAlerts, 
  createAlert, 
  updateAlert,
  resolveAlert,
  deleteAlert 
} from '../../services/api/alerts';
import { 
  getTipoAlertas, 
  createTipoAlerta, 
  updateTipoAlerta, 
  deleteTipoAlerta 
} from '../../services/api/tipo-alerta';
import type { Alert, AlertFormData, TipoAlerta, TipoAlertaFormData } from '../../interfaces/alerts';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAlerts(true); // Busca apenas alertas ativos (is_active=true)
      setAlerts(res || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateAlert = async (alertData: AlertFormData): Promise<Alert> => {
    try {
      const newAlert = await createAlert(alertData);
      await loadAlerts(); // Reload alerts
      return newAlert;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateAlert = async (id: string, alertData: AlertFormData): Promise<Alert> => {
    try {
      const updatedAlert = await updateAlert(id, alertData);
      await loadAlerts(); // Reload alerts
      return updatedAlert;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteAlert = async (id: string): Promise<void> => {
    try {
      await deleteAlert(id);
      await loadAlerts(); // Reload alerts
    } catch (error) {
      throw error;
    }
  };

  const handleResolveAlert = async (id: string): Promise<void> => {
    try {
      await resolveAlert(id);
      await loadAlerts(); // Reload alerts
    } catch (error) {
      throw error;
    }
  };

  // Filtros para alertas ativos e histórico
  // Backend retorna 'active' não 'resolved'
  const activeAlerts = alerts.filter(a => (a as any).active !== false);
  const historyAlerts = alerts.filter(a => (a as any).active === false);

  // Removido useEffect automático - apenas carrega quando explicitamente chamado
  // Use loadAlerts() manualmente quando necessário

  return {
    alerts,
    activeAlerts,
    historyAlerts,
    loading,
    error,
    loadAlerts,
    createAlert: handleCreateAlert,
    updateAlert: handleUpdateAlert,
    resolveAlert: handleResolveAlert,
    deleteAlert: handleDeleteAlert,
  };
};

export const useTipoAlertas = () => {
  const [tipoAlertas, setTipoAlertas] = useState<TipoAlerta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTipoAlertas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTipoAlertas();
      setTipoAlertas(res || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar tipos de alerta');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateTipoAlerta = async (tipoAlertaData: TipoAlertaFormData): Promise<TipoAlerta> => {
    try {
      const newTipoAlerta = await createTipoAlerta(tipoAlertaData);
      await loadTipoAlertas(); // Reload tipos
      return newTipoAlerta;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateTipoAlerta = async (id: string, tipoAlertaData: TipoAlertaFormData): Promise<TipoAlerta> => {
    try {
      const updatedTipoAlerta = await updateTipoAlerta(id, tipoAlertaData);
      await loadTipoAlertas(); // Reload tipos
      return updatedTipoAlerta;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteTipoAlerta = async (id: string): Promise<void> => {
    try {
      await deleteTipoAlerta(id);
      await loadTipoAlertas(); // Reload tipos
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    loadTipoAlertas();
  }, [loadTipoAlertas]);

  return {
    tipoAlertas,
    loading,
    error,
    loadTipoAlertas,
    createTipoAlerta: handleCreateTipoAlerta,
    updateTipoAlerta: handleUpdateTipoAlerta,
    deleteTipoAlerta: handleDeleteTipoAlerta,
  };
};