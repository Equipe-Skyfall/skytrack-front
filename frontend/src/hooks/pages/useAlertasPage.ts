import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../alerts/useAlerts';
import type { Alert, AlertFormData } from '../../interfaces/alerts';

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
    historyAlerts,
    loading,
    error,
    createAlert,
    updateAlert,
    deleteAlert,
  } = useAlerts();
  
  // Estado da página
  const [editing, setEditing] = useState<Alert | null>(null);
  const [form, setForm] = useState<AlertFormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showTipoAlertaModal, setShowTipoAlertaModal] = useState(false);

  // Handlers da página
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
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir');
    } finally {
      setDeletingId(null);
    }
  };

  const onCancelDelete = () => {
    setDeletingId(null);
  };

  const onOpenTipoAlertaModal = () => {
    setShowTipoAlertaModal(true);
  };

  const onCloseTipoAlertaModal = () => {
    setShowTipoAlertaModal(false);
  };

  return {
    // Estado dos dados
    user,
    activeAlerts,
    historyAlerts,
    loading,
    error,
    
    // Estado da UI
    editing,
    form,
    showForm,
    deletingId,
    submitting,
    showTipoAlertaModal,
    
    // Handlers
    onEdit,
    onDelete,
    onSubmit,
    onCancelForm,
    onFormChange,
    onConfirmDelete,
    onCancelDelete,
    onOpenTipoAlertaModal,
    onCloseTipoAlertaModal,
    
    // Computed values
    formTitle: editing ? 'Editar Alerta' : 'Novo Alerta',
  };
};