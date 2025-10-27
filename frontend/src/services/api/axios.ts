import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('skytrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
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
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('skytrack_token');
      localStorage.removeItem('skytrack_user');
      window.location.href = '/login';
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