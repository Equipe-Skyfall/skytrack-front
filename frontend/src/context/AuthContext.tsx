import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Rotas públicas (acessíveis sem login)
  const publicRoutes = ['/login', '/estacoes', '/dashboard', '/alertas', '/educacao'];
  // Rotas exclusivas de admin
  const adminRoutes = ['/parametros', '/perfil'];

  // Verifica a autenticação
  useEffect(() => {
    const checkAuth = async () => {
      // Não verifica autenticação em rotas públicas
      if (publicRoutes.includes(location.pathname)) {
        setIsCheckingAuth(false);
        return;
      }

      // Se há usuário, pula verificação
      if (user) {
        // Verifica se é admin nas rotas de admin
        if (adminRoutes.includes(location.pathname) && user.role !== 'ADMIN') {
          navigate('/login', { replace: true });
        }
        setIsCheckingAuth(false);
        return;
      }

      try {
        setIsCheckingAuth(true);
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

        const data = await response.json();
        if (!data.success) {
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
        setUser(null);
        setToken(null);
        if (adminRoutes.includes(location.pathname)) {
          navigate('/login', { replace: true });
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname, user]);

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
        throw new Error(data.message || `Erro ${response.status}: Falha no login`);
      }

      const newToken = data.data?.token;
      if (!newToken) {
        throw new Error('Token não retornado pelo servidor');
      }

      setToken(newToken);

      const decodedToken = decodeJWT(newToken);
      if (!decodedToken) {
        throw new Error('Falha ao decodificar o token');
      }

      const newUser: User = {
        id: decodedToken.userId || '',
        email: decodedToken.email || email,
        username: decodedToken.username || email.split('@')[0],
        role: decodedToken.role || 'USER',
      };
      setUser(newUser);

      navigate('/dashboard', { replace: true });
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
      // Mesmo com erro, limpa o estado local
    }

    setUser(null);
    setToken(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {isCheckingAuth ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-zinc-600">Carregando...</div>
        </div>
      ) : (
        children
      )}
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