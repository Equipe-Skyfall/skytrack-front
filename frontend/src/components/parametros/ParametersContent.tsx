import React, { useState, useEffect } from 'react';
import { Gauge, Plus, Settings, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TipoParametroModal from '../modals/TipoParametroModal';
import type { TipoParametroDto, TipoAlertaDto, ParameterDto, CreateParameterDto, UpdateParameterDto, StationDto, ParameterFormData } from './types';
import { getParameters, createParameter, updateParameter, deleteParameter } from '../../services/api/parameters';
import { getTipoParametros } from '../../services/api/tipo-parametro';
import { getTipoAlertas } from '../../services/api/tipo-alerta';
const ParametersContent: React.FC = () => {
  const { token } = useAuth();
  const [parameters, setParameters] = useState<ParameterDto[]>([]);
  const [tipoParametros, setTipoParametros] = useState<TipoParametroDto[]>([]);
  const [tipoAlertas, setTipoAlertas] = useState<TipoAlertaDto[]>([]);
  const [stations, setStations] = useState<StationDto[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<ParameterFormData>({
    stationId: '',
    tipoParametroId: '',
    tipoAlertaId: '',
  });
  const [editParamId, setEditParamId] = useState<string | null>(null);
  const [deleteParamId, setDeleteParamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'parametros' | 'tipos'>('parametros');
  const [showTipoParametroModal, setShowTipoParametroModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar associações de parâmetros
        const paramResponse = await getParameters(1, 100);
        setParameters(paramResponse.data);

        // Buscar tipos de parâmetros para referência
        const tipoParamResponse = await getTipoParametros();
        setTipoParametros(tipoParamResponse);

        // Buscar tipos de alertas para referência
        const tipoAlertasResponse = await getTipoAlertas();
        setTipoAlertas(tipoAlertasResponse);

        // Buscar estações para referência
        const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
        const stationResponse = await fetch(`${API_BASE_URL}/api/stations?limit=100&page=1`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (!stationResponse.ok) throw new Error(`Erro ao buscar estações: ${stationResponse.status}`);
        
        let stationData;
        try {
          const text = await stationResponse.text();
          if (text) {
            stationData = JSON.parse(text);
          } else {
            throw new Error('Resposta vazia do servidor para estações');
          }
        } catch (e) {
          throw new Error('Erro ao processar dados das estações');
        }
        
        const stations = stationData.data || [];
        setStations(stations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  const getParameterDetails = (param: ParameterDto) => {
    const tipoParametro = tipoParametros.find(tp => tp.id === param.tipoParametroId);
    const station = stations.find(s => s.id === param.stationId);
    return { tipoParametro, station };
  };

  const handleAddParameter = () => {
    setFormData({
      stationId: '',
      tipoParametroId: '',
      tipoAlertaId: '',
    });
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleEditParameter = (paramId: string) => {
    const param = parameters.find((p) => p.id === paramId);
    if (param) {
      setFormData({
        stationId: param.stationId,
        tipoParametroId: param.tipoParametroId,
        tipoAlertaId: param.tipoAlertaId || '',
      });
      setEditParamId(paramId);
      setError(null);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteParameter = (paramId: string) => {
    setDeleteParamId(paramId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteParamId || !token) {
      alert('Sessão expirada. Faça login para excluir parâmetros.');
      handleModalClose();
      return;
    }
    
    try {
      await deleteParameter(deleteParamId, token);
      setParameters((prev) => prev.filter((param) => param.id !== deleteParamId));
      handleModalClose();
    } catch (error: any) {
      setError(error.message || 'Erro ao excluir parâmetro');
      // Close modal even on error after showing the error
      setTimeout(() => {
        handleModalClose();
      }, 3000); // Close modal after 3 seconds to show error message
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setFormData({
      stationId: '',
      tipoParametroId: '',
      tipoAlertaId: '',
    });
    setEditParamId(null);
    setDeleteParamId(null);
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  // UUID validation helper function
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const handleParameterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      alert('Sessão expirada. Faça login para salvar parâmetro.');
      return;
    }
    if (isAddModalOpen) {
      // Para criação, todos os campos obrigatórios devem estar presentes
      if (!formData.stationId || !formData.tipoParametroId) {
        setError('Estação e Tipo de Parâmetro são obrigatórios');
        return;
      }

      // Validate UUIDs for creation
      if (!isValidUUID(formData.stationId)) {
        setError(`ID da estação inválido (não é UUID): ${formData.stationId}`);
        return;
      }
      
      if (!isValidUUID(formData.tipoParametroId)) {
        setError(`ID do tipo de parâmetro inválido (não é UUID): ${formData.tipoParametroId}`);
        return;
      }
    }

    // Validate tipoAlertaId if provided (for both create and update)
    if (formData.tipoAlertaId && formData.tipoAlertaId !== '' && !isValidUUID(formData.tipoAlertaId)) {
      setError(`ID do tipo de alerta inválido (não é UUID): ${formData.tipoAlertaId}`);
      return;
    }

    try {
      if (isAddModalOpen) {
        const createDto: CreateParameterDto = {
          stationId: formData.stationId,
          tipoParametroId: formData.tipoParametroId,
          tipoAlertaId: formData.tipoAlertaId || undefined,
        };
        const newParam = await createParameter(createDto, token);
        setParameters((prev) => [...prev, newParam]);
      } else if (isEditModalOpen && editParamId) {
        // Para edição, só podemos atualizar o tipoAlertaId
        const updateDto: UpdateParameterDto = {
          tipoAlertaId: formData.tipoAlertaId || undefined,
        };
        const updatedParam = await updateParameter(editParamId, updateDto, token);
        setParameters((prev) =>
          prev.map((param) => (param.id === editParamId ? updatedParam : param))
        );
      }
      handleModalClose();
    } catch (error: any) {
      setError(error.message || 'Erro ao salvar parâmetro');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <div className="text-lg text-zinc-600">Carregando parâmetros...</div>
      </div>
    );
  }

  if (error && !parameters.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <div className="text-red-500 text-lg">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white font-poppins flex">
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-full mx-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-800 tracking-tight">Parâmetros</h1>
            <p className="text-base md:text-lg text-zinc-600">Gerencie e monitore todos os parâmetros utilizados</p>
          </div>
          {token && (
            <div className="flex gap-4">
              <button
                onClick={handleAddParameter}
                className="bg-slate-900 text-white rounded-lg py-3 px-8 flex items-center gap-2 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
              >
                <Plus className="h-5 w-5" />
                Adicionar Parâmetro
              </button>
              <button
                onClick={() => setShowTipoParametroModal(true)}
                className="bg-slate-900 text-white rounded-lg py-3 px-8 flex items-center gap-2 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
              >
                <Settings className="h-5 w-5" />
                Gerenciar Tipos
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('parametros')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'parametros'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
              }`}
            >
              Parâmetros
            </button>
            <button
              onClick={() => setActiveTab('tipos')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tipos'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
              }`}
            >
              Tipos de Parâmetro
            </button>
          </nav>
        </div>

        {activeTab === 'parametros' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {parameters.map((param) => {
                const { tipoParametro, station } = getParameterDetails(param);
                return (
                  <div
                    key={param.id}
                    className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-zinc-100 rounded-lg p-2">
                        <Gauge className="h-6 w-6 text-zinc-700" />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-800">
                        {tipoParametro?.nome || 'Tipo não encontrado'}
                      </h2>
                      <div className="ml-auto bg-lime-500 text-white rounded-full px-3 py-1 text-xs font-semibold">Ativo</div>
                    </div>
                    <div className="bg-zinc-100 rounded-lg p-4">
                      <span className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Gauge className="h-4 w-4" />
                        {tipoParametro?.metrica || 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-600">
                      <strong>Estação:</strong> {station?.name || 'Estação não encontrada'}<br />
                      <strong>Tipo de Parâmetro:</strong> {tipoParametro?.nome || 'N/A'}<br />
                      <strong>JSON ID:</strong> {tipoParametro?.jsonId || 'N/A'}<br />
                      <strong>Métrica:</strong> {tipoParametro?.metrica || 'N/A'}<br />
                      <strong>Coeficientes:</strong> {tipoParametro?.coeficiente ? `[${tipoParametro.coeficiente.join(', ')}]` : 'N/A'}
                    </p>
                    {token && (
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEditParameter(param.id)}
                          className="bg-white border border-zinc-400 rounded-lg py-3 px-10 flex items-center justify-center gap-2 text-base font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors duration-300 shadow-sm cursor-pointer"
                        >
                          <Settings className="h-5 w-5" />
                          Configurar
                        </button>
                        <button
                          onClick={() => handleDeleteParameter(param.id)}
                          className="bg-red-500 text-white rounded-lg py-3 px-10 flex items-center justify-center gap-2 text-base font-semibold hover:bg-red-600 transition-colors duration-300 shadow-sm cursor-pointer"
                        >
                          <Trash2 className="h-5 w-5" />
                          Deletar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'tipos' && (
          <div className="text-center py-12">
            <p className="text-zinc-600">Use o botão "Gerenciar Tipos" para administrar os tipos de parâmetro.</p>
          </div>
        )}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-zinc-800">
                  {isAddModalOpen ? 'Adicionar Parâmetro' : 'Editar Parâmetro'}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-zinc-600 hover:text-zinc-800 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <form onSubmit={handleParameterSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Estação</label>
                  <select
                    name="stationId"
                    value={formData.stationId}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border p-2 text-sm ${
                      isEditModalOpen 
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed' 
                        : 'border-zinc-300'
                    }`}
                    required={isAddModalOpen}
                    disabled={isEditModalOpen}
                  >
                    <option value="" disabled>Selecione uma estação</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                  {isEditModalOpen && (
                    <p className="mt-1 text-xs text-zinc-500">
                      A estação não pode ser alterada após a criação
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Tipo de Parâmetro</label>
                  <select
                    name="tipoParametroId"
                    value={formData.tipoParametroId}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border p-2 text-sm ${
                      isEditModalOpen 
                        ? 'bg-zinc-100 border-zinc-200 text-zinc-500 cursor-not-allowed' 
                        : 'border-zinc-300'
                    }`}
                    required={isAddModalOpen}
                    disabled={isEditModalOpen}
                  >
                    <option value="" disabled>Selecione um tipo de parâmetro</option>
                    {tipoParametros.map((tipoParametro) => (
                      <option key={tipoParametro.id} value={tipoParametro.id}>
                        {tipoParametro.nome} ({tipoParametro.metrica})
                      </option>
                    ))}
                  </select>
                  {isEditModalOpen && (
                    <p className="mt-1 text-xs text-zinc-500">
                      O tipo de parâmetro não pode ser alterado após a criação
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Tipo de Alerta (opcional)
                    {isEditModalOpen && (
                      <span className="text-blue-600 font-normal"> - Campo editável</span>
                    )}
                  </label>
                  <select
                    name="tipoAlertaId"
                    value={formData.tipoAlertaId}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Nenhum</option>
                    {tipoAlertas.map((tipoAlerta) => (
                      <option key={tipoAlerta.id} value={tipoAlerta.id}>
                        {tipoAlerta.tipo} ({tipoAlerta.nivel})
                      </option>
                    ))}
                  </select>
                  {isEditModalOpen && (
                    <p className="mt-1 text-xs text-blue-600">
                      Apenas o tipo de alerta pode ser modificado durante a edição
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="bg-zinc-200 text-zinc-800 rounded-lg py-3 px-8 text-base font-semibold hover:bg-zinc-300 transition-colors duration-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 text-white rounded-lg py-3 px-8 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-zinc-800">Confirmar Exclusão</h2>
                <button
                  onClick={handleModalClose}
                  className="text-zinc-600 hover:text-zinc-800 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <p className="text-sm text-zinc-600">
                Tem certeza que deseja deletar o parâmetro{' '}
                <span className="font-semibold">
                  {(() => {
                    const param = parameters.find((p) => p.id === deleteParamId);
                    if (param) {
                      const { tipoParametro, station } = getParameterDetails(param);
                      return `${tipoParametro?.nome || 'Tipo não encontrado'} (${station?.name || 'Estação não encontrada'})`;
                    }
                    return 'Parâmetro não encontrado';
                  })()}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleModalClose}
                  className="bg-zinc-200 text-zinc-800 rounded-lg py-3 px-8 text-base font-semibold hover:bg-zinc-300 transition-colors duration-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 text-white rounded-lg py-3 px-8 text-base font-semibold hover:bg-red-600 transition-colors duration-300 cursor-pointer"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <TipoParametroModal
          open={showTipoParametroModal}
          onClose={() => setShowTipoParametroModal(false)}
          onSave={async () => {
            // Reload tipo parametros when tipo parametro is saved
            try {
              const tipoParamResponse = await getTipoParametros();
              setTipoParametros(tipoParamResponse);
            } catch (err) {
              console.error('Erro ao recarregar tipos de parâmetro:', err);
            }
          }}
        />
      </div>
    );
};

export default ParametersContent;