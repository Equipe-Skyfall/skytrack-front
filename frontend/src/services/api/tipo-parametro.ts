const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  
  console.log('🔧 TipoParametro API Request:', {
    method: opts.method || 'GET',
    url,
    body: opts.body ? JSON.parse(opts.body as string) : undefined
  });
  
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  
  console.log('📡 TipoParametro API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error('❌ TipoParametro API Error:', text);
    try { const json = JSON.parse(text); throw new Error(json.message || text); } catch { throw new Error(text || res.statusText); }
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    console.log('✅ TipoParametro API Success Data:', data);
    return data;
  }
  return null;
}

export async function getTipoParametros() {
  console.log('📝 getTipoParametros called');
  return await request('/api/tipo-parametro') || [];
}

export async function getTipoParametro(id: string) {
  return await request(`/api/tipo-parametro/${id}`);
}

export async function createTipoParametro(payload: any) {
  console.log('➕ createTipoParametro called with:', payload);
  return await request('/api/tipo-parametro', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateTipoParametro(id: string, payload: any) {
  return await request(`/api/tipo-parametro/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteTipoParametro(id: string) {
  return await request(`/api/tipo-parametro/${id}`, { method: 'DELETE' });
}

export default { getTipoParametros, getTipoParametro, createTipoParametro, updateTipoParametro, deleteTipoParametro };