import apiClient from './axios';
import type { StationDto } from '../../interfaces/stations';

export async function getStations(page?: number, limit?: number): Promise<StationDto[] | { data: StationDto[]; pagination: unknown }> {
  const params: Record<string, number> = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  
  // If no pagination params, default to limit 100
  if (!page && !limit) {
    params.limit = 100;
    params.page = 1;
  }
  
  const res = await apiClient.get('/api/stations', { params });
  
  // Check if response has pagination envelope
  if (res.data && typeof res.data === 'object' && 'data' in res.data && 'pagination' in res.data) {
    return res.data as { data: StationDto[]; pagination: unknown };
  }
  
  // Otherwise return just the data array
  if (res.data && typeof res.data === 'object' && 'data' in res.data) {
    return res.data.data as StationDto[];
  }
  
  return (res.data || []) as StationDto[];
}

export async function getStation(id: string): Promise<StationDto> {
  const res = await apiClient.get(`/api/stations/${id}`);
  return res.data;
}

export async function createStation(payload: Record<string, unknown>): Promise<StationDto> {
  console.log('🏗️ Creating station with payload:', payload);
  const res = await apiClient.post('/api/stations', payload);
  console.log('🏗️ Station created:', res.data);
  return res.data;
}

export async function updateStation(id: string, payload: Record<string, unknown>): Promise<StationDto> {
  const res = await apiClient.put(`/api/stations/${id}`, payload);
  return res.data;
}

export async function deleteStation(id: string): Promise<void> {
  await apiClient.delete(`/api/stations/${id}`);
}

export default { getStations, getStation, createStation, updateStation, deleteStation };