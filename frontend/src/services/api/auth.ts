import type { User } from '../../interfaces/auth';

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
  const response = await fetch('https://authservice-brown.vercel.app/auth/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  let data;
  try {
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    } else {
      throw new Error(`Erro ${response.status}: Resposta vazia do servidor`);
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Erro')) {
      throw e;
    }
    throw new Error(`Erro ${response.status}: Falha ao processar resposta`);
  }

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Erro ${response.status}: Falha no login`);
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
}

export async function logoutUser(): Promise<void> {
  const response = await fetch('https://authservice-brown.vercel.app/auth/logout', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Falha no logout');
  }
}

export async function getUserProfile(): Promise<User> {
  const response = await fetch('https://authservice-brown.vercel.app/auth/profile', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}`);
  }

  let data;
  try {
    const text = await response.text();
    if (text) {
      data = JSON.parse(text);
    } else {
      throw new Error('Resposta vazia do servidor');
    }
  } catch (e) {
    throw new Error('Erro ao processar resposta do servidor');
  }

  if (!data.success) {
    throw new Error(data.message || 'Falha ao verificar autenticação');
  }

  return {
    id: data.data.id,
    email: data.data.email,
    username: data.data.username,
    role: data.data.role,
  };
}