import apiClient from "./axios";

export interface ParameterDto {
  id: string;
  stationId: string;
  tipoParametroId: string;
  tipoAlertaId?: string;
  name?: string;
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

export async function getParameters(page = 1, limit = 10, name?: string, token?: string | null): Promise<ParametersListResponse> {
  const params: Record<string, any> = { page, limit };
  if (name) params.name = name;

  const config: any = { params };
  if (token) config.headers = { Authorization: `Bearer ${token}` };

  const res = await apiClient.get<ParametersListResponse>('/api/parameters', config);
  return res.data;
}

export async function getParameterById(id: string, token?: string | null): Promise<ParameterDto> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.get<ParameterDto>(`/api/parameters/${id}`, config);
  return res.data;
}

export async function getParametersByStationId(stationId: string, page = 1, limit = 10, name?: string, token?: string | null): Promise<ParametersListResponse> {
  const params: Record<string, any> = { page, limit };
  if (name) params.name = name;
  const config: any = { params };
  if (token) config.headers = { Authorization: `Bearer ${token}` };

  const res = await apiClient.get<ParametersListResponse>(`/api/parameters/station/${stationId}`, config);
  return res.data;
}

export async function createParameter(data: CreateParameterDto, token?: string | null): Promise<ParameterDto> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.post<ParameterDto>('/api/parameters', data, config);
  return res.data;
}

export async function updateParameter(id: string, data: UpdateParameterDto, token?: string | null): Promise<ParameterDto> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  const res = await apiClient.put<ParameterDto>(`/api/parameters/${id}`, data, config);
  return res.data;
}
export async function deleteParameter(id: string, token?: string | null): Promise<void> {
  const config: any = {};
  if (token) config.headers = { Authorization: `Bearer ${token}` };
  await apiClient.delete<void>(`/api/parameters/${id}`, config);
}