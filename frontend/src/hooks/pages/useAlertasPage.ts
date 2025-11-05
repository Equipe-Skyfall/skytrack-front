import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../alerts/useAlerts';
import { useNotifications } from '../../context/NotificationContext';
import type { Alert, AlertFormData } from '../../interfaces/alerts';
import { getHistoryAlerts } from '../../services/api/historyAlerts';
import { resolveAlert as resolveAlertAPI } from '../../services/api/alerts';
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
  const { reloadAlerts: reloadNotifications } = useNotifications();
  const {
    activeAlerts,
    loading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
    loadAlerts, // Adicionar loadAlerts para recarregar alertas ativos manualmente
  } = useAlerts();
  
  const [editing, setEditing] = useState<Alert | null>(null);
  const [form, setForm] = useState<AlertFormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const onDelete = (id?: string) => {
    if (!id) return;
    setDeletingId(id);
  };

  const onResolve = async (id: string) => {
    console.log('🔄 onResolve iniciado para ID:', id);
    try {
      // Chama a API diretamente sem esperar o reload automático do hook
      console.log('📡 Chamando API resolveAlert...');
      await resolveAlertAPI(id);
      console.log('✅ API respondeu, recarregando listas...');
      
      // Recarrega manualmente e em paralelo para ser mais rápido
      await Promise.all([
        loadAlerts(), // Recarrega alertas ativos
        loadHistory(historyQuery), // Recarrega histórico
        reloadNotifications(), // Recarrega notificações
      ]);
      
      console.log('✅ Todas as listas recarregadas!');
    } catch (err: any) {
      console.error('❌ Erro ao resolver/reativar:', err);
      alert('Erro ao resolver/reativar alerta');
    }
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

  const onConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteAlert(deletingId);
      await loadHistory();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir');
    } finally {
      setDeletingId(null);
    }
  };

  const onCancelDelete = () => {
    setDeletingId(null);
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
    deletingId,
    submitting,
    showTipoAlertaModal,
  // detailAlert, showDetailModal removed
    

    onEdit,
    onDelete,
    onResolve,
    onSubmit,
    onCancelForm,
    onFormChange,
    onConfirmDelete,
    onCancelDelete,
    onOpenTipoAlertaModal,
    onCloseTipoAlertaModal,
  // onOpenDetails, onCloseDetails removed
  loadHistory,
    
    formTitle: editing ? 'Editar Alerta' : 'Novo Alerta',
  };
};