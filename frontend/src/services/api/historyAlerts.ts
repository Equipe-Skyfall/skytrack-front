import apiClient from './axios';

export type HistoryQuery = {
  level?: string;
  limit?: number;
  page?: number;
};

export async function getHistoryAlerts(query: HistoryQuery = {}) {
  console.log('🔔 getHistoryAlerts called', query);
  const params: Record<string, string> = {};
  if (query.level) params.level = query.level;
  if (typeof query.limit !== 'undefined') params.limit = String(query.limit);
  if (typeof query.page !== 'undefined') params.page = String(query.page);
  // Sempre buscar apenas alertas inativos no histórico
  params.is_active = 'false';

  const res = await apiClient.get('/api/alerts', { params });
  console.log('✅ History Alerts API Success Data:', res.data);
  return res.data || { data: [], pagination: null };
}

export async function getHistoryAlert(id: string) {
  const res = await apiClient.get(`/api/alerts/${id}`);
  return res.data;
}

export default { getHistoryAlerts, getHistoryAlert };
