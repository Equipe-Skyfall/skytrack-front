import apiClient from './axios';

export async function getTipoParametros(token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.get('/api/tipo-parametro', config);
  if (res.data && typeof res.data === 'object' && 'data' in res.data) return res.data.data;
  return res.data || [];
}

export async function getTipoParametro(id: string, token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.get(`/api/tipo-parametro/${id}`, config);
  return res.data;
}

export async function createTipoParametro(payload: any, token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.post('/api/tipo-parametro', payload, config);
  return res.data;
}

export async function updateTipoParametro(id: string, payload: any, token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.put(`/api/tipo-parametro/${id}`, payload, config);
  return res.data;
}

export async function deleteTipoParametro(id: string, token?: string | null) {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.delete(`/api/tipo-parametro/${id}`, config);
  return res.data;
}

export default { getTipoParametros, getTipoParametro, createTipoParametro, updateTipoParametro, deleteTipoParametro };