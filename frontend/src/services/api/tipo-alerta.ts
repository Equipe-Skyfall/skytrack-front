import apiClient from './axios';

export async function getTipoAlertas() {
  console.log('� getTipoAlertas called');
  const response = await apiClient.get('/api/tipo-alerta');
  return response.data || [];
}

export async function getTipoAlerta(id: string) {
  const response = await apiClient.get(`/api/tipo-alerta/${id}`);
  return response.data;
}

export async function createTipoAlerta(payload: any) {
  const response = await apiClient.post('/api/tipo-alerta', payload);
  return response.data;
}

export async function updateTipoAlerta(id: string, payload: any) {
  const response = await apiClient.put(`/api/tipo-alerta/${id}`, payload);
  return response.data;
}

export async function deleteTipoAlerta(id: string) {
  const response = await apiClient.delete(`/api/tipo-alerta/${id}`);
  return response.data;
}

export default { getTipoAlertas, getTipoAlerta, createTipoAlerta, updateTipoAlerta, deleteTipoAlerta };