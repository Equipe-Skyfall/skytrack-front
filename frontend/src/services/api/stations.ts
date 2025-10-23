import apiClient from './axios';
import type { 
  StationDto, 
  Station, 
  StationFormData, 
  StationsListResponse 
} from '../../interfaces/stations';

export async function getStations(page: number = 1, limit: number = 100, token?: string | null) {
  console.log('🏭 getStations called');
  
  // Override authorization header if token is provided
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  const response = await apiClient.get(`/api/stations?limit=${limit}&page=${page}`, config);
  return response.data as StationsListResponse;
}

export async function getStation(id: string, token?: string | null) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  const response = await apiClient.get(`/api/stations/${id}`, config);
  return response.data as StationDto;
}

export async function createStation(payload: StationFormData, token?: string | null) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  // Convert form data to proper types
  const createDto = {
    name: payload.name,
    address: payload.address || null,
    macAddress: payload.macAddress || null,
    latitude: parseFloat(payload.latitude) || 0,
    longitude: parseFloat(payload.longitude) || 0,
    description: payload.description || null,
    status: payload.status,
  };
  
  const response = await apiClient.post('/api/stations', createDto, config);
  return response.data as StationDto;
}

export async function updateStation(id: string, payload: Partial<StationFormData>, token?: string | null) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  // Convert partial form data to proper types
  const updateDto: any = {};
  if (payload.name !== undefined) updateDto.name = payload.name;
  if (payload.address !== undefined) updateDto.address = payload.address || null;
  if (payload.macAddress !== undefined) updateDto.macAddress = payload.macAddress || null;
  if (payload.latitude !== undefined) updateDto.latitude = parseFloat(payload.latitude) || 0;
  if (payload.longitude !== undefined) updateDto.longitude = parseFloat(payload.longitude) || 0;
  if (payload.description !== undefined) updateDto.description = payload.description || null;
  if (payload.status !== undefined) updateDto.status = payload.status;
  
  const response = await apiClient.put(`/api/stations/${id}`, updateDto, config);
  return response.data as StationDto;
}

export async function deleteStation(id: string, token?: string | null) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  await apiClient.delete(`/api/stations/${id}`, config);
}

// Helper function to add UI-specific properties to station data
export function processStationData(station: StationDto): Station {
  return {
    ...station,
    statusColor: station.status === 'ACTIVE' ? 'bg-lime-500 text-white' : 'bg-red-500 text-white'
  };
}

export default { getStations, getStation, createStation, updateStation, deleteStation, processStationData };
