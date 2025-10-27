import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../alerts/useAlerts';
import type { Alert, AlertFormData } from '../../interfaces/alerts';
import { getHistoryAlerts } from '../../services/api/historyAlerts';
import { resolveAlert, activateAlert } from '../../services/api/alerts';
import { useNotifications } from '../../context/NotificationContext';
// removed detail-related remote fetches (stations/parameters/tipo-alerta) — not needed after details removal
import type { HistoryQuery } from '../../services/api/historyAlerts';

const emptyForm: AlertFormData = { 
  stationId: '', 
  parameterId: '', 
  tipoAlertaId: '', 
  data: new Date() 
};

export const useAlertasPage = () => {
  const { user } = useAuth();
  const { reloadAlerts } = useNotifications();
  const {
    activeAlerts,
    loading,
    error,
    createAlert,
    updateAlert,
    loadAlerts,
  } = useAlerts();
  
  const [editing, setEditing] = useState<Alert | null>(null);
  const [form, setForm] = useState<AlertFormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showTipoAlertaModal, setShowTipoAlertaModal] = useState(false);
  const [historyData, setHistoryData] = useState<Alert[]>([]);
  const [historyPagination, setHistoryPagination] = useState<any>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyQuery, setHistoryQuery] = useState<HistoryQuery>({ page: 1, limit: 10 });
  // detail modal removed

  const onEdit = (alert: Alert) => {
    setEditing(alert);
    setForm(alert);
    setShowForm(true);
  };

  const onResolve = (id?: string) => {
    if (!id) return;
    setResolvingId(id);
  };

  const onActivate = (id?: string) => {
    if (!id) return;
    setActivatingId(id);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing && editing.id) {
        await updateAlert(editing.id, form as any);
      } else {
        await createAlert(form as any);
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar alerta');
    } finally {
      setSubmitting(false);
    }
  };

  const onCancelForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const onFormChange = (value: Partial<AlertFormData>) => {
    setForm({ ...form, ...value });
  };

  const onConfirmResolve = async () => {
    if (!resolvingId) return;
    try {
      await resolveAlert(resolvingId);
      await loadAlerts(); // Recarrega alertas ativos
      await loadHistory(); // Recarrega histórico
      await reloadAlerts(); // Recarrega notificações
    } catch (err: any) {
      alert(err.message || 'Erro ao resolver alerta');
    } finally {
      setResolvingId(null);
    }
  };

  const onCancelResolve = () => {
    setResolvingId(null);
  };

  const onConfirmActivate = async () => {
    if (!activatingId) return;
    try {
      await activateAlert(activatingId);
      await loadAlerts(); // Recarrega alertas ativos
      await loadHistory(); // Recarrega histórico
      await reloadAlerts(); // Recarrega notificações
    } catch (err: any) {
      alert(err.message || 'Erro ao ativar alerta');
    } finally {
      setActivatingId(null);
    }
  };

  const onCancelActivate = () => {
    setActivatingId(null);
  };

  const loadHistory = async (query: HistoryQuery = historyQuery) => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await getHistoryAlerts(query);
      setHistoryData((res && res.data) || []);
      setHistoryPagination((res && res.pagination) || null);
      setHistoryQuery(query);
    } catch (err: any) {
      setHistoryError(err.message || 'Erro ao carregar histórico');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(historyQuery);
  }, []);

  const onOpenTipoAlertaModal = () => {
    setShowTipoAlertaModal(true);
  };

  const onCloseTipoAlertaModal = () => {
    setShowTipoAlertaModal(false);
  };

  // details handlers removed

  return {
  user,
  activeAlerts,
  loading,
  error,

  historyAlerts: historyData,
  historyPagination,
  historyLoading,
  historyError,
    
    editing,
    form,
    showForm,
    resolvingId,
    activatingId,
    submitting,
    showTipoAlertaModal,
  // detailAlert, showDetailModal removed
    

    onEdit,
    onResolve,
    onActivate,
    onSubmit,
    onCancelForm,
    onFormChange,
    onConfirmResolve,
    onConfirmActivate,
    onCancelResolve,
    onCancelActivate,
    onOpenTipoAlertaModal,
    onCloseTipoAlertaModal,
  // onOpenDetails, onCloseDetails removed
  loadHistory,
    
    formTitle: editing ? 'Editar Alerta' : 'Novo Alerta',
  };
};