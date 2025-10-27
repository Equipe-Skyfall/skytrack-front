import apiClient from './axios';

export async function getAlerts(is_active?: boolean) {
  console.log('🔔 getAlerts called', { is_active });
  const params: Record<string, string> = {};
  if (is_active !== undefined) {
    params.is_active = String(is_active);
  }
  const response = await apiClient.get('/api/alerts', { params });
  // NestJS returns { data: RegisteredAlertDto[], pagination: { ... } }
  if (response.data && typeof response.data === 'object' && 'data' in response.data) {
    return response.data.data;
  }
  return response.data || [];
}

export async function getAlert(id: string) {
  const response = await apiClient.get(`/api/alerts/${id}`);
  return response.data;
}

export async function createAlert(payload: Record<string, unknown>) {
  const body = sanitizeAlertPayload(payload);
  const response = await apiClient.post('/api/alerts', body);
  return response.data;
}

export async function updateAlert(id: string, payload: Record<string, unknown>) {
  const body = sanitizeAlertPayload(payload);
  const response = await apiClient.put(`/api/alerts/${id}`, body);
  return response.data;
}

function sanitizeAlertPayload(payload: Record<string, unknown>) {
  // Allowed by backend CreateAlertDto: data, stationId, parameterId, tipoAlertaId, medidasId, is_active
  const out: Record<string, unknown> = {};
  if (payload == null) return out;
  const data = payload.data as unknown;
  if (data) {
    // accept Date or ISO string
    if (data instanceof Date) out.data = data.toISOString();
    else if (typeof data === 'string') out.data = data;
  }
  if (typeof payload.stationId !== 'undefined') out.stationId = payload.stationId;
  if (typeof payload.parameterId !== 'undefined') out.parameterId = payload.parameterId;
  if (typeof payload.tipoAlertaId !== 'undefined') out.tipoAlertaId = payload.tipoAlertaId;
  if (typeof payload.medidasId !== 'undefined') out.medidasId = payload.medidasId;
  if (typeof payload.is_active !== 'undefined') out.is_active = payload.is_active;
  return out;
}

export async function resolveAlert(id: string) {
  // O backend atual faz toggle do campo active, então basta chamar PUT sem body
  const response = await apiClient.put(`/api/alerts/${id}`);
  return response.data;
}

export async function activateAlert(id: string) {
  // O backend faz toggle, então se está inativo, ficará ativo
  const response = await apiClient.put(`/api/alerts/${id}`);
  return response.data;
}

export async function deleteAlert(id: string) {
  const response = await apiClient.delete(`/api/alerts/${id}`);
  return response.data;
}

export default { getAlerts, getAlert, createAlert, updateAlert, resolveAlert, activateAlert, deleteAlert };