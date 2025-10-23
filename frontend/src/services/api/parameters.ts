
import apiClient from './axios';

export interface ParameterDto {
  id: string;
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId?: string;
}

export interface CreateParameterDto {
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId?: string;
}

export interface UpdateParameterDto {
  tipoAlertaId?: string;
}

export interface ParametersListResponse {
  data: ParameterDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getParameters(
  page = 1,
  limit = 10,
  name?: string
): Promise<ParametersListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (name) {
    params.append('name', name);
  }

  const response = await apiClient.get(`/api/parameters?${params}`);
  return response.data;
}

export async function getParameterById(id: string): Promise<ParameterDto> {
  const response = await apiClient.get(`/api/parameters/${id}`);
  return response.data;
}

export async function getParametersByStationId(
  stationId: string,
  page = 1,
  limit = 10,
  name?: string
): Promise<ParametersListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (name) {
    params.append('name', name);
  }

  const response = await apiClient.get(`/api/parameters/station/${stationId}?${params}`);
  return response.data;
}

export async function createParameter(
  data: CreateParameterDto,
  token: string
): Promise<ParameterDto> {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  const response = await apiClient.post('/api/parameters', data, config);
  return response.data;
}

export async function updateParameter(
  id: string,
  data: UpdateParameterDto,
  token: string
): Promise<ParameterDto> {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  const response = await apiClient.put(`/api/parameters/${id}`, data, config);
  return response.data;
}

export async function deleteParameter(id: string, token: string): Promise<void> {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  await apiClient.delete(`/api/parameters/${id}`, config);
}