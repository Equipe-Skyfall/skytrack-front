import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Tipo para dados de parâmetro
export interface ParametroData {
  id: string;
  nome: string;
  descricao: string;
  unidade: string;
  valor: number;
  valorMin?: number;
  valorMax?: number;
  ativo: boolean;
  stationId: string;
  stationName?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para dados do formulário de parâmetro
export interface ParametroFormData {
  nome: string;
  descricao: string;
  unidade: string;
  valor: number;
  valorMin?: number;
  valorMax?: number;
  ativo: boolean;
  stationId: string;
}

export const useParametrosPage = () => {
  const { user } = useAuth();
  
  // Estado dos dados
  const [parametros, setParametros] = useState<ParametroData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado da UI
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingParameter, setEditingParameter] = useState<ParametroData | null>(null);
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroEstacao, setFiltroEstacao] = useState('');

  // Simulação de carregamento de parâmetros (substituir por API real)
  const loadParametros = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      const mockParametros: ParametroData[] = [
        {
          id: '1',
          nome: 'Temperatura',
          descricao: 'Temperatura ambiente',
          unidade: '°C',
          valor: 25.5,
          valorMin: -10,
          valorMax: 50,
          ativo: true,
          stationId: '1',
          stationName: 'Estação Central',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          nome: 'Umidade',
          descricao: 'Umidade relativa do ar',
          unidade: '%',
          valor: 65,
          valorMin: 0,
          valorMax: 100,
          ativo: true,
          stationId: '1',
          stationName: 'Estação Central',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: '3',
          nome: 'Pressão',
          descricao: 'Pressão atmosférica',
          unidade: 'hPa',
          valor: 1013.25,
          valorMin: 900,
          valorMax: 1100,
          ativo: false,
          stationId: '2',
          stationName: 'Estação Norte',
          createdAt: '2024-01-03T00:00:00.000Z',
        },
      ];
      
      setParametros(mockParametros);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar parâmetros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParametros();
  }, []);

  // Handlers da página
  const onOpenAddModal = () => {
    setShowAddModal(true);
  };

  const onCloseAddModal = () => {
    setShowAddModal(false);
  };

  const onAddParameter = async (parameterData: ParametroFormData) => {
    try {
      // Simular criação de parâmetro (substituir por API real)
      const newParameter: ParametroData = {
        id: Date.now().toString(),
        ...parameterData,
        createdAt: new Date().toISOString(),
      };
      
      setParametros(prev => [newParameter, ...prev]);
      setShowAddModal(false);
    } catch (error: any) {
      alert(error.message || 'Erro ao criar parâmetro');
      throw error;
    }
  };

  const onEditParameter = (parametro: ParametroData) => {
    setEditingParameter(parametro);
  };

  const onCloseEditModal = () => {
    setEditingParameter(null);
  };

  const onUpdateParameter = async (parameterData: ParametroFormData) => {
    if (!editingParameter) return;
    try {
      // Simular atualização de parâmetro (substituir por API real)
      setParametros(prev => prev.map(p => 
        p.id === editingParameter.id 
          ? { ...p, ...parameterData, updatedAt: new Date().toISOString() }
          : p
      ));
      setEditingParameter(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar parâmetro');
      throw error;
    }
  };

  const onDeleteParameter = async () => {
    if (!editingParameter) return;
    try {
      // Simular exclusão de parâmetro (substituir por API real)
      setParametros(prev => prev.filter(p => p.id !== editingParameter.id));
      setEditingParameter(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir parâmetro');
      throw error;
    }
  };

  const onToggleStatus = async (parametro: ParametroData) => {
    try {
      // Simular toggle do status (substituir por API real)
      setParametros(prev => prev.map(p => 
        p.id === parametro.id 
          ? { ...p, ativo: !p.ativo, updatedAt: new Date().toISOString() }
          : p
      ));
    } catch (error: any) {
      alert(error.message || 'Erro ao alterar status do parâmetro');
    }
  };

  // Filtros
  const parametrosFiltrados = parametros.filter(parametro => {
    const matchNome = parametro.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const matchEstacao = !filtroEstacao || parametro.stationName?.toLowerCase().includes(filtroEstacao.toLowerCase());
    return matchNome && matchEstacao;
  });

  // Computed values
  const editingParameterFormData = editingParameter ? {
    nome: editingParameter.nome,
    descricao: editingParameter.descricao,
    unidade: editingParameter.unidade,
    valor: editingParameter.valor,
    valorMin: editingParameter.valorMin,
    valorMax: editingParameter.valorMax,
    ativo: editingParameter.ativo,
    stationId: editingParameter.stationId,
  } : null;

  const totalParametros = parametros.length;
  const parametrosAtivos = parametros.filter(p => p.ativo).length;
  const parametrosInativos = parametros.filter(p => !p.ativo).length;

  return {
    // Estado dos dados
    user,
    parametros,
    loading,
    error,
    
    // Estado da UI
    showAddModal,
    editingParameter,
    filtroNome,
    filtroEstacao,
    
    // Handlers
    onOpenAddModal,
    onCloseAddModal,
    onAddParameter,
    onEditParameter,
    onCloseEditModal,
    onUpdateParameter,
    onDeleteParameter,
    onToggleStatus,
    loadParametros,
    setFiltroNome,
    setFiltroEstacao,
    
    // Computed values
    editingParameterFormData,
    parametrosFiltrados,
    totalParametros,
    parametrosAtivos,
    parametrosInativos,
  };
};