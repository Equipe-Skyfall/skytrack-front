import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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
      try {
        setIsCheckingAuth(true);

        // First, restore user and token from localStorage if available
        const storedUser = localStorage.getItem('skytrack_user');
        const storedToken = localStorage.getItem('skytrack_token');
        let currentUser = user;
        
        if (storedUser && !user) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            currentUser = userData; // Update local reference
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            localStorage.removeItem('skytrack_user');
          }
        }

        if (storedToken && !token) {
          setToken(storedToken);
        }

        // Não verifica autenticação em rotas públicas
        if (publicRoutes.includes(location.pathname)) {
          setIsCheckingAuth(false);
          return;
        }

        // Se há usuário, verifica permissões de admin e pula verificação do servidor
        if (currentUser) {
          if (adminRoutes.includes(location.pathname) && currentUser.role !== 'ADMIN') {
            navigate('/login', { replace: true });
          }
          setIsCheckingAuth(false);
          return;
        }

        // Then verify with the server
        const response = await fetch('https://authservice-brown.vercel.app/auth/profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          // Only clear user data on explicit auth failure (401/403)
          if (response.status === 401 || response.status === 403) {
            throw new Error(`Erro ${response.status}`);
          }
          // For other errors (network, server), keep stored user data
          return;
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

        const newUser: User = {
          id: data.data.id,
          email: data.data.email,
          username: data.data.username,
          role: data.data.role,
        };

        setUser(newUser);
        // Store updated user data in localStorage
        localStorage.setItem('skytrack_user', JSON.stringify(newUser));
      } catch (error) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('skytrack_user');
        localStorage.removeItem('skytrack_token');
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
      // Store user data and token in localStorage
      localStorage.setItem('skytrack_user', JSON.stringify(newUser));
      localStorage.setItem('skytrack_token', newToken);

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
    // Clear localStorage on logout
    localStorage.removeItem('skytrack_user');
    localStorage.removeItem('skytrack_token');
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