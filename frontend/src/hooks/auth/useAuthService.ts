import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, logoutUser, getUserProfile } from '../../services/api/auth';
import type { User } from '../../interfaces/auth';

export const useAuthService = () => {
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
            currentUser = userData;
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
        try {
          const userData = await getUserProfile();
          setUser(userData);
          localStorage.setItem('skytrack_user', JSON.stringify(userData));
        } catch (error) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('skytrack_user');
          localStorage.removeItem('skytrack_token');
          if (adminRoutes.includes(location.pathname)) {
            navigate('/login', { replace: true });
          }
        }
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
      const { user: newUser, token: newToken } = await loginUser(email, password);
      
      setUser(newUser);
      setToken(newToken);
      localStorage.setItem('skytrack_user', JSON.stringify(newUser));
      localStorage.setItem('skytrack_token', newToken);

      navigate('/dashboard', { replace: true });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Falha no login');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Mesmo com erro, limpa o estado local
      console.warn('Erro no logout:', error);
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('skytrack_user');
    localStorage.removeItem('skytrack_token');
    navigate('/login', { replace: true });
  };

  return {
    user,
    token,
    login,
    logout,
    isCheckingAuth,
  };
};