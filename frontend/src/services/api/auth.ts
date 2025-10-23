import type { User } from '../../interfaces/auth';
import authClient from './auth-client';

// Função para decodificar JWT
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    const response = await authClient.post('/auth/login', { email, password });
    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Falha no login');
    }

    const newToken = data.data?.token;
    if (!newToken) {
      throw new Error('Token não retornado pelo servidor');
    }

    const decodedToken = decodeJWT(newToken);
    if (!decodedToken) {
      throw new Error('Falha ao decodificar o token');
    }

    const user: User = {
      id: decodedToken.userId || '',
      email: decodedToken.email || email,
      username: decodedToken.username || email.split('@')[0],
      role: decodedToken.role || 'USER',
    };

    return { user, token: newToken };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await authClient.post('/auth/logout');
}

export async function getUserProfile(): Promise<User> {
  try {
    const response = await authClient.get('/auth/profile');
    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Falha ao verificar autenticação');
    }

    return {
      id: data.data.id,
      email: data.data.email,
      username: data.data.username,
      role: data.data.role,
    };
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}