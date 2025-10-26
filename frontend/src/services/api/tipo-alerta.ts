import apiClient from './axios';

export async function getTipoAlertas(token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.get('/api/tipo-alerta', config);
  if (res.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data;
  return res.data || [];
}

export async function getTipoAlerta(id: string, token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.get(`/api/tipo-alerta/${id}`, config);
  return res.data;
}

export async function createTipoAlerta(payload: Record<string, unknown>, token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.post('/api/tipo-alerta', payload, config);
  return res.data;
}

export async function updateTipoAlerta(id: string, payload: Record<string, unknown>, token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.put(`/api/tipo-alerta/${id}`, payload, config);
  return res.data;
}

export async function deleteTipoAlerta(id: string, token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.delete(`/api/tipo-alerta/${id}`, config);
  return res.data;
}

export default { getTipoAlertas, getTipoAlerta, createTipoAlerta, updateTipoAlerta, deleteTipoAlerta };