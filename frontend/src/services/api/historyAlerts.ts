import { API_BASE } from './config';

async function request(path: string, opts: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  console.log('🔔 History Alerts API Request:', {
    method: opts.method || 'GET',
    url,
    body: opts.body ? JSON.parse(opts.body as string) : undefined,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('skytrack_token') : null;
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) } as Record<string, string>;
  if (token) headers.Authorization = `Bearer ${token}`;

  const credentials = (opts && (opts as RequestInit).credentials) || 'include';
  const res = await fetch(url, {
    headers,
    credentials,
    ...opts,
  });

  console.log('📡 History Alerts API Response:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('❌ History Alerts API Error:', text);
    try { const json = JSON.parse(text); throw new Error(json.message || text); } catch { throw new Error(text || res.statusText); }
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    console.log('✅ History Alerts API Success Data:', data);
    return data;
  }
  return null;
}

export type HistoryQuery = {
  level?: string;
  limit?: number;
  page?: number;
};

export async function getHistoryAlerts(query: HistoryQuery = {}) {
  console.log('🔔 getHistoryAlerts called', query);
  const params = new URLSearchParams();
  if (query.level) params.set('level', query.level);
  if (typeof query.limit !== 'undefined') params.set('limit', String(query.limit));
  if (typeof query.page !== 'undefined') params.set('page', String(query.page));

  const path = `/api/alerts${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await request(path);
  return res || { data: [], pagination: null };
}

export async function getHistoryAlert(id: string) {
  return await request(`/api/alerts/${id}`);
}

export default { getHistoryAlerts, getHistoryAlert };
