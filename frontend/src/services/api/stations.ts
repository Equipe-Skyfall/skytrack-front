import apiClient from './axios';

export interface StationDto {
  id: string;
  macAddress: string;
  name?: string;
  address?: string;
}

export async function getStations(page: number = 1, limit: number = 100, token?: string | null) {
  console.log('🏭 getStations called');
  
  // Override authorization header if token is provided
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  const response = await apiClient.get(`/api/stations?limit=${limit}&page=${page}`, config);
  return (response.data?.data || response.data || []) as StationDto[];
}

export async function getStation(id: string, token?: string | null) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  const response = await apiClient.get(`/api/stations/${id}`, config);
  return response.data as StationDto;
}

export async function createStation(payload: Record<string, unknown>, token?: string | null) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  const response = await apiClient.post('/api/stations', payload, config);
  return response.data as StationDto;
}

export async function updateStation(id: string, payload: Record<string, unknown>, token?: string | null) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  const response = await apiClient.put(`/api/stations/${id}`, payload, config);
  return response.data as StationDto;
}

export async function deleteStation(id: string, token?: string | null) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : {};
  
  await apiClient.delete(`/api/stations/${id}`, config);
}

export default { getStations, getStation, createStation, updateStation, deleteStation };
