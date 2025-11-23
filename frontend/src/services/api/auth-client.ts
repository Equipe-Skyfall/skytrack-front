import axios from 'axios';
import { AUTH_BASE } from './config';

// Create axios instance specifically for auth service
const authClient = axios.create({
  baseURL: AUTH_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for logging and auth
authClient.interceptors.request.use(
  (config) => {
    // Add auth token if available for profile requests
    const token = localStorage.getItem('skytrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('🔐 Auth Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data ? { ...config.data, password: '[HIDDEN]' } : undefined,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Auth Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
authClient.interceptors.response.use(
  (response) => {
    console.log('✅ Auth Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data ? { ...response.data, token: response.data.token ? '[TOKEN_RECEIVED]' : undefined } : undefined,
    });
    
    return response;
  },
  (error) => {
    console.error('❌ Auth Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    
    // Handle auth-specific errors
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
                   'Authentication error occurred';
    
    return Promise.reject(new Error(message));
  }
);

export { authClient, AUTH_BASE };
export default authClient;