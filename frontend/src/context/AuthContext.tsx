import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Função para decodificar JWT (usada como fallback)
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

interface User {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Verifica a autenticação via cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('https://authservice-brown.vercel.app/auth/profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Falha ao verificar autenticação');
        }

        const newUser: User = {
          id: data.data.id,
          email: data.data.email,
          username: data.data.username,
          role: data.data.role,
        };
        setUser(newUser);
      } catch (error) {
        setUser(null); // Usuário não autenticado
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('https://authservice-brown.vercel.app/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Falha no login');
      }

      // Fallback: usa o token do JSON se o cookie não estiver disponível
      const decodedToken = decodeJWT(data.data.token);
      if (!decodedToken) {
        throw new Error('Falha ao decodificar o token');
      }

      const newUser: User = {
        id: decodedToken.userId,
        email: decodedToken.email,
        username: decodedToken.username,
        role: decodedToken.role,
      };
      setUser(newUser);

      navigate('/dashboard');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Falha no login');
    }
  };

  const logout = async () => {
    try {
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
    } catch (error) {
      // Mesmo com erro (ex.: 404), limpa o estado local
    }

    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};