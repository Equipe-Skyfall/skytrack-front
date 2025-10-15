import type { 
  StationDto, 
  Station, 
  StationFormData, 
  StationsListResponse 
} from '../../interfaces/stations';

const STATIONS_API_URL = 'https://sky-track-backend.vercel.app/api/stations';

export async function getStations(page = 1, limit = 10): Promise<StationsListResponse> {
  const response = await fetch(`${STATIONS_API_URL}?limit=${limit}&page=${page}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error(`Erro ${response.status}: Falha ao carregar estações`);
  }
  
  return response.json();
}

export async function createStation(stationData: StationFormData): Promise<StationDto> {
  const response = await fetch(STATIONS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stationData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Erro ${response.status}: Falha ao criar estação`);
  }
  
  return response.json();
}

export async function updateStation(id: string, stationData: Partial<StationFormData>): Promise<StationDto> {
  const response = await fetch(`${STATIONS_API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(stationData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Erro ${response.status}: Falha ao atualizar estação`);
  }
  
  return response.json();
}

export async function deleteStation(id: string): Promise<void> {
  const response = await fetch(`${STATIONS_API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Erro ${response.status}: Falha ao excluir estação`);
  }
}

// Função para processar dados da estação com statusColor
export function processStationData(station: StationDto): Station {
  return {
    ...station,
    statusColor: station.status === 'ACTIVE' ? 'lime-500' : 'red-500'
  };
}