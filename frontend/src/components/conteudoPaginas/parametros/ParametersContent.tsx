import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gauge, Droplet, Droplets, Plus, Settings, X, Trash2 } from 'lucide-react';

interface Parameter {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: 'Droplet' | 'Gauge' | 'Droplets';
}

interface ParameterFormData {
  name: string;
  shortName: string;
  description: string;
  icon: 'Droplet' | 'Gauge' | 'Droplets' | '';
}

const mockParameters: Parameter[] = [
  {
    id: '1',
    name: 'Parâmetro 1',
    shortName: 'Chuva',
    description: 'Transforma o valor chu no parâmetro Chuva.',
    icon: 'Droplet',
  },
  {
    id: '2',
    name: 'Parâmetro 2',
    shortName: 'Pluviômetro',
    description: 'Transforma o valor pluv no parâmetro Pluviômetro.',
    icon: 'Droplet',
  },
  {
    id: '3',
    name: 'Parâmetro 3',
    shortName: 'Sensor',
    description: 'Transforma o valor sen no parâmetro Sensor.',
    icon: 'Gauge',
  },
  {
    id: '4',
    name: 'Parâmetro 4',
    shortName: 'Umidade',
    description: 'Transforma o valor umi no parâmetro Umidade.',
    icon: 'Droplets',
  },
];

const ParametersContent: React.FC = () => {
  const navigate = useNavigate();
  const [parameters, setParameters] = useState<Parameter[]>(mockParameters);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<ParameterFormData>({
    name: '',
    shortName: '',
    description: '',
    icon: '',
  });
  const [editParamId, setEditParamId] = useState<string | null>(null);
  const [deleteParamId, setDeleteParamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddParameter = () => {
    setFormData({ name: '', shortName: '', description: '', icon: '' });
    setError(null);
    setIsAddModalOpen(true);
  };

  const handleEditParameter = (paramId: string) => {
    const param = parameters.find((p) => p.id === paramId);
    if (param) {
      setFormData({
        name: param.name,
        shortName: param.shortName,
        description: param.description,
        icon: param.icon,
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

  const confirmDelete = () => {
    if (deleteParamId) {
      setParameters((prev) => prev.filter((param) => param.id !== deleteParamId));
    }
    setIsDeleteModalOpen(false);
    setDeleteParamId(null);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setFormData({ name: '', shortName: '', description: '', icon: '' });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.shortName || !formData.description || !formData.icon) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const newParam: Parameter = {
      id: isAddModalOpen ? (parameters.length + 1).toString() : editParamId!,
      name: formData.name,
      shortName: formData.shortName,
      description: formData.description,
      icon: formData.icon as 'Droplet' | 'Gauge' | 'Droplets',
    };

    if (isAddModalOpen) {
      // Adicionar novo parâmetro
      setParameters((prev) => [...prev, newParam]);
    } else if (isEditModalOpen && editParamId) {
      // Editar parâmetro existente
      setParameters((prev) =>
        prev.map((param) => (param.id === editParamId ? newParam : param))
      );
    }

    handleModalClose();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white font-poppins flex">
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 max-w-full mx-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-800 tracking-tight">Parâmetros</h1>
            <p className="text-base md:text-lg text-zinc-600">Gerencie e monitore todos os parâmetros utilizados</p>
          </div>
          <button
            onClick={handleAddParameter}
            className="bg-slate-900 text-white rounded-lg py-2 px-8 flex items-center gap-2 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Adicionar Parâmetros
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {parameters.map((param) => (
            <div
              key={param.id}
              className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="bg-zinc-100 rounded-lg p-2">
                  {param.icon === 'Droplet' && <Droplet className="h-6 w-6 text-zinc-700" />}
                  {param.icon === 'Gauge' && <Gauge className="h-6 w-6 text-zinc-700" />}
                  {param.icon === 'Droplets' && <Droplets className="h-6 w-6 text-zinc-700" />}
                </div>
                <h2 className="text-lg font-bold text-zinc-800">{param.name}</h2>
                <div className="ml-auto bg-lime-500 text-white rounded-full px-3 py-1 text-xs font-semibold">Online</div>
              </div>
              <div className="bg-zinc-100 rounded-lg p-4">
                <span className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                  {param.icon === 'Droplet' && <Droplet className="h-4 w-4" />}
                  {param.icon === 'Gauge' && <Gauge className="h-4 w-4" />}
                  {param.icon === 'Droplets' && <Droplets className="h-4 w-4" />}
                  {param.shortName}
                </span>
              </div>
              <p className="text-sm text-zinc-600">
                Descrição:<br />
                {param.description}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleEditParameter(param.id)}
                  className="bg-white border border-zinc-400 rounded-lg py-2 px-10 flex items-center justify-center gap-2 text-base font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors duration-300 shadow-sm cursor-pointer"
                >
                  <Settings className="h-5 w-5" />
                  Configurar
                </button>
                <button
                  onClick={() => handleDeleteParameter(param.id)}
                  className="bg-red-500 text-white rounded-lg py-2 px-10 flex items-center justify-center gap-2 text-base font-semibold hover:bg-red-600 transition-colors duration-300 shadow-sm cursor-pointer"
                >
                  <Trash2 className="h-5 w-5" />
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Nome</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: Parâmetro 5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Nome Curto</label>
                  <input
                    type="text"
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: Chuva"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Ícone</label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    required
                  >
                    <option value="" disabled>
                      Selecione um ícone
                    </option>
                    <option value="Droplet">Droplet (Gota)</option>
                    <option value="Gauge">Gauge (Medidor)</option>
                    <option value="Droplets">Droplets (Gotas)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">Descrição</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-md border border-zinc-300 p-2 text-sm"
                    placeholder="Ex: Transforma o valor x no parâmetro Y."
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="bg-zinc-200 text-zinc-800 rounded-lg py-2 px-8 text-base font-semibold hover:bg-zinc-300 transition-colors duration-300 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-900 text-white rounded-lg py-2 px-8 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 cursor-pointer"
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
              <p className="text-sm text-zinc-600">
                Tem certeza que deseja deletar o parâmetro{' '}
                <span className="font-semibold">
                  {parameters.find((p) => p.id === deleteParamId)?.name}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleModalClose}
                  className="bg-zinc-200 text-zinc-800 rounded-lg py-2 px-8 text-base font-semibold hover:bg-zinc-300 transition-colors duration-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white rounded-lg py-2 px-8 text-base font-semibold hover:bg-red-600 transition-colors duration-300 cursor-pointer"
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