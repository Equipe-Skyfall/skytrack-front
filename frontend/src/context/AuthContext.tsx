
import { useAuthService } from '../hooks/auth/useAuthService';
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { updateUser as updateUserApi } from '../services/api/users';
import type { User as ApiUser, AuthContextType as ApiAuthContextType } from '../interfaces/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { AUTH_BASE } from '../services/api/config';

// Rotas públicas (acessíveis sem login)
const PUBLIC_ROUTES = ['/login', '/estacoes', '/dashboard', '/alertas', '/educacao'];
// Rotas exclusivas de admin
const ADMIN_ROUTES = ['/parametros', '/perfil'];

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
  } catch {
    return null;
  }
};

const AuthContext = createContext<ApiAuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authService = useAuthService();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);

        // Restaurar usuário e token do localStorage
        const storedUser = localStorage.getItem('skytrack_user');
        const storedToken = localStorage.getItem('skytrack_token');
        let currentUser = user;

        if (storedUser && !user) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            currentUser = userData;
          } catch (parseError) {
            console.error('Erro ao parsear dados do usuário:', parseError);
            localStorage.removeItem('skytrack_user');
          }
        }

        if (storedToken && !token) {
          setToken(storedToken);
        }

        // Não verifica autenticação em rotas públicas
        if (PUBLIC_ROUTES.includes(location.pathname)) {
          setIsCheckingAuth(false);
          return;
        }

        // Verifica permissões de admin
        if (currentUser) {
          if (ADMIN_ROUTES.includes(location.pathname) && currentUser.role !== 'ADMIN') {
            navigate('/login', { replace: true });
          }
          setIsCheckingAuth(false);
          return;
        }

        // Verificar com o servidor
        if (!storedToken) {
          throw new Error('Nenhum token encontrado');
        }

        const response = await fetch(`${AUTH_BASE}/auth/profile`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message || 'Falha ao verificar autenticação');
        }

  const newUser: ApiUser = {
          id: data.data.id,
          email: data.data.email,
          username: data.data.username,
          role: data.data.role,
        };

        setUser(newUser);
        localStorage.setItem('skytrack_user', JSON.stringify(newUser));
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('skytrack_user');
        localStorage.removeItem('skytrack_token');
        if (!PUBLIC_ROUTES.includes(location.pathname)) {
          navigate('/login', { replace: true });
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${AUTH_BASE}/auth/login`, {
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

  const newUser: ApiUser = {
        id: decodedToken.userId || '',
        email: decodedToken.email || email,
        username: decodedToken.username || email.split('@')[0],
        role: decodedToken.role || 'USER',
      };
      setUser(newUser);
      localStorage.setItem('skytrack_user', JSON.stringify(newUser));
      localStorage.setItem('skytrack_token', newToken);

      navigate('/dashboard', { replace: true });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Falha no login');
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${AUTH_BASE}/auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Falha no logout');
      }
    } catch {
      // Mesmo com erro, limpa o estado local
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('skytrack_user');
    localStorage.removeItem('skytrack_token');
    navigate('/login', { replace: true });
  };

  const updateUser = async (userData: Partial<ApiUser>) => {
    if (!user) {
      return Promise.reject(new Error('Usuário não autenticado'));
    }

    try {
  // Send update to API
  const updated = await updateUserApi(user.id, userData as Partial<ApiUser>);

      // Update local state and localStorage
      setUser(updated as ApiUser);
      try {
        localStorage.setItem('skytrack_user', JSON.stringify(updated));
      } catch (e) {
        console.warn('Falha ao salvar usuário no localStorage', e);
      }

      return Promise.resolve();
    } catch (err: any) {
      return Promise.reject(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return (
  <AuthContext.Provider value={{ ...authService, login, logout, updateUser }}>
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