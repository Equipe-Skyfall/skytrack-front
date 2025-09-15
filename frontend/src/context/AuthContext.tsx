import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface User {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carrega user e token do localStorage ao carregar o app
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('https://authservice-brown.vercel.app/auth/login', {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || `Login failed with status ${response.status}`);
      }

      // Decodifica o token para obter userId, username e role
      const decodedToken = decodeJWT(data.data.token);
      if (!decodedToken) {
        throw new Error('Failed to decode JWT');
      }

      const newUser: User = {
        id: decodedToken.userId,
        email: decodedToken.email,
        username: decodedToken.username,
        role: decodedToken.role,
      };
      setUser(newUser);
      setToken(data.data.token);

      // Salva no localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', data.data.token);

      navigate('/dashboard');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};