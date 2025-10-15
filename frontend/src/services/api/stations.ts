import { API_BASE } from './config';

export interface StationDto {
  id: string;
  macAddress: string;
  name?: string;
  address?: string;
}

async function request(path: string, opts: RequestInit = {}, token?: string) {
  const url = `${API_BASE}${path}`;

  console.log('🏭 Stations API Request:', {
    method: opts.method || 'GET',
    url,
    body: opts.body ? JSON.parse(opts.body as string) : undefined,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const credentials = opts.credentials || 'include';
  const res = await fetch(url, {
    headers,
    credentials,
    ...opts,
  });

  console.log('📡 Stations API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ Stations API Error:', text);
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || text);
    } catch {
      throw new Error(text || res.statusText);
    }
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    console.log('✅ Stations API Success Data:', data);
    return data;
  }
  return null;
}

export async function getStations(token?: string) {
  console.log('🏭 getStations called');
  const res = await request('/api/stations?limit=100&page=1', {}, token);
  return (res?.data || res || []) as StationDto[];
}

export async function getStation(id: string, token?: string) {
  return (await request(`/api/stations/${id}`, {}, token)) as StationDto;
}

export async function createStation(payload: Record<string, unknown>, token: string) {
  return (await request('/api/stations', { method: 'POST', body: JSON.stringify(payload) }, token)) as StationDto;
}

export async function updateStation(id: string, payload: Record<string, unknown>, token: string) {
  return (await request(`/api/stations/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token)) as StationDto;
}

export async function deleteStation(id: string, token: string) {
  await request(`/api/stations/${id}`, { method: 'DELETE' }, token);
}

export default { getStations, getStation, createStation, updateStation, deleteStation };