
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

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Ensure headers are properly merged without overriding content-type
  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };
  
  // Only add Content-Type if there's a body
  if (options.body) {
    defaultHeaders['Content-Type'] = 'application/json';
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: any = {};
    try {
      const text = await response.text();
      if (text) {
        errorData = JSON.parse(text);
      }
    } catch (e) {
      // Ignore JSON parse errors for error responses
    }
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  // Handle empty responses (like DELETE operations)
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    // If it's not JSON, return undefined for void operations
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    // Empty response body
    return undefined as T;
  }

  try {
    const data = JSON.parse(text);
    return data;
  } catch (e) {
    // If JSON parsing fails, return undefined for void operations
    return undefined as T;
  }
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

  return request<ParametersListResponse>(`/api/parameters?${params}`);
}

export async function getParameterById(id: string): Promise<ParameterDto> {
  return request<ParameterDto>(`/api/parameters/${id}`);
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

  return request<ParametersListResponse>(`/api/parameters/station/${stationId}?${params}`);
}

export async function createParameter(
  data: CreateParameterDto,
  token: string
): Promise<ParameterDto> {
  return request<ParameterDto>('/api/parameters', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function updateParameter(
  id: string,
  data: UpdateParameterDto,
  token: string
): Promise<ParameterDto> {
  return request<ParameterDto>(`/api/parameters/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteParameter(id: string, token: string): Promise<void> {
  return request<void>(`/api/parameters/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}