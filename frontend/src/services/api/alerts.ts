import apiClient from './axios';

export async function getAlerts() {
  console.log('🔔 getAlerts called');
  const response = await apiClient.get('/api/alerts');
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

export async function createAlert(payload: any) {
  const body = sanitizeAlertPayload(payload);
  const response = await apiClient.post('/api/alerts', body);
  return response.data;
}

export async function updateAlert(id: string, payload: any) {
  const body = sanitizeAlertPayload(payload);
  const response = await apiClient.put(`/api/alerts/${id}`, body);
  return response.data;
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
  const response = await apiClient.delete(`/api/alerts/${id}`);
  return response.data;
}

export default { getAlerts, getAlert, createAlert, updateAlert, deleteAlert };