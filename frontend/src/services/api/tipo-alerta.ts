// src/services/api/tipo-alerta.ts
import { API_BASE } from './config';

async function request(path: string, opts: RequestInit = {}, token?: string) {
  const url = `${API_BASE}${path}`;

  // Auto-fetch token from localStorage if not provided
  const finalToken = token || (typeof window !== 'undefined' ? localStorage.getItem('skytrack_token') : null);

  console.log('🚨 TipoAlerta API Request:', {
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
    console.warn('⚠️ No token found for tipo-alerta request');
  }

  const credentials = opts.credentials || 'include';
  const res = await fetch(url, {
    headers,
    credentials,
    ...opts,
  });

  console.log('📡 TipoAlerta API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ TipoAlerta API Error:', text);
    try {
      const json = JSON.parse(text);
      throw new Error(json.message || text);
    } catch (e) {
      if (e instanceof Error && e.message.includes('json')) {
        throw new Error(text || res.statusText);
      }
      throw e;
    }
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    console.log('✅ TipoAlerta API Success Data:', data);
    return data;
  }
  return null;
}

export async function getTipoAlertas(token?: string | null) {
  console.log('🚨 getTipoAlertas called');
  return (await request('/api/tipo-alerta', {}, token || undefined)) || [];
}

export async function getTipoAlerta(id: string, token?: string | null) {
  return await request(`/api/tipo-alerta/${id}`, {}, token || undefined);
}

export async function createTipoAlerta(payload: Record<string, unknown>, token?: string | null) {
  return await request('/api/tipo-alerta', { method: 'POST', body: JSON.stringify(payload) }, token || undefined);
}

export async function updateTipoAlerta(id: string, payload: Record<string, unknown>, token?: string | null) {
  return await request(`/api/tipo-alerta/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token || undefined);
}

export async function deleteTipoAlerta(id: string, token?: string | null) {
  return await request(`/api/tipo-alerta/${id}`, { method: 'DELETE' }, token || undefined);
}

export default { getTipoAlertas, getTipoAlerta, createTipoAlerta, updateTipoAlerta, deleteTipoAlerta };