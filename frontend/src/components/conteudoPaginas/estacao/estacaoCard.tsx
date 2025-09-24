import React, { useState, useEffect } from "react";
import ModalCadastroEstacao from "../../modalCadastroEstacao/cadastroEstacaoModal";
// Importe o modal de edição que criamos
import ModalEdicaoEstacao from "../../modalEdicaoEstacao/modalEdicaoEstacao";
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
}


const EstacaoCard: React.FC<EstacaoCardProps> = ({
  station,
  onConfigurarClick,
  onVerHistoricoClick
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

      <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onConfigurarClick}
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          Configurar
        </button>
        <button
          onClick={onVerHistoricoClick}
          className="text-sm font-medium text-slate-700 hover:text-slate-900"
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
          headers: {
            'Content-Type': 'application/json',
          },
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
      // 1. Crie um DTO de "diferenças" (o que mudou)
      const changedData: any = {};

      // 2. Compara cada campo do formulário com a estação original
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

      // Converte os dados do formulário (string) para número antes de comparar
      const formLat = parseFloat(data.latitude || '0');
      const formLng = parseFloat(data.longitude || '0');

      if (formLat !== editingStation.latitude) {
        changedData.latitude = formLat;
      }
      if (formLng !== editingStation.longitude) {
        changedData.longitude = formLng;
      }

      // A VERIFICAÇÃO MAIS IMPORTANTE:
      // Só adiciona 'macAddress' se ele realmente mudou
      if (data.macAddress !== (editingStation.macAddress || '')) {
        changedData.macAddress = data.macAddress;
      }

      // 3. Verifique se algo realmente mudou
      if (Object.keys(changedData).length === 0) {
        alert("Nenhuma alteração foi feita.");
        setEditingStation(null); // Fechar o modal
        return;
      }

      // Se algo mudou (e o macAddress não), o objeto 'changedData'
      // será enviado SEM o campo 'macAddress', evitando o bug de validação!

      const response = await fetch(`${API_URL}/${editingStation.id}`, {
        method: 'PUT', // Ainda usando PUT, como você pediu
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(changedData), // 4. Envia APENAS os dados alterados
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao editar: ${response.status}`);
      }

      setEditingStation(null); // Fecha o modal

      // Atualiza a lista na tela
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
    </div>
  );
};

export default Estacao;