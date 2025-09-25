import React, { useState, useEffect } from "react";
import ModalCadastroEstacao from "../../modalCadastroEstacao/cadastroEstacaoModal";
<<<<<<< HEAD
import { useAuth } from "../../../context/AuthContext"; 

const API_URL = 'https://sky-track-backend.vercel.app/api/stations';

=======
import ModalEdicaoEstacao from "../../modalEdicaoEstacao/modalEdicaoEstacao";
import ModalExcluirEstacao from "../../modalExcluirEstacao/modalExcluirEstacao";
import { useAuth } from "../../../context/AuthContext";
import Pagination from "../../pagination/pagination";
import { MapPin, Wifi, Activity, Plus, Settings, Trash2 } from 'lucide-react';

const API_URL = 'https://sky-track-backend.vercel.app/api/stations';

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
interface StationsListResponse {
  data: StationDto[];
  pagination: { /* ... */ };
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
<<<<<<< HEAD
}

const EstacaoCard: React.FC<EstacaoCardProps> = ({ station }) => {
=======
  onConfigurarClick: () => void;
  onDeleteClick: () => void;
  isUserLoggedIn: boolean;
}

const EstacaoCard: React.FC<EstacaoCardProps> = ({
  station,
  onConfigurarClick,
  onDeleteClick,
  isUserLoggedIn,
}) => {
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
  const displayStatus = {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
  };
  return (
    <div className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-zinc-100 rounded-lg p-2">
            <MapPin className="h-5 w-5 text-zinc-700" />
          </div>
          <h3 className="text-lg font-bold text-zinc-800">{station.name}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          station.status === 'ACTIVE' ? 'bg-lime-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {displayStatus[station.status] || station.status}
        </div>
      </div>
      <div className="bg-zinc-100 rounded-lg p-3">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <MapPin className="h-4 w-4" />
          <span>{station.address || 'Endereço não informado'}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <Wifi className="h-4 w-4" />
        <span className="font-mono">MAC: {station.macAddress || 'Não configurado'}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <Activity className="h-4 w-4" />
        <span className="font-mono">Coords: {station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}</span>
      </div>
      <p className="text-sm text-zinc-600">
        <strong>Descrição:</strong> {station.description || 'Sem descrição'}
      </p>
      <div className="text-xs text-zinc-500">
        Criado: {new Date(station.createdAt).toLocaleDateString("pt-BR")} | 
        Atualizado: {new Date(station.updatedAt).toLocaleDateString("pt-BR")}
      </div>
      {isUserLoggedIn && (
        <div className="flex justify-center gap-4 pt-4 border-t border-zinc-200">
          <button
            onClick={onConfigurarClick}
            className="bg-white border border-zinc-400 rounded-lg py-2 px-10 flex items-center justify-center gap-2 text-base font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors duration-300 shadow-sm cursor-pointer"
          >
            <Settings className="h-5 w-5" />
            Configurar
          </button>
          <button
            onClick={onDeleteClick}
            className="bg-red-500 text-white rounded-lg py-2 px-10 flex items-center justify-center gap-2 text-base font-semibold hover:bg-red-600 transition-colors duration-300 shadow-sm cursor-pointer"
          >
            <Trash2 className="h-5 w-5" />
            Excluir
          </button>
        </div>
<<<<<<< HEAD
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
=======
      )}
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
    </div>
  );
};


function getStatusColor(status: "ACTIVE" | "INACTIVE"): string {
<<<<<<< HEAD
  if (status === "ACTIVE") return "bg-lime-400";
  return "bg-red-500"; 
=======
  if (status === "ACTIVE") return "bg-lime-500 text-white";
  return "bg-red-500 text-white";
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
}

const Estacao: React.FC = () => {
  const { token } = useAuth();
  
  const [listaDeEstacoes, setListaDeEstacoes] = useState<Station[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

=======
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [deletingStation, setDeletingStation] = useState<Station | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState<PaginationData | null>(null);

  const STATIONS_PER_PAGE = 6;
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)

  useEffect(() => {

    const fetchStations = async () => {
      try {
        setLoading(true);
        setError(null);
<<<<<<< HEAD

        const response = await fetch(`${API_URL}?limit=10&page=1`, {
=======
        const response = await fetch(`${API_URL}?limit=${STATIONS_PER_PAGE}&page=${page}`, {
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
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
<<<<<<< HEAD
=======
        setPaginationData(responseData.pagination);
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD

    fetchStations();
  }, []); 
=======
    fetchStations(currentPage);
  }, [currentPage]);
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)

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
<<<<<<< HEAD
      
      const newStationFromApi: StationDto = await response.json();

      const displayStation: Station = {
        ...newStationFromApi,
        statusColor: getStatusColor(newStationFromApi.status),
      };

      setListaDeEstacoes((listaAnterior) => [...listaAnterior, displayStation]);
      setIsModalOpen(false);

=======
      setIsModalOpen(false);
      const fetchPage = currentPage;
      setCurrentPage(0);
      setCurrentPage(fetchPage);
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
    } catch (error: any) {
      console.error("Erro ao criar estação:", error);
      alert(`Erro ao salvar estação: ${error.message}`);
    }
  };

<<<<<<< HEAD
=======
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

>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
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
<<<<<<< HEAD
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
          <EstacaoCard key={station.id} station={station} />
        ))}
      </div>
      
      
      <ModalCadastroEstacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStation}
      />
=======
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
>>>>>>> 6967402 (REFACTOR: Melhoria na estilização da página Estação)
    </div>
  );
};

export default Estacao;