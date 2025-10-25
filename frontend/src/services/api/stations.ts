import { API_BASE } from './config';

export interface StationDto {
  id: string;
  macAddress: string;
  name?: string;
  address?: string;
}

async function request(path: string, opts: RequestInit = {}, token?: string) {
  const url = `${API_BASE}${path}`;

  // Auto-fetch token from localStorage if not provided
  const finalToken = token || (typeof window !== 'undefined' ? localStorage.getItem('skytrack_token') : null);

  console.log('🏭 Stations API Request:', {
    method: opts.method || 'GET',
    url,
    hasToken: !!finalToken,
    body: opts.body ? JSON.parse(opts.body as string) : undefined,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (finalToken) {
    headers['Authorization'] = `Bearer ${finalToken}`;
  } else {
    console.warn('⚠️ No token found for stations request');
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

export async function getStations(token?: string | null) {
  console.log('🏭 getStations called');
  const res = await request('/api/stations?limit=100&page=1', {}, token || undefined);
  return (res?.data || res || []) as StationDto[];
}

export async function getStation(id: string, token?: string | null) {
  return (await request(`/api/stations/${id}`, {}, token || undefined)) as StationDto;
}

export async function createStation(payload: Record<string, unknown>, token?: string | null) {
  return (await request('/api/stations', { method: 'POST', body: JSON.stringify(payload) }, token || undefined)) as StationDto;
}

export async function updateStation(id: string, payload: Record<string, unknown>, token?: string | null) {
  return (await request(`/api/stations/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token || undefined)) as StationDto;
}

export async function deleteStation(id: string, token?: string | null) {
  await request(`/api/stations/${id}`, { method: 'DELETE' }, token || undefined);
}

export default { getStations, getStation, createStation, updateStation, deleteStation };