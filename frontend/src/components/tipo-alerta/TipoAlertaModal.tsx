import React, { useState, useEffect } from 'react';
import { X, Plus, Settings, Trash2, Loader2 } from 'lucide-react';
import { getTipoAlertas, createTipoAlerta, updateTipoAlerta, deleteTipoAlerta } from '../../services/api/tipo-alerta';

type TipoAlerta = {
  id: string;
  tipo: string;
  publica: boolean;
  condicao: string;
  valor: string;
  limite: number;
  nivel: string;
  duracaoMin?: number;
  criadoEm: Date;
};

type FormData = Partial<Omit<TipoAlerta, 'id' | 'criadoEm'>>;

interface TipoAlertaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const TipoAlertaModal: React.FC<TipoAlertaModalProps> = ({ open, onClose, onSave }) => {
  const [tipoAlertas, setTipoAlertas] = useState<TipoAlerta[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<TipoAlerta | null>(null);
  const [form, setForm] = useState<FormData>({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadTipoAlertas = async () => {
    setLoading(true);
    try {
      const res = await getTipoAlertas();
      setTipoAlertas(res || []);
    } catch (err: any) {
      alert(err.message || 'Erro ao carregar tipos de alerta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadTipoAlertas();
    }
  }, [open]);

  const onOpenCreate = () => {
    setEditing(null);
    setForm({ publica: false, nivel: 'warning' });
    setShowForm(true);
  };

  const onEdit = (ta: TipoAlerta) => {
    setEditing(ta);
    setForm({
      tipo: ta.tipo,
      publica: ta.publica,
      condicao: ta.condicao,
      valor: ta.valor,
      limite: ta.limite,
      nivel: ta.nivel,
      duracaoMin: ta.duracaoMin,
    });
    setShowForm(true);
  };

  const onDelete = (id: string) => {
    setDeletingId(id);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateTipoAlerta(editing.id, form);
      } else {
        await createTipoAlerta(form);
      }
      await loadTipoAlertas();
      setShowForm(false);
      setEditing(null);
      setForm({});
      onSave();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar tipo de alerta');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTipoAlerta(deletingId);
      await loadTipoAlertas();
      onSave();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir tipo de alerta');
    } finally {
      setDeletingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-zinc-200">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-800">Gerenciar Tipos de Alerta</h2>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-800 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {showForm && (
            <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6 shadow-md">
              <h4 className="text-lg font-bold text-zinc-800 mb-4">
                {editing ? 'Editar Tipo de Alerta' : 'Novo Tipo de Alerta'}
              </h4>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Tipo</label>
                    <input
                      type="text"
                      value={form.tipo || ''}
                      onChange={e => setForm({ ...form, tipo: e.target.value })}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Condição</label>
                    <select
                      value={form.condicao || ''}
                      onChange={e => setForm({ ...form, condicao: e.target.value })}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                      required
                    >
                      <option value="" disabled>Selecione...</option>
                      <option value="GREATER_THAN">Maior que</option>
                      <option value="LESS_THAN">Menor que</option>
                      <option value="EQUALS">Igual a</option>
                      <option value="NOT_EQUALS">Diferente de</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Valor</label>
                    <input
                      type="text"
                      value={form.valor || ''}
                      onChange={e => setForm({ ...form, valor: e.target.value })}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Limite</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.limite || ''}
                      onChange={e => setForm({ ...form, limite: parseFloat(e.target.value) })}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Nível</label>
                    <select
                      value={form.nivel || 'warning'}
                      onChange={e => setForm({ ...form, nivel: e.target.value })}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Aviso</option>
                      <option value="error">Erro</option>
                      <option value="critical">Crítico</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Duração Mínima (min)</label>
                    <input
                      type="number"
                      value={form.duracaoMin || ''}
                      onChange={e => setForm({ ...form, duracaoMin: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.publica || false}
                    onChange={e => setForm({ ...form, publica: e.target.checked })}
                    className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-zinc-300 rounded"
                  />
                  <label className="ml-2 text-sm text-zinc-700">Público</label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditing(null); setForm({}); }}
                    className="bg-zinc-200 text-zinc-800 rounded-lg py-3 px-8 text-base font-semibold hover:bg-zinc-300 transition-colors duration-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-slate-900 text-white rounded-lg py-3 px-8 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Salvando...
                      </span>
                    ) : (
                      'Salvar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-zinc-800">Tipos de Alerta</h3>
            {!showForm && (
              <button
                onClick={onOpenCreate}
                className="bg-slate-900 text-white rounded-lg py-3 px-8 flex items-center gap-2 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                Novo Tipo
              </button>
            )}
          </div>
          {loading ? (
            <div className="text-lg text-zinc-600 flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando...
            </div>
          ) : (
            <div className="space-y-4">
              {tipoAlertas.map(ta => (
                <div
                  key={ta.id}
                  className="bg-white rounded-xl border border-zinc-300 p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-zinc-800 truncate">
                      {ta.tipo}
                    </h4>
                    <p className="text-sm text-zinc-600 truncate">
                      UUID: {ta.id}
                    </p>
                    <p className="text-sm text-zinc-600">
                      {ta.condicao} {ta.valor} • Nível: {ta.nivel} • {ta.publica ? 'Público' : 'Privado'}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => onEdit(ta)}
                      className="bg-white border border-zinc-400 rounded-lg py-2 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors duration-300 cursor-pointer"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(ta.id)}
                      className="bg-red-500 text-white rounded-lg py-2 px-4 text-sm font-semibold hover:bg-red-600 transition-colors duration-300 cursor-pointer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {deletingId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                <h3 className="text-xl font-bold text-zinc-800">Confirmar Exclusão</h3>
                <p className="text-sm text-zinc-600">Deseja realmente excluir este tipo de alerta?</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="bg-zinc-200 text-zinc-800 rounded-lg py-3 px-8 text-base font-semibold hover:bg-zinc-300 transition-colors duration-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 text-white rounded-lg py-3 px-8 text-base font-semibold hover:bg-red-600 transition-colors duration-300 cursor-pointer"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TipoAlertaModal;