import React, { useState, useEffect } from 'react';
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
    setForm({ tipo: ta.tipo, publica: ta.publica, condicao: ta.condicao, valor: ta.valor, limite: ta.limite, nivel: ta.nivel, duracaoMin: ta.duracaoMin });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Gerenciar Tipos de Alerta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
            
        <div className="p-6 bg-blue">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Tipos de Alerta</h3>
            <button
              onClick={onOpenCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Novo Tipo
            </button>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tipoAlertas.map(ta => (
                <div key={ta.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <div className="font-medium">{ta.tipo}</div>
                    <div className="text-xs text-gray-500 mb-1">UUID: {ta.id}</div>
                    <div className="text-sm text-gray-600">
                      {ta.condicao} {ta.valor} • Nível: {ta.nivel} • {ta.publica ? 'Público' : 'Privado'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(ta)}
                      className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(ta.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div className="border-t p-6">
            <h4 className="text-lg font-medium mb-4">{editing ? 'Editar Tipo' : 'Novo Tipo'}</h4>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo</label>
                  <input
                    type="text"
                    value={form.tipo || ''}
                    onChange={e => setForm({ ...form, tipo: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condição</label>
                  <select
                    value={form.condicao || ''}
                    onChange={e => setForm({ ...form, condicao: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="GREATER_THAN">Maior que</option>
                    <option value="LESS_THAN">Menor que</option>
                    <option value="EQUALS">Igual a</option>
                    <option value="NOT_EQUALS">Diferente de</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Valor</label>
                  <input
                    type="text"
                    value={form.valor || ''}
                    onChange={e => setForm({ ...form, valor: e.target.value })}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Limite</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.limite || ''}
                    onChange={e => setForm({ ...form, limite: parseFloat(e.target.value) })}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nível</label>
                  <select
                    value={form.nivel || 'warning'}
                    onChange={e => setForm({ ...form, nivel: e.target.value })}
                    className="w-full border rounded p-2"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Aviso</option>
                    <option value="error">Erro</option>
                    <option value="critical">Crítico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duração Mínima (min)</label>
                  <input
                    type="number"
                    value={form.duracaoMin || ''}
                    onChange={e => setForm({ ...form, duracaoMin: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.publica || false}
                  onChange={e => setForm({ ...form, publica: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm">Público</label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditing(null); setForm({}); }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        )}
            </div>
        {deletingId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium mb-4">Confirmar Exclusão</h3>
              <p className="mb-4">Deseja realmente excluir este tipo de alerta?</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TipoAlertaModal;