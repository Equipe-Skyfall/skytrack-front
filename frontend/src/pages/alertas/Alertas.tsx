  import React, { useEffect, useState } from 'react';
import { getAlerts, createAlert, updateAlert, deleteAlert } from '../../services/api/alerts';
import AlertForm from '../../components/alertas/AlertForm';
import ConfirmDelete from '../../components/alertas/ConfirmDelete';
import TipoAlertaModal from '../../components/tipo-alerta/TipoAlertaModal';
import { useAuth } from '../../context/AuthContext';

type Alert = {
  id: string;
  data: Date;
  stationId: string;
  parameterId: string;
  tipoAlertaId: string;
  medidasId?: string;
  createdAt: Date;
};

type FormData = Partial<Alert>;

const emptyForm: FormData = { stationId: '', parameterId: '', tipoAlertaId: '', data: new Date() };
const Alertas: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Alert | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showTipoAlertaModal, setShowTipoAlertaModal] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAlerts();
      setAlerts(res || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onEdit = (a: Alert) => {
    setEditing(a);
    setForm(a);
    setShowForm(true);
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    setDeletingId(id);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing && editing.id) {
        const updated = await updateAlert(editing.id, form as any);
        setAlerts(prev => prev.map(a => (a.id === editing.id ? updated : a)));
      } else {
        const created = await createAlert(form as any);
        setAlerts(prev => [created, ...prev]);
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

  // Split active vs history using a resolved flag when available
  const active = alerts.filter(a => !(a as any).resolved);
  const history = alerts.filter(a => (a as any).resolved);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Alertas Meteorológicos</h1>
          <p className="text-sm text-gray-600 mt-1">Monitoramento de condições adversas e notificações</p>
        </div>
        <div>
          {user && <button onClick={() => setShowTipoAlertaModal(true)} className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">Gerenciar Tipos</button>}
        </div>
      </div>

      {/* Active alerts section - large cards */}
      <h2 className="text-lg font-semibold mb-3">Alertas Ativos</h2>
      <div className="space-y-4 mb-8">
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : active.length === 0 ? (
          <p>Nenhum alerta ativo.</p>
        ) : (
          active.map(a => (
            <div key={a.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="border-l-4 border-blue-500 p-6 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg break-words">Alerta {a.parameterId}</h3>
                    <span className="text-sm text-gray-500">{a.stationId}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-3">{a.createdAt.toLocaleString()}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {user && (
                    <>
                      <button onClick={() => onEdit(a)} className="px-3 py-1 border rounded hover:bg-gray-50">Detalhes</button>
                      <button onClick={() => onDelete(a.id)} className="px-3 py-1 border rounded bg-white text-red-600">Resolver</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* History section - compact list */}
      <h2 className="text-lg font-semibold mb-3">Histórico de Alertas</h2>
      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-sm text-gray-600">Sem histórico de alertas.</p>
        ) : (
          history.map(h => (
            <div key={h.id} className="flex items-center justify-between border rounded-lg p-4 bg-white">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium break-words">Alerta {h.parameterId}</h4>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">Resolvido</span>
                </div>
                <div className="text-sm text-gray-500">{h.stationId} • {h.createdAt.toLocaleString()}</div>
              </div>
              <div>
                {user && <button className="px-3 py-1 border rounded">Ver Detalhes</button>}
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <AlertForm
          value={form}
          onChange={(v) => setForm({ ...form, ...v })}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSubmit={onSubmit}
          submitting={submitting}
          title={editing ? 'Editar Alerta' : 'Novo Alerta'}
        />
      )}

      <ConfirmDelete
        open={!!deletingId}
        onCancel={() => setDeletingId(null)}
        onConfirm={async () => {
          if (!deletingId) return;
          try {
            await deleteAlert(deletingId);
            setAlerts(prev => prev.filter(x => x.id !== deletingId));
          } catch (err: any) {
            alert(err.message || 'Erro ao excluir');
          } finally {
            setDeletingId(null);
          }
        }}
        message="Deseja realmente excluir este alerta?"
      />

      <TipoAlertaModal
        open={showTipoAlertaModal}
        onClose={() => setShowTipoAlertaModal(false)}
        onSave={() => {
          // Optionally reload alerts if needed
          load();
        }}
      />
    </div>
  );
};

export default Alertas;