import React, { useState, useEffect } from 'react';
import { X, Plus, Settings, Trash2, Loader2 } from 'lucide-react';
import { getTipoParametros, createTipoParametro, updateTipoParametro, deleteTipoParametro } from '../../services/api/tipo-parametro';

type TipoParametro = {
  id: string;
  jsonId: string;
  nome: string;
  metrica: string;
  polinomio?: string;
  coeficiente: number[];
  leitura: any;
};

type FormData = Partial<Omit<TipoParametro, 'id'>>;

interface TipoParametroModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

const TipoParametroModal: React.FC<TipoParametroModalProps> = ({ open, onClose, onSave }) => {
  const [tipoParametros, setTipoParametros] = useState<TipoParametro[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<TipoParametro | null>(null);
  const [form, setForm] = useState<FormData>({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadTipoParametros = async () => {
    setLoading(true);
    try {
      const res = await getTipoParametros();
      setTipoParametros(res || []);
    } catch (err: any) {
      alert(err.message || 'Erro ao carregar tipos de parâmetro');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadTipoParametros();
    }
  }, [open]);

  const onOpenCreate = () => {
    setEditing(null);
    setForm({ metrica: '', coeficiente: [0, 1], leitura: {} });
    setShowForm(true);
  };

  const onEdit = (tp: TipoParametro) => {
    setEditing(tp);
    setForm({
      jsonId: tp.jsonId,
      nome: tp.nome,
      metrica: tp.metrica,
      coeficiente: tp.coeficiente,
      leitura: tp.leitura,
      polinomio: tp.polinomio,
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
      // Generate JSON ID automatically from name if not provided
      const jsonId = form.jsonId || form.nome?.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') || '';
      
      const payload = {
        ...form,
        jsonId,
      };
      
      if (editing) {
        await updateTipoParametro(editing.id, { ...payload, jsonId: editing.jsonId });
      } else {
        await createTipoParametro(payload);
      }
      await loadTipoParametros();
      setShowForm(false);
      setEditing(null);
      setForm({ metrica: '', coeficiente: [0, 1], leitura: {} });
      onSave();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar tipo de parâmetro');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTipoParametro(deletingId);
      await loadTipoParametros();
      onSave();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir tipo de parâmetro');
    } finally {
      setDeletingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-zinc-200">
          <h2 className="text-2xl font-bold text-zinc-800 font-poppins">Gerenciar Tipos de Parâmetro</h2>
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
                {editing ? 'Editar Tipo de Parâmetro' : 'Novo Tipo de Parâmetro'}
              </h4>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Nome</label>
                    <input
                      type="text"
                      value={form.nome || ''}
                      onChange={e => setForm({ ...form, nome: e.target.value })}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                      required
                    />
                  </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Métrica/Unidade</label>
                    <input
                      type="text"
                      value={form.metrica || ''}
                      onChange={e => setForm({ ...form, metrica: e.target.value })}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                      placeholder="Ex: °C, %, mm/h"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Coeficientes (separados por vírgula)</label>
                    <input
                      type="text"
                      value={form.coeficiente ? form.coeficiente.join(', ') : '0, 1'}
                      onChange={e => {
                        const values = e.target.value.split(',').map(v => parseFloat(v.trim()) || 0);
                        setForm({ ...form, coeficiente: values });
                      }}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                      placeholder="Ex: 0, 1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700">Configuração de Leitura (JSON)</label>
                    <textarea
                      value={typeof form.leitura === 'object' ? JSON.stringify(form.leitura, null, 2) : form.leitura || '{}'}
                      onChange={e => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setForm({ ...form, leitura: parsed });
                        } catch {
                          setForm({ ...form, leitura: e.target.value });
                        }
                      }}
                      className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                      placeholder='{"sensor_key": {"offset": 0, "factor": 1.0}}'
                      rows={3}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Polinômio (opcional)</label>
                  <input
                    type="text"
                    value={form.polinomio || ''}
                    onChange={e => setForm({ ...form, polinomio: e.target.value })}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-slate-500 focus:border-slate-500"
                  />
                </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditing(null); setForm({ metrica: '', coeficiente: [0, 1], leitura: {} }); }}
                    className="bg-white border border-gray-300 text-zinc-800 rounded-lg py-3 px-8 text-base font-semibold hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
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
            <h3 className="text-lg font-bold text-zinc-800">Tipos de Parâmetro</h3>
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
              {tipoParametros.map(tp => (
                <div
                  key={tp.id}
                  className="bg-white rounded-xl border border-zinc-300 p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-zinc-800 truncate">
                      {tp.nome}
                    </h4>
                    <p className="text-sm text-zinc-600 truncate">
                      JSON ID: {tp.jsonId} • Métrica: {tp.metrica}
                    </p>
                    <p className="text-sm text-zinc-600">
                      Coeficientes: [{tp.coeficiente.join(', ')}] • Polinômio: {tp.polinomio || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => onEdit(tp)}
                      className="bg-white border border-zinc-400 rounded-lg py-2 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors duration-300 cursor-pointer"
                    >
                      <Settings className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(tp.id)}
                      className="bg-red-600 text-white rounded-lg py-2 px-4 text-sm font-semibold hover:bg-red-700 transition-colors duration-300 cursor-pointer"
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
                <p className="text-sm text-zinc-600">Deseja realmente excluir este tipo de parâmetro?</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="bg-white border border-gray-300 text-zinc-800 rounded-lg py-3 px-8 text-base font-semibold hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white rounded-lg py-3 px-8 text-base font-semibold hover:bg-red-700 transition-colors duration-300 cursor-pointer"
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

export default TipoParametroModal;