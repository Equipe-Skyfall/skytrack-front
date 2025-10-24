import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../alerts/useAlerts';
import type { Alert, AlertFormData } from '../../interfaces/alerts';
import { getHistoryAlerts } from '../../services/api/historyAlerts';
import { getStation } from '../../services/api/stations';
import { getParameterById } from '../../services/api/parameters';
import { getTipoAlerta } from '../../services/api/tipo-alerta';
import type { HistoryQuery } from '../../services/api/historyAlerts';

const emptyForm: AlertFormData = { 
  stationId: '', 
  parameterId: '', 
  tipoAlertaId: '', 
  data: new Date() 
};

export const useAlertasPage = () => {
  const { user } = useAuth();
  const {
    activeAlerts,
    loading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
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
  const [detailAlert, setDetailAlert] = useState<Alert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const onEdit = (alert: Alert) => {
    setEditing(alert);
    setForm(alert);
    setShowForm(true);
  };

  const onDelete = (id?: string) => {
    if (!id) return;
    setDeletingId(id);
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

  const onOpenDetails = (a: Alert) => {
    (async () => {
      try {
        const [stationRes, parameterRes, tipoRes] = await Promise.allSettled([
          getStation(a.stationId),
          getParameterById(a.parameterId),
          getTipoAlerta(a.tipoAlertaId),
        ]);

        const stationName = stationRes.status === 'fulfilled' ? (stationRes.value.name || stationRes.value.macAddress || a.stationId) : a.stationId;
        const parameterName = parameterRes.status === 'fulfilled' ? (parameterRes.value.name || parameterRes.value.id || a.parameterId) : a.parameterId;
        const tipoName = tipoRes.status === 'fulfilled' ? (tipoRes.value.tipo || a.tipoAlertaId) : a.tipoAlertaId;

        const enriched: any = {
          ...a,
          stationName,
          parameterName,
          tipoAlertaName: tipoName,
        };

        setDetailAlert(enriched);
      } catch (e) {
        setDetailAlert(a);
      } finally {
        setShowDetailModal(true);
      }
    })();
  };

  const onCloseDetails = () => {
    setDetailAlert(null);
    setShowDetailModal(false);
  };

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
    detailAlert,
    showDetailModal,
    

    onEdit,
    onDelete,
    onSubmit,
    onCancelForm,
    onFormChange,
    onConfirmDelete,
    onCancelDelete,
    onOpenTipoAlertaModal,
    onCloseTipoAlertaModal,
    onOpenDetails,
    onCloseDetails,
  loadHistory,
    
    formTitle: editing ? 'Editar Alerta' : 'Novo Alerta',
  };
};