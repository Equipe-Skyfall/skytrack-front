// src/services/api/tipo-parametro.ts
import { API_BASE } from './config';

async function request(path: string, opts: RequestInit = {}, token?: string) {
  const url = `${API_BASE}${path}`;

  // Auto-fetch token from localStorage if not provided
  const finalToken = token || (typeof window !== 'undefined' ? localStorage.getItem('skytrack_token') : null);

  console.log('🔧 TipoParametro API Request:', {
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
    console.warn('⚠️ No token found for tipo-parametro request');
  }

  const credentials = opts.credentials || 'include';
  const res = await fetch(url, {
    headers,
    credentials,
    ...opts,
  });

  console.log('📡 TipoParametro API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ TipoParametro API Error:', text);
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
    console.log('✅ TipoParametro API Success Data:', data);
    return data;
  }
  return null;
}

export async function getTipoParametros(token?: string | null) {
  console.log('📝 getTipoParametros called');
  return (await request('/api/tipo-parametro', {}, token || undefined)) || [];
}

export async function getTipoParametro(id: string, token?: string | null) {
  return await request(`/api/tipo-parametro/${id}`, {}, token || undefined);
}

export async function createTipoParametro(payload: any, token?: string | null) {
  console.log('➕ createTipoParametro called with:', payload);
  return await request('/api/tipo-parametro', { method: 'POST', body: JSON.stringify(payload) }, token || undefined);
}

export async function updateTipoParametro(id: string, payload: any, token?: string | null) {
  return await request(`/api/tipo-parametro/${id}`, { method: 'PUT', body: JSON.stringify(payload) }, token || undefined);
}

export async function deleteTipoParametro(id: string, token?: string | null) {
  return await request(`/api/tipo-parametro/${id}`, { method: 'DELETE' }, token || undefined);
}

export default { getTipoParametros, getTipoParametro, createTipoParametro, updateTipoParametro, deleteTipoParametro };