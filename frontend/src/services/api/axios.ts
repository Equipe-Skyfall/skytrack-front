import axios from 'axios';
import type { AxiosResponse } from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  // withCredentials removido - não é necessário para api.skytrack.space
  // pois a autenticação é feita via Authorization header, não cookies
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    // Adiciona token do localStorage se disponível
    const token = localStorage.getItem('skytrack_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Remove empty query parameters to avoid validation errors
    if (config.params) {
      const cleanParams: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(config.params)) {
        // Only include non-empty values
        if (value !== '' && value !== null && value !== undefined) {
          cleanParams[key] = value;
        }
      }
      config.params = cleanParams;
      console.log('🧹 Cleaned params:', config.params);
    }
    
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
      hasToken: !!token,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    
    return response;
  },
  (error) => {
    // Throttle repetitive error logs per URL to avoid console spam
    try {
      const url = error.config?.url || 'unknown';
      const now = Date.now();
      const last = (apiClient as any).__lastErrorLogMap || new Map<string, number>();
      const lastTs = last.get(url) || 0;
      const THROTTLE_MS = 5000; // 5s
      if (now - lastTs > THROTTLE_MS) {
        // Use warn for 5xx errors to reduce severity
        const logFn = error.response?.status === 401 ? console.error : console.warn;
        logFn('❌ API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });
        last.set(url, now);
        (apiClient as any).__lastErrorLogMap = last;
      }
    } catch (e) {
      // ignore logging failures
    }
    
    // Lista de rotas que DEVEM ser públicas (não causam redirecionamento em 401)
    const publicApiRoutes = [
      '/api/stations',
      '/api/alerts',
      '/api/sensor-readings',
    ];
    
    // Verifica se a rota atual é pública
    const isPublicRoute = publicApiRoutes.some(route => 
      error.config?.url?.includes(route)
    );
    
    // Handle 401 errors
    if (error.response?.status === 401) {
      // Se não é uma rota pública da API, limpa token e redireciona
      if (!isPublicRoute) {
        localStorage.removeItem('skytrack_token');
        localStorage.removeItem('skytrack_user');
        // Redireciona para login apenas se não estiver em uma rota pública do site
        const publicPageRoutes = ['/login', '/estacoes', '/dashboard', '/alertas', '/educacao'];
        if (!publicPageRoutes.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      } else {
        // Para rotas públicas da API, retorna dados vazios ao invés de erro
        console.warn('⚠️ Rota pública retornou 401 - Backend precisa marcar como @Public():', error.config?.url);
        // Retorna uma resposta vazia no formato esperado pelo backend NestJS
        return Promise.resolve({
          data: { 
            data: [], 
            success: true, // Mudado para true para não causar erros
            message: 'No data available (public access without auth)' 
          },
          status: 200,
          statusText: 'OK (fallback)',
          headers: {},
          config: error.config,
        } as AxiosResponse);
      }
    }
    
    // Extract error message from response
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message || 
                   'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);

export { apiClient, API_BASE };
export default apiClient;