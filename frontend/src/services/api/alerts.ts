import { API_BASE } from './config';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  
  console.log('🔔 Alerts API Request:', {
    method: opts.method || 'GET',
    url,
    body: opts.body ? JSON.parse(opts.body as string) : undefined
  });
  
  // attach token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('skytrack_token') : null;
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) } as Record<string, string>;
  if (token) headers.Authorization = `Bearer ${token}`;

  const credentials = (opts && (opts as RequestInit).credentials) || 'include';
  const res = await fetch(url, {
    headers,
    // default to include credentials for cookie-based auth; allow override via opts
    credentials,
    ...opts,
  });
  
  console.log('📡 Alerts API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error('❌ Alerts API Error:', text);
    try { const json = JSON.parse(text); throw new Error(json.message || text); } catch { throw new Error(text || res.statusText); }
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    console.log('✅ Alerts API Success Data:', data);
    return data;
  }
  return null;
}
import apiClient from './axios';

export async function getAlerts() {
  console.log('🔔 getAlerts called');
  const response = await apiClient.get('/api/alerts');
  // NestJS returns { data: RegisteredAlertDto[], pagination: { ... } }
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data;
  }
  return response.data || [];
}

export async function getAlert(id: string) {
  const response = await apiClient.get(`/api/alerts/${id}`);
  return response.data;
}

export async function createAlert(payload: Record<string, unknown>) {
  const body = sanitizeAlertPayload(payload);
  const response = await apiClient.post('/api/alerts', body);
  return response.data;
}

export async function updateAlert(id: string, payload: Record<string, unknown>) {
  const body = sanitizeAlertPayload(payload);
  const response = await apiClient.put(`/api/alerts/${id}`, body);
  return response.data;
}

function sanitizeAlertPayload(payload: Record<string, unknown>) {
  // Allowed by backend CreateAlertDto: data, stationId, parameterId, tipoAlertaId, medidasId
  const out: Record<string, unknown> = {};
  if (payload == null) return out;
  const data = payload.data as unknown;
  if (data) {
    // accept Date or ISO string
    if (data instanceof Date) out.data = data.toISOString();
    else if (typeof data === 'string') out.data = data;
  }
  if (typeof payload.stationId !== 'undefined') out.stationId = payload.stationId;
  if (typeof payload.parameterId !== 'undefined') out.parameterId = payload.parameterId;
  if (typeof payload.tipoAlertaId !== 'undefined') out.tipoAlertaId = payload.tipoAlertaId;
  if (typeof payload.medidasId !== 'undefined') out.medidasId = payload.medidasId;
  return out;
}

export async function deleteAlert(id: string) {
  const response = await apiClient.delete(`/api/alerts/${id}`);
  return response.data;
}

export default { getAlerts, getAlert, createAlert, updateAlert, deleteAlert };