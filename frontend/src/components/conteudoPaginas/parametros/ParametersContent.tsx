import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gauge, Droplet, Droplets, Plus, Settings, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const TIPO_PARAMETRO_API_URL = 'https://sky-track-backend-pdvnirgar-fabios-projects-ee9987e5.vercel.app/api/tipo-parametro';
const PARAMETER_API_URL = 'https://sky-track-backend-pdvnirgar-fabios-projects-ee9987e5.vercel.app/api/parameters';
const STATION_API_URL = 'https://sky-track-backend-pdvnirgar-fabios-projects-ee9987e5.vercel.app/api/stations';

interface TipoParametroDto {
  id: string;
  jsonId: string;
  nome: string;
  metrica: string;
  polinomio: string | null;
  coeficiente: number[];
  leitura: Record<string, { factor: number; offset: number }>;
}

interface CreateParameterDto {
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId?: string;
}

interface StationDto {
  id: string;
  name: string;
}

interface LeituraFormData {
  key: string;
  factor: string;
  offset: string;
}

interface ParameterFormData {
  jsonId: string;
  nome: string;
  metrica: string;
  polinomio: string;
  coeficiente: string;
  leituras: LeituraFormData[];
}

interface AssociationFormData {
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId: string;
}

const ParametersContent: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [parameters, setParameters] = useState<TipoParametroDto[]>([]);
  const [stations, setStations] = useState<StationDto[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
  const [formData, setFormData] = useState<ParameterFormData>({
    jsonId: '',
    nome: '',
    metrica: '',
    polinomio: '',
    coeficiente: '',
    leituras: [{ key: '', factor: '', offset: '' }],
  });
  const [associateFormData, setAssociateFormData] = useState<AssociationFormData>({
    stationId: '',
    tipoParametroId: '',
    tipoAlertaId: '',
  });
  const [editParamId, setEditParamId] = useState<string | null>(null);
  const [deleteParamId, setDeleteParamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar tipos de parâmetros
        const paramResponse = await fetch(TIPO_PARAMETRO_API_URL, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (!paramResponse.ok) throw new Error(`Erro ao buscar parâmetros: ${paramResponse.status}`);
        const paramData = await paramResponse.json();
        setParameters(paramData || []);

        // Buscar estações
        const stationResponse = await fetch(`${STATION_API_URL}?limit=100&page=1`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (!stationResponse.ok) throw new Error(`Erro ao buscar estações: ${stationResponse.status}`);
        const stationData = await stationResponse.json();
        setStations(stationData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIconForMetrica = (metrica: string): 'Droplet' | 'Gauge' | 'Droplets' => {
    if (metrica === '°C') return 'Droplet';
    if (metrica === 'mm') return 'Droplets';
    return 'Gauge';
  };

  const handleAddParameter = () => {
    setFormData({
      jsonId: '',
      nome: '',
      metrica: '',
      polinomio: '',
      coeficiente: '',
      leituras: [{ key: '', factor: '', offset: '' }],
    });
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleEditParameter = (paramId: string) => {
    const param = parameters.find((p) => p.id === paramId);
    if (param) {
      const leituras = Object.entries(param.leitura).map(([key, value]) => ({
        key,
        factor: value.factor.toString(),
        offset: value.offset.toString(),
      }));
      setFormData({
        jsonId: param.jsonId,
        nome: param.nome,
        metrica: param.metrica,
        polinomio: param.polinomio || '',
        coeficiente: param.coeficiente.join(','),
        leituras: leituras.length > 0 ? leituras : [{ key: '', factor: '', offset: '' }],
      });
      setEditParamId(paramId);
      setError(null);
      setIsEditModalOpen(true);
    }
  };

  const handleAssociateParameter = (paramId: string) => {
    setAssociateFormData({
      stationId: '',
      tipoParametroId: paramId,
      tipoAlertaId: '',
    });
    setError(null);
    setIsAssociateModalOpen(true);
  };

  const handleDeleteParameter = (paramId: string) => {
    setDeleteParamId(paramId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteParamId || !token) {
      alert('Sessão expirada. Faça login para excluir parâmetros.');
      return;
    }
    try {
      const response = await fetch(`${TIPO_PARAMETRO_API_URL}/${deleteParamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao excluir: ${response.status}`);
      }
      setParameters((prev) => prev.filter((param) => param.id !== deleteParamId));
      setIsDeleteModalOpen(false);
      setDeleteParamId(null);
    } catch (error: any) {
      setError(error.message || 'Erro ao excluir parâmetro');
      console.error('Erro ao excluir:', error);
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsAssociateModalOpen(false);
    setFormData({
      jsonId: '',
      nome: '',
      metrica: '',
      polinomio: '',
      coeficiente: '',
      leituras: [{ key: '', factor: '', offset: '' }],
    });
    setAssociateFormData({ stationId: '', tipoParametroId: '', tipoAlertaId: '' });
    setEditParamId(null);
    setDeleteParamId(null);
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (index !== undefined) {
      setFormData((prev) => ({
        ...prev,
        leituras: prev.leituras.map((leitura, i) =>
          i === index ? { ...leitura, [name]: value } : leitura
        ),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAssociateInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAssociateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addLeituraField = () => {
    setFormData((prev) => ({
      ...prev,
      leituras: [...prev.leituras, { key: '', factor: '', offset: '' }],
    }));
  };

  const removeLeituraField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      leituras: prev.leituras.filter((_, i) => i !== index),
    }));
  };

  const handleParameterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Sessão expirada. Faça login para salvar parâmetros.');
      return;
    }
    if (!formData.jsonId || !formData.nome || !formData.metrica || formData.leituras.some(l => !l.key)) {
      setError('Os campos JSON ID, Nome, Métrica e todas as Chaves de Leitura são obrigatórios');
      return;
    }

    const coeficienteArray = formData.coeficiente
      .split(',')
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));

    if (formData.polinomio && coeficienteArray.length === 0) {
      setError('Forneça coeficientes válidos para o polinômio');
      return;
    }

    if (formData.leituras.some(l => isNaN(parseFloat(l.factor)) || isNaN(parseFloat(l.offset)))) {
      setError('Fator e Offset das leituras devem ser números válidos');
      return;
    }

    const createDto = {
      jsonId: formData.jsonId,
      nome: formData.nome,
      metrica: formData.metrica,
      polinomio: formData.polinomio || null,
      coeficiente: coeficienteArray,
      leitura: formData.leituras.reduce((acc, l) => ({
        ...acc,
        [l.key]: { factor: parseFloat(l.factor), offset: parseFloat(l.offset) },
      }), {}),
    };

    try {
      if (isAddModalOpen) {
        const response = await fetch(TIPO_PARAMETRO_API_URL, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(createDto),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao criar: ${response.status}`);
        }
        const newParam: TipoParametroDto = await response.json();
        setParameters((prev) => [...prev, newParam]);
      } else if (isEditModalOpen && editParamId) {
        const updateDto = {
          jsonId: formData.jsonId,
          nome: formData.nome,
          metrica: formData.metrica,
          polinomio: formData.polinomio || null,
          coeficiente: coeficienteArray,
          leitura: formData.leituras.reduce((acc, l) => ({
            ...acc,
            [l.key]: { factor: parseFloat(l.factor), offset: parseFloat(l.offset) },
          }), {}),
        };
        const response = await fetch(`${TIPO_PARAMETRO_API_URL}/${editParamId}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updateDto),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ao editar: ${response.status}`);
        }
        const updatedParam: TipoParametroDto = await response.json();
        setParameters((prev) =>
          prev.map((param) => (param.id === editParamId ? updatedParam : param))
        );
      }
      handleModalClose();
    } catch (error: any) {
      setError(error.message || 'Erro ao salvar parâmetro');
      console.error('Erro ao salvar:', error);
    }
  };

  const handleAssociateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Sessão expirada. Faça login para associar parâmetros.');
      return;
    }
    if (!associateFormData.stationId || !associateFormData.tipoParametroId) {
      setError('Estação e Tipo de Parâmetro são obrigatórios');
      return;
    }

    const createDto: CreateParameterDto = {
      stationId: associateFormData.stationId,
      tipoParametroId: associateFormData.tipoParametroId,
      tipoAlertaId: associateFormData.tipoAlertaId || undefined,
    };

    try {
      const response = await fetch(PARAMETER_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(createDto),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao associar: ${response.status}`);
      }
      handleModalClose();
      alert('Parâmetro associado com sucesso!');
    } catch (error: any) {
      setError(error.message || 'Erro ao associar parâmetro');
      console.error('Erro ao associar:', error);
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
            <button
              onClick={handleAddParameter}
              className="bg-slate-900 text-white rounded-lg py-3 px-8 flex items-center gap-2 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Adicionar Parâmetro
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {parameters.map((param) => (
            <div
              key={param.id}
              className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="bg-zinc-100 rounded-lg p-2">

                  {getIconForMetrica(param.metrica) === 'Droplet' && <Droplet className="h-6 w-6 text-zinc-700" />}
                  {getIconForMetrica(param.metrica) === 'Gauge' && <Gauge className="h-6 w-6 text-zinc-700" />}
                  {getIconForMetrica(param.metrica) === 'Droplets' && <Droplets className="h-6 w-6 text-zinc-700" />}
                </div>
                <h2 className="text-lg font-bold text-zinc-800">{param.nome}</h2>
                <div className="ml-auto bg-lime-500 text-white rounded-full px-3 py-1 text-xs font-semibold">Ativo</div>
              </div>
              <div className="bg-zinc-100 rounded-lg p-4">
                <span className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                  {getIconForMetrica(param.metrica) === 'Droplet' && <Droplet className="h-4 w-4" />}
                  {getIconForMetrica(param.metrica) === 'Gauge' && <Gauge className="h-4 w-4" />}
                  {getIconForMetrica(param.metrica) === 'Droplets' && <Droplets className="h-4 w-4" />}
                  {param.metrica}
                </span>
              </div>
              <p className="text-sm text-zinc-600">
                <strong>JSON ID:</strong> {param.jsonId}<br />
                <strong>Polinômio:</strong> {param.polinomio || 'Sem polinômio'}<br />
                <strong>Coeficientes:</strong> {param.coeficiente.join(', ')}<br />
                <strong>Leituras:</strong><br />
                {Object.entries(param.leitura).map(([key, value]) => (
                  <span key={key}>
                    {key} (Factor: {value.factor}, Offset: {value.offset})<br />
                  </span>
                ))}
              </p>
              {token && (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleAssociateParameter(param.id)}
                    className="bg-blue-500 text-white rounded-lg py-3 px-10 flex items-center justify-center gap-2 text-base font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-sm cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                    Associar
                  </button>
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
          ))}
        </div>
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
                  <label className="block text-sm font-medium text-zinc-700">JSON ID</label>
                  <input
                    type="text"
                    name="jsonId"
                    value={formData.jsonId}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: temperature_sensor"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Nome do Resultado do Polinômio</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: Temperatura Calculada"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Métrica</label>
                  <input
                    type="text"
                    name="metrica"
                    value={formData.metrica}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: °C"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Polinômio (opcional)</label>
                  <input
                    type="text"
                    name="polinomio"
                    value={formData.polinomio}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: a0 + a1*temperatura"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Coeficientes (separados por vírgula)</label>
                  <input
                    type="text"
                    name="coeficiente"
                    value={formData.coeficiente}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: 1,0.95"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Leituras</label>
                  {formData.leituras.map((leitura, index) => (
                    <div key={index} className="space-y-2 mb-4 border-b pb-2">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700">Chave</label>
                        <input
                          type="text"
                          name="key"
                          value={leitura.key}
                          onChange={(e) => handleInputChange(e, index)}
                          className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                          placeholder="Ex: temperatura"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-zinc-700">Fator</label>
                          <input
                            type="number"
                            name="factor"
                            value={leitura.factor}
                            onChange={(e) => handleInputChange(e, index)}
                            className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                            placeholder="Ex: 1"
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-zinc-700">Offset</label>
                          <input
                            type="number"
                            name="offset"
                            value={leitura.offset}
                            onChange={(e) => handleInputChange(e, index)}
                            className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                            placeholder="Ex: 0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                      {formData.leituras.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLeituraField(index)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          Remover Leitura
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLeituraField}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    + Adicionar Leitura
                  </button>
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
        
        {isAssociateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-zinc-800">Associar Parâmetro</h2>
                <button
                  onClick={handleModalClose}
                  className="text-zinc-600 hover:text-zinc-800 cursor-pointer"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <form onSubmit={handleAssociateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Estação</label>
                  <select
                    name="stationId"
                    value={associateFormData.stationId}
                    onChange={handleAssociateInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    required
                  >
                    <option value="" disabled>Selecione uma estação</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Tipo de Alerta (opcional)</label>
                  <input
                    type="text"
                    name="tipoAlertaId"
                    value={associateFormData.tipoAlertaId}
                    onChange={handleAssociateInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: 550e8400-e29b-41d4-a716-446655440002"
                  />
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
                    Associar
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
              <p className="text-sm text-zinc-600">
                Tem certeza que deseja deletar o parâmetro{' '}
                <span className="font-semibold">
                  {parameters.find((p) => p.id === deleteParamId)?.nome}
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
      </div>
    );
  };
  
  export default ParametersContent;
