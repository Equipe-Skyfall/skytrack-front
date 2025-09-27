
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Plus, Settings, Trash2 } from 'lucide-react';

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


  const active = alerts.filter(a => !(a as any).resolved);
  const history = alerts.filter(a => (a as any).resolved);

  return (
    <div className="min-h-screen bg-white font-poppins flex">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-800 tracking-tight">
              Alertas Meteorológicos
            </h1>
            <p className="text-base sm:text-lg text-zinc-600">
              Monitore condições adversas e gerencie notificações
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowTipoAlertaModal(true)}
              className="bg-slate-900 text-white rounded-lg py-3 px-8 flex items-center gap-2 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <Settings className="h-5 w-5" />
              Gerenciar Tipos
            </button>
          )}
        </div>

        {/* Active Alerts Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-zinc-700" />
            Alertas Ativos
          </h2>
          {loading ? (
            <div className="text-lg text-zinc-600">Carregando...</div>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : active.length === 0 ? (
            <p className="text-sm text-zinc-600">Nenhum alerta ativo.</p>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {active.map(a => (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-100 rounded-lg p-2">
                      <AlertTriangle className="h-6 w-6 text-zinc-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-zinc-800 truncate">
                        Alerta {a.parameterId}
                      </h3>
                      <p className="text-sm text-zinc-600 truncate">{a.stationId}</p>
                    </div>
                    <div className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-semibold">
                      Ativo
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600">
                    <strong>Data:</strong> {a.createdAt.toLocaleString()}
                  </p>
                  {user && (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => onEdit(a)}
                        className="bg-white border border-zinc-400 rounded-lg py-2 px-6 flex items-center gap-2 text-base font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors duration-300 shadow-sm cursor-pointer"
                      >
                        <Settings className="h-5 w-5" />
                        Detalhes
                      </button>
                      <button
                        onClick={() => onDelete(a.id)}
                        className="bg-red-500 text-white rounded-lg py-2 px-6 flex items-center gap-2 text-base font-semibold hover:bg-red-600 transition-colors duration-300 shadow-sm cursor-pointer"
                      >
                        <Trash2 className="h-5 w-5" />
                        Deletar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-zinc-700" />
            Histórico de Alertas
          </h2>
          {history.length === 0 ? (
            <p className="text-sm text-zinc-600">Sem histórico de alertas.</p>
          ) : (
            <div className="space-y-4">
              {history.map(h => (
                <div
                  key={h.id}
                  className="bg-white rounded-xl border border-zinc-300 p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-zinc-100 rounded-lg p-2">
                      <AlertTriangle className="h-5 w-5 text-zinc-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-semibold text-zinc-800 truncate">
                          Alerta {h.parameterId}
                        </h4>
                        <span className="bg-zinc-200 text-zinc-800 rounded-full px-2 py-1 text-xs font-semibold">
                          Resolvido
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 truncate">
                        {h.stationId} • {h.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {user && (
                    <button
                      className="bg-white border border-zinc-400 rounded-lg py-2 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors duration-300 cursor-pointer"
                    >
                      Ver Detalhes
                    </button>
                  )}
                </div>
              ))}
            </div>
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
            load();
          }}
        />
      </main>

    </div>
  );
};

export default Alertas;