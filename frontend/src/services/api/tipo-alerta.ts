const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  
  console.log('🚨 TipoAlerta API Request:', {
    method: opts.method || 'GET',
    url,
    body: opts.body ? JSON.parse(opts.body as string) : undefined
  });
  
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  
  console.log('📡 TipoAlerta API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.error('❌ TipoAlerta API Error:', text);
    try { const json = JSON.parse(text); throw new Error(json.message || text); } catch { throw new Error(text || res.statusText); }
  }
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    console.log('✅ TipoAlerta API Success Data:', data);
    return data;
  }
  return null;
}

export async function getTipoAlertas() {
  console.log('🚨 getTipoAlertas called');
  return await request('/api/tipo-alerta') || [];
}

export async function getTipoAlerta(id: string) {
  return await request(`/api/tipo-alerta/${id}`);
}

export async function createTipoAlerta(payload: any) {
  return await request('/api/tipo-alerta', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateTipoAlerta(id: string, payload: any) {
  return await request(`/api/tipo-alerta/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteTipoAlerta(id: string) {
  return await request(`/api/tipo-alerta/${id}`, { method: 'DELETE' });
}

export default { getTipoAlertas, getTipoAlerta, createTipoAlerta, updateTipoAlerta, deleteTipoAlerta };