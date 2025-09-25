import React, { useState, useEffect } from "react";
import ModalCadastroEstacao from "../../modalCadastroEstacao/cadastroEstacaoModal";
import ModalEdicaoEstacao from "../../modalEdicaoEstacao/modalEdicaoEstacao";
import ModalExcluirEstacao from "../../modalExcluirEstacao/modalExcluirEstacao";
import { useAuth } from "../../../context/AuthContext";
import Pagination from "../../pagination/pagination";

const API_URL = 'https://sky-track-backend.vercel.app/api/stations';

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
interface StationsListResponse {
  data: StationDto[];
  pagination: PaginationData;
}
interface StationDto {
  id: string;
  name: string;
  macAddress: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}
interface Station extends StationDto {
  statusColor: string;
}
interface StationFormData {
  name: string;
  address: string;
  macAddress: string;
  latitude: string;
  longitude: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

interface EstacaoCardProps {
  station: Station;
  onConfigurarClick: () => void;
  onVerHistoricoClick: () => void;
  onDeleteClick: () => void;
  isUserLoggedIn: boolean;
}

const EstacaoCard: React.FC<EstacaoCardProps> = ({
  station,
  onConfigurarClick,
  onVerHistoricoClick,
  onDeleteClick,
  isUserLoggedIn,
}) => {
  const displayStatus = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
  };
  return (
    <div className="bg-white rounded-xl shadow border p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#aaa" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="#aaa" strokeWidth="2" />
              </svg>
            </span>
            <span className="font-semibold text-lg">{station.name}</span>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full text-white font-semibold ${station.statusColor}`}
          >
            {displayStatus[station.status] || station.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke="#aaa"
                strokeWidth="2"
              />
            </svg>
          </span>
          <span>{station.address}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm">
          <span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 00-4-4H3m18 0h-2a4 4 0 00-4 4v2m-4-11v2a4 4 0 004 4h2M3 7h2a4 4 0 004-4V3" />
            </svg>
          </span>
          <span>
            MAC: <span className="font-mono">{station.macAddress}</span>
          </span>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Coords:{" "}
          <span className="font-mono">
            {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}
          </span>
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Descrição: {station.description}
        </div>
        <div className="text-sm text-gray-700 mb-1">
          Criado em: {new Date(station.createdAt).toLocaleDateString("pt-BR")}
        </div>
        <div className="text-sm text-gray-700 mb-4">
          Atualizado em: {new Date(station.updatedAt).toLocaleDateString("pt-BR")}
        </div>
      </div>

      <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-gray-200">
        {isUserLoggedIn && (
          <>
            <button
              onClick={onDeleteClick}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded"
            >
              Excluir
            </button>
            <button
              onClick={onConfigurarClick}
              className="bg-slate-800 hover:bg-slate-600 text-white text-xs font-bold py-1 px-3 rounded"
            >
              Configurar
            </button>
          </>
        )}
        <button
          onClick={onVerHistoricoClick}
          className="bg-slate-800 hover:bg-slate-600 text-white text-xs font-bold py-1 px-3 rounded"
        >
          Ver Histórico
        </button>
      </div>
    </div>
  );
};

function getStatusColor(status: "ACTIVE" | "INACTIVE"): string {
  if (status === "ACTIVE") return "bg-lime-400";
  return "bg-red-500";
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

  useEffect(() => {
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
      const fetchPage = currentPage;
      setCurrentPage(0);
      setCurrentPage(fetchPage);
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
      const updatedStation: StationDto = await response.json();
      setListaDeEstacoes(prevList =>
        prevList.map(station =>
          station.id === updatedStation.id
            ? { ...updatedStation, statusColor: getStatusColor(updatedStation.status) }
            : station
        )
      );
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando estações...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:px-4">

      <div className="flex justify-between items-center mb-1">
        <h1 className="text-3xl font-bold">Estações Pluviométricas</h1>
        {token && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
          >
            Cadastrar Estação
          </button>
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Gerencie e monitore todas as estações de medição
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listaDeEstacoes.map((station) => (
          <EstacaoCard
            key={station.id}
            station={station}
            onConfigurarClick={() => setEditingStation(station)}
            onVerHistoricoClick={() => alert(`Abrir histórico da ${station.name}`)}
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
    </div>
  );
};

export default Estacao;