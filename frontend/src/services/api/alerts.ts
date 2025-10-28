import apiClient from './axios';

export interface AlertsQueryParams {
  page?: number;
  limit?: number;
  level?: string;
  search?: string;
  is_active?: boolean;
}

export async function getAlerts(params?: AlertsQueryParams) {
  console.log('🔔 getAlerts called', params);

  // Build query parameters object
  const queryParams: Record<string, any> = {
    is_active: true, // Default to true to show only active alerts
  };

  if (params?.page !== undefined) queryParams.page = params.page;
  if (params?.limit !== undefined) queryParams.limit = params.limit;
  if (params?.level !== undefined) queryParams.level = params.level;
  if (params?.search !== undefined) queryParams.search = params.search;
  // Override default if explicitly provided
  if (typeof params?.is_active === 'boolean') queryParams.is_active = params.is_active;

  const response = await apiClient.get('/api/alerts', { params: queryParams });

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
  // Allowed by backend CreateAlertDto: data, stationId, parameterId, tipoAlertaId, medidasId
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
  return out;
}

export async function deleteAlert(id: string) {
  const response = await apiClient.delete(`/api/alerts/${id}`);
  return response.data;
}

export default { getAlerts, getAlert, createAlert, updateAlert, deleteAlert };