import { API_BASE } from './config';

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

async function request<T>(endpoint: string, options: RequestInit = {}, token?: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  // Auto-fetch token from localStorage if not provided
  const finalToken = token || (typeof window !== 'undefined' ? localStorage.getItem('skytrack_token') : null);

  console.log('🛠️ Parameters API Request:', { 
    method: options.method || 'GET', 
    url, 
    hasToken: !!finalToken 
  });

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (finalToken) {
    headers['Authorization'] = `Bearer ${finalToken}`;
  } else {
    console.warn('⚠️ No token provided for parameters request:', url);
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
    credentials: 'include',
  };

  const response = await fetch(url, config);
  console.log('📡 Parameters API Response:', {
    status: response.status,
    statusText: response.statusText,
    url,
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text);
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  const data = JSON.parse(text);
  console.log('✅ Parameters API Success Data:', data);
  return data;
}

export async function getParameters(page = 1, limit = 10, name?: string, token?: string | null): Promise<ParametersListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (name) {
    params.append('name', name);
  }

  return await request<ParametersListResponse>(`/api/parameters?${params}`, {}, token || undefined);
}

export async function getParameterById(id: string, token?: string | null): Promise<ParameterDto> {
  return await request<ParameterDto>(`/api/parameters/${id}`, {}, token || undefined);
}

export async function getParametersByStationId(stationId: string, page = 1, limit = 10, name?: string, token?: string | null): Promise<ParametersListResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (name) {
    params.append('name', name);
  }

  return await request<ParametersListResponse>(`/api/parameters/station/${stationId}?${params}`, {}, token || undefined);
}

export async function createParameter(data: CreateParameterDto, token?: string | null): Promise<ParameterDto> {
  return await request<ParameterDto>(
    '/api/parameters',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    token || undefined
  );
}

export async function updateParameter(id: string, data: UpdateParameterDto, token?: string | null): Promise<ParameterDto> {
  return await request<ParameterDto>(
    `/api/parameters/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    token || undefined
  );
}
export async function deleteParameter(id: string, token?: string | null): Promise<void> {
  return request<void>(`/api/parameters/${id}`, {
    method: 'DELETE',
  }, token || undefined);
}