import apiClient from './axios';

export interface StationDto {
  id: string;
  macAddress: string;
  name?: string;
  address?: string;
}

export async function getStations(token?: string | null): Promise<StationDto[]> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };

  const res = await apiClient.get('/api/stations?limit=100&page=1', config);
  if (res.data && typeof res.data === 'object' && 'data' in res.data) {
    return res.data.data as StationDto[];
  }
  return (res.data || []) as StationDto[];
}

export async function getStation(id: string, token?: string | null): Promise<StationDto> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.get(`/api/stations/${id}`, config);
  return res.data;
}

export async function createStation(payload: Record<string, unknown>, token?: string | null): Promise<StationDto> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.post('/api/stations', payload, config);
  return res.data;
}

export async function updateStation(id: string, payload: Record<string, unknown>, token?: string | null): Promise<StationDto> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.put(`/api/stations/${id}`, payload, config);
  return res.data;
}

export async function deleteStation(id: string, token?: string | null): Promise<void> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  await apiClient.delete(`/api/stations/${id}`, config);
}

export default { getStations, getStation, createStation, updateStation, deleteStation };