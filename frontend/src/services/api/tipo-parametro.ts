import apiClient from './axios';

export async function getTipoParametros() {
  console.log('� getTipoParametros called');
  const response = await apiClient.get('/api/tipo-parametro');
  return response.data || [];
}

export async function getTipoParametro(id: string) {
  const response = await apiClient.get(`/api/tipo-parametro/${id}`);
  return response.data;
}

export async function createTipoParametro(payload: any) {
  console.log('➕ createTipoParametro called with:', payload);
  const response = await apiClient.post('/api/tipo-parametro', payload);
  return response.data;
}

export async function updateTipoParametro(id: string, payload: any) {
  const response = await apiClient.put(`/api/tipo-parametro/${id}`, payload);
  return response.data;
}

export async function deleteTipoParametro(id: string) {
  const response = await apiClient.delete(`/api/tipo-parametro/${id}`);
  return response.data;
}

export default { getTipoParametros, getTipoParametro, createTipoParametro, updateTipoParametro, deleteTipoParametro };