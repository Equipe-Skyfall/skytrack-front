// estacaoCard.tsx
import React, { useState, useEffect } from "react";
import { MapPin, Wifi, Activity, Plus, Settings, Trash2, History } from 'lucide-react';
import ModalCadastroEstacao from "../modals/cadastroEstacaoModal";
import ModalEdicaoEstacao from "../modals/modalEdicaoEstacao";
import ModalExcluirEstacao from "../modals/modalExcluirEstacao";
import ModalHistoricoEstacao from "../modals/ModalHistoricoEstacao";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../pagination/pagination";
import type {
  PaginationData,
  StationsListResponse,
  Station,
  StationFormData,
  EstacaoCardProps
} from '../../interfaces/stations';
import { API_BASE } from "../../services/api/config";

const API_URL = API_BASE+"/api/stations"
const EstacaoCard: React.FC<EstacaoCardProps> = ({
  station,
  onConfigurarClick,
  onDeleteClick,
  isUserLoggedIn,
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const displayStatus = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-100 rounded-lg p-2">
              <MapPin className="h-5 w-5 text-zinc-700" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800 font-poppins">{station.name}</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold font-poppins ${station.status === 'ACTIVE' ? 'bg-lime-500 text-white' : 'bg-red-500 text-white'
            }`}>
            {displayStatus[station.status] || station.status}
          </div>
        </div>
        <div className="bg-zinc-100 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-zinc-600 font-poppins">
            <MapPin className="h-4 w-4" />
            <span>{station.address || 'Endereço não informado'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 font-poppins">
          <Wifi className="h-4 w-4" />
          <span className="font-mono">MAC: {station.macAddress || 'Não configurado'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-600 font-poppins">
          <Activity className="h-4 w-4" />
          <span className="font-mono">Coords: {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}</span>
        </div>
        <p className="text-sm text-zinc-600 font-poppins">
          <strong>Descrição:</strong> {station.description || 'Sem descrição'}
        </p>
        <div className="text-xs text-zinc-500 font-poppins">
          Criado: {new Date(station.createdAt).toLocaleDateString("pt-BR")} |
          Atualizado: {new Date(station.updatedAt).toLocaleDateString("pt-BR")}
        </div>
        {isUserLoggedIn && (
          <div className="flex justify-center gap-4 pt-4 border-t border-zinc-200">
            {/* Botão de Histórico - NOVO */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-slate-900 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 text-base font-semibold font-poppins hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <History className="h-5 w-5" />
              Histórico
            </button>

            <button
              onClick={onConfigurarClick}
              className="bg-white border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 text-base font-semibold text-zinc-800 hover:bg-gray-50 transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <Settings className="h-5 w-5" />
              Configurar
            </button>
            <button
              onClick={onDeleteClick}
              className="bg-red-600 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 text-base font-semibold hover:bg-red-700 transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <Trash2 className="h-5 w-5" />
              Excluir
            </button>
          </div>
        )}
      </div>

     
      <ModalHistoricoEstacao
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        stationId={station.id}
        stationName={station.name}
        stationMac={station.macAddress || undefined} 
      />
    </>
  );
};

function getStatusColor(status: "ACTIVE" | "INACTIVE"): string {
  if (status === "ACTIVE") return "bg-lime-500 text-white";
  return "bg-red-500 text-white";
}

const Estacao: React.FC = () => {
  const { token } = useAuth();

  const [listaDeEstacoes, setListaDeEstacoes] = useState<Station[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [deletingStation, setDeletingStation] = useState<Station | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);

  const STATIONS_PER_PAGE = 6;

  const fetchStations = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}?limit=${STATIONS_PER_PAGE}&page=${page}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Erro ao buscar estações: ${response.status}`);
      }
      const responseData: StationsListResponse = await response.json();
      if (!responseData.data) {
        throw new Error('Formato de resposta inesperado da API');
      }
      const stationsFromApi = responseData.data;
      const displayStations: Station[] = stationsFromApi.map((station) => ({
        ...station,
        statusColor: getStatusColor(station.status),
      }));
      setListaDeEstacoes(displayStations);
      setPaginationData(responseData.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations(currentPage);
  }, [currentPage]);

  const handleAddStation = async (data: StationFormData) => {
    if (!token) {
      alert("Sessão expirada. Faça login para cadastrar estações.");
      return;
    }
    try {
      const createDto = {
        ...data,
        latitude: parseFloat(data.latitude || '0'),
        longitude: parseFloat(data.longitude || '0'),
      };
      const response = await fetch(API_URL, {
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
        throw new Error(errorData.message || `Erro ao salvar: ${response.status}`);
      }
      setIsModalOpen(false);
      await fetchStations(currentPage);
    } catch (error: any) {
      console.error("Erro ao criar estação:", error);
      alert(`Erro ao salvar estação: ${error.message}`);
    }
  };

  const handleEditStationSubmit = async (data: StationFormData) => {
    if (!editingStation) return;
    if (!token) {
      alert("Sessão expirada. Faça login para editar estações.");
      return;
    }
    try {
      const changedData: any = {};
      if (data.name !== editingStation.name) {
        changedData.name = data.name;
      }
      if (data.address !== (editingStation.address || '')) {
        changedData.address = data.address;
      }
      if (data.description !== (editingStation.description || '')) {
        changedData.description = data.description;
      }
      if (data.status !== editingStation.status) {
        changedData.status = data.status;
      }
      const formLat = parseFloat(data.latitude || '0');
      const formLng = parseFloat(data.longitude || '0');
      if (formLat !== editingStation.latitude) {
        changedData.latitude = formLat;
      }
      if (formLng !== editingStation.longitude) {
        changedData.longitude = formLng;
      }
      if (data.macAddress !== (editingStation.macAddress || '')) {
        changedData.macAddress = data.macAddress;
      }
      if (Object.keys(changedData).length === 0) {
        alert("Nenhuma alteração foi feita.");
        setEditingStation(null);
        return;
      }
      const response = await fetch(`${API_URL}/${editingStation.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(changedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao editar: ${response.status}`);
      }
      setEditingStation(null);
      await fetchStations(currentPage);
    } catch (error: any) {
      console.error("Erro ao editar estação:", error);
      alert(`Erro ao salvar alteração: ${error.message}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStation) return;
    if (!token) {
      alert("Sessão expirada. Faça login para excluir estações.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${deletingStation.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao excluir a estação');
      }

      setListaDeEstacoes(prevList =>
        prevList.filter(station => station.id !== deletingStation.id)
      );

      setDeletingStation(null);

    } catch (error: any) {
      console.error("Erro ao excluir estação:", error);
      alert(`Erro ao excluir estação: ${error.message}`);
      setDeletingStation(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <div className="text-lg text-zinc-600">Carregando estações...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-white">
        <div className="text-red-500 text-lg">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-poppins">
      <main className="p-4 md:p-6 lg:p-8 space-y-8 max-w-full mx-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-800 tracking-tight">Estações Pluviométricas</h1>
            <p className="text-base md:text-lg text-zinc-600">Gerencie e monitore todas as estações de medição</p>
          </div>
          {token && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 text-white rounded-lg py-2.5 px-6 flex items-center gap-2 text-sm font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <Plus className="h-5 w-5" />
              Cadastrar Estação
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listaDeEstacoes.map((station) => (
            <EstacaoCard
              key={station.id}
              station={station}
              onConfigurarClick={() => setEditingStation(station)}
              onDeleteClick={() => setDeletingStation(station)}
              isUserLoggedIn={!!token}
            />
          ))}
        </div>

        {paginationData && (
          <Pagination
            currentPage={paginationData.page}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <ModalCadastroEstacao
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddStation}
        />

        {editingStation && (
          <ModalEdicaoEstacao
            isOpen={!!editingStation}
            onClose={() => setEditingStation(null)}
            onSubmit={handleEditStationSubmit}
            stationToEdit={editingStation}
          />
        )}

        {deletingStation && (
          <ModalExcluirEstacao
            isOpen={!!deletingStation}
            onClose={() => setDeletingStation(null)}
            onConfirm={handleDeleteConfirm}
            title="Confirmar Exclusão"
            message={`Tem certeza que deseja excluir a estação "${deletingStation.name}"? Esta ação não pode ser desfeita.`}
          />
        )}
      </main>
    </div>
  );
};

export { EstacaoCard };
export default Estacao;
