const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  
  console.log('🔔 Alerts API Request:', {
    method: opts.method || 'GET',
    url,
    body: opts.body ? JSON.parse(opts.body as string) : undefined
  });
  
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
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

export async function getAlerts() {
  console.log('🔔 getAlerts called');
  const res = await request('/api/alerts');
  // NestJS returns { data: RegisteredAlertDto[], pagination: { ... } }
  if (res && typeof res === 'object' && 'data' in res) return res.data;
  return res || [];
}

export async function getAlert(id: string) {
  return await request(`/api/alerts/${id}`);
}

export async function createAlert(payload: any) {
  const body = sanitizeAlertPayload(payload);
  return await request('/api/alerts', { method: 'POST', body: JSON.stringify(body) });
}

export async function updateAlert(id: string, payload: any) {
  const body = sanitizeAlertPayload(payload);
  return await request(`/api/alerts/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

function sanitizeAlertPayload(payload: any) {
  // Allowed by backend CreateAlertDto: data, stationId, parameterId, tipoAlertaId, medidasId
  const out: any = {};
  if (payload == null) return out;
  if (payload.data) {
    // accept Date or ISO string
    out.data = payload.data instanceof Date ? payload.data.toISOString() : payload.data;
  }
  if (payload.stationId) out.stationId = payload.stationId;
  if (payload.parameterId) out.parameterId = payload.parameterId;
  if (payload.tipoAlertaId) out.tipoAlertaId = payload.tipoAlertaId;
  if (payload.medidasId) out.medidasId = payload.medidasId;
  return out;
}

export async function deleteAlert(id: string) {
  return await request(`/api/alerts/${id}`, { method: 'DELETE' });
}

export default { getAlerts, getAlert, createAlert, updateAlert, deleteAlert };