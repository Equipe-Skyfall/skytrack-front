import React, { useState, useEffect } from 'react';
import { X, Plus, Settings, Trash2, Loader2 } from 'lucide-react';
import { getTipoParametros, createTipoParametro, updateTipoParametro, deleteTipoParametro } from '../../services/api/tipo-parametro';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDarkMode } = useTheme();
  const [tipoParametros, setTipoParametros] = useState<TipoParametro[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<TipoParametro | null>(null);
  const [form, setForm] = useState<FormData>({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl w-full max-w-md sm:max-w-lg md:max-w-2xl mx-4 max-h-[90vh] overflow-hidden ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className={`flex justify-between items-center p-4 sm:p-6 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-zinc-200'
        }`}>
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Gerenciar Tipos de Parâmetro</h2>
          <button
            onClick={onClose}
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-zinc-600 hover:text-zinc-800'} cursor-pointer`}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {showForm && (
            <div className={`rounded-xl border p-4 sm:p-6 mb-4 sm:mb-6 shadow-md ${
              isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-zinc-200'
            }`}>
              <h4 className={`text-lg sm:text-xl font-semibold font-poppins mb-3 sm:mb-4 ${
                isDarkMode ? 'text-white' : 'text-zinc-800'
              }`}>
                {editing ? 'Editar Tipo de Parâmetro' : 'Novo Tipo de Parâmetro'}
              </h4>
              <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={`block text-sm font-medium font-poppins ${
                      isDarkMode ? 'text-gray-200' : 'text-zinc-700'
                    }`}>Nome</label>
                    <input
                      type="text"
                      value={form.nome || ''}
                      onChange={e => setForm({ ...form, nome: e.target.value })}
                      className={`mt-1 w-full rounded-md border p-2 text-sm focus:ring-slate-500 focus:border-slate-500 ${
                        isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-zinc-300 text-zinc-800'
                      }`}
                      required
                    />
                  </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-zinc-700'
                    }`}>Métrica/Unidade</label>
                    <input
                      type="text"
                      value={form.metrica || ''}
                      onChange={e => setForm({ ...form, metrica: e.target.value })}
                      className={`mt-1 w-full rounded-md border p-2 text-sm focus:ring-slate-500 focus:border-slate-500 ${
                        isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-zinc-300 text-zinc-800'
                      }`}
                      placeholder="Ex: °C, %, mm/h"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-zinc-700'
                    }`}>Coeficientes (separados por vírgula)</label>
                    <input
                      type="text"
                      value={form.coeficiente ? form.coeficiente.join(', ') : '0, 1'}
                      onChange={e => {
                        const values = e.target.value.split(',').map(v => parseFloat(v.trim()) || 0);
                        setForm({ ...form, coeficiente: values });
                      }}
                      className={`mt-1 w-full rounded-md border p-2 text-sm focus:ring-slate-500 focus:border-slate-500 ${
                        isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-zinc-300 text-zinc-800'
                      }`}
                      placeholder="Ex: 0, 1"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-zinc-700'
                    }`}>Configuração de Leitura (JSON)</label>
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
                      className={`mt-1 w-full rounded-md border p-2 text-sm focus:ring-slate-500 focus:border-slate-500 ${
                        isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-zinc-300 text-zinc-800'
                      }`}
                      placeholder='{"sensor_key": {"offset": 0, "factor": 1.0}}'
                      rows={3}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-zinc-700'
                  }`}>Polinômio (opcional)</label>
                  <input
                    type="text"
                    value={form.polinomio || ''}
                    onChange={e => setForm({ ...form, polinomio: e.target.value })}
                    className={`mt-1 w-full rounded-md border p-2 text-sm focus:ring-slate-500 focus:border-slate-500 ${
                      isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-zinc-300 text-zinc-800'
                    }`}
                  />
                </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setEditing(null); setForm({ metrica: '', coeficiente: [0, 1], leitura: {} }); }}
                    className={`border rounded-lg py-2 sm:py-3 px-4 sm:px-8 text-sm sm:text-base font-semibold transition-colors duration-300 cursor-pointer w-full sm:w-auto ${
                      isDarkMode 
                        ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' 
                        : 'bg-white border-gray-300 text-zinc-800 hover:bg-gray-50'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`rounded-lg py-2 sm:py-3 px-4 sm:px-8 text-sm sm:text-base font-semibold transition-colors duration-300 disabled:opacity-50 cursor-pointer w-full sm:w-auto ${
                      isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
            <h3 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Tipos de Parâmetro</h3>
            {!showForm && (
              <button
                onClick={onOpenCreate}
                className={`rounded-lg py-2 sm:py-3 px-4 sm:px-8 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold transition-colors duration-300 shadow-sm cursor-pointer w-full sm:w-auto ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Novo Tipo
              </button>
            )}
          </div>
          {loading ? (
            <div className={`text-sm sm:text-base md:text-lg flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              Carregando...
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {tipoParametros.map(tp => (
                <div
                  key={tp.id}
                  className={`rounded-xl border p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md hover:shadow-lg transition-shadow duration-300 w-full ${
                    isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-zinc-300'
                  }`}
                >
                  <div className="flex-1 min-w-0 w-full">
                    <h4 className={`text-sm sm:text-base font-semibold truncate ${
                      isDarkMode ? 'text-white' : 'text-zinc-800'
                    }`}>
                      {tp.nome}
                    </h4>
                    <p className={`text-xs sm:text-sm truncate ${
                      isDarkMode ? 'text-gray-300' : 'text-zinc-600'
                    }`}>
                      JSON ID: {tp.jsonId} • Métrica: {tp.metrica}
                    </p>
                    <p className={`text-xs sm:text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-zinc-600'
                    }`}>
                      Coeficientes: [{tp.coeficiente.join(', ')}] • Polinômio: {tp.polinomio || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onEdit(tp)}
                      className={`border rounded-lg py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-colors duration-300 cursor-pointer flex items-center justify-center gap-1 flex-1 sm:flex-initial ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' 
                          : 'bg-white border-zinc-400 text-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="sm:hidden">Editar</span>
                    </button>
                    <button
                      onClick={() => onDelete(tp.id)}
                      className="bg-red-600 text-white rounded-lg py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold hover:bg-red-700 transition-colors duration-300 cursor-pointer flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="sm:hidden">Deletar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {deletingId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className={`rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md space-y-3 sm:space-y-4 ${
                isDarkMode ? 'bg-slate-800' : 'bg-white'
              }`}>
                <h3 className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Confirmar Exclusão</h3>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>Deseja realmente excluir este tipo de parâmetro?</p>
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    onClick={() => setDeletingId(null)}
                    className={`border rounded-lg py-2 sm:py-3 px-4 sm:px-8 text-sm sm:text-base font-semibold transition-colors duration-300 cursor-pointer w-full sm:w-auto ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' 
                        : 'bg-white border-gray-300 text-zinc-800 hover:bg-gray-50'
                    }`}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white rounded-lg py-2 sm:py-3 px-4 sm:px-8 text-sm sm:text-base font-semibold hover:bg-red-700 transition-colors duration-300 cursor-pointer w-full sm:w-auto"
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