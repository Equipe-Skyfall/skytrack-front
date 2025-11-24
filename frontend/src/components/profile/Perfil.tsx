import React, { useState, useEffect } from 'react';
import { User, Pencil, Settings } from 'lucide-react';
import EditUserModal from '../modals/EditUserModal';
import AddUserModal from '../modals/AddUserModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

type Usuario = {
  id: string;
  nome: string;
  email: string;
  username: string;
  role: string;
  status: 'Ativo' | 'Inativo';
  principal: boolean;
  createdAt?: string;
  updatedAt?: string;
};

interface ApiResponse {
  success: boolean;
  message: string;
  data: Usuario | Usuario[] | null;
  pagination?: {
    skip: number;
    take: number;
    total: number;
  };
}

const Perfil: React.FC = () => {
  const { user, token, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editUserInitialData, setEditUserInitialData] = useState<{ email: string; username: string }>({ email: '', username: '' });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  // Função para adicionar usuário
  const handleAddUser = async (data: { email: string; username: string; password: string; confirmPassword: string }) => {
    try {
      const response = await fetch('https://auth.skytrack.space/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
          role: 'ADMIN',
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao adicionar usuário');
      }
      setIsAddModalOpen(false);
      setSuccessMessage('Usuário criado com sucesso!');
      setTimeout(() => {
        setSuccessMessage(null);
        window.location.reload();
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao adicionar usuário');
    }
  };

  // Função para editar usuário (atual ou outro)
  const handleEditUser = async (data: { email: string; username: string; password: string }) => {
    try {
      if (!editUserId) throw new Error('Usuário para edição não selecionado');
      const response = await fetch(`https://auth.skytrack.space/users/${editUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          ...(data.password ? { password: data.password } : {}),
          role: 'ADMIN',
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao editar usuário');
      }
      setIsEditModalOpen(false);
      setEditUserId(null);
      setSuccessMessage('Usuário editado com sucesso!');
      setTimeout(() => {
        setSuccessMessage(null);
        window.location.reload();
      }, 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao editar usuário');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar perfil do usuário atual
        const profileResponse = await fetch('https://auth.skytrack.space/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok) {
          throw new Error(`Erro ao buscar perfil: ${profileResponse.status}`);
        }

        const profileData: ApiResponse = await profileResponse.json();

        if (!profileData.success || !profileData.data) {
          throw new Error(profileData.message || 'Erro ao carregar perfil');
        }

        // Buscar todos os usuários
        const usersResponse = await fetch('https://auth.skytrack.space/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!usersResponse.ok) {
          throw new Error(`Erro ao buscar usuários: ${usersResponse.status}`);
        }

        const usersData: ApiResponse = await usersResponse.json(); // Corrigido: usersResponse em vez de usersData

        if (!usersData.success || !usersData.data) {
          throw new Error(usersData.message || 'Erro ao carregar usuários');
        }

        // Processar dados
        const currentUser = profileData.data as Usuario;
        const allUsers = usersData.data as Usuario[];

        // Marcar o usuário atual como principal
        const processedUsers = allUsers.map(user => ({
          ...user,
          nome: user.username,
          status: 'Ativo' as const,
          principal: user.id === currentUser.id,
        }));

        setUsuarios(processedUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const usuarioPrincipal = usuarios.find((u) => u.principal);
  const outrosUsuarios = usuarios.filter((u) => !u.principal);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-white'}`}>
        <div className={`text-lg ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Carregando dados do perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-white'}`}>
        <div className="text-red-500 text-lg">Erro: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className={`ml-4 px-4 py-2 rounded transition-colors ${
            isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen w-full font-['Poppins'] p-4 sm:p-6 md:p-8 relative ${
      isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-white'
    }`}>
      {successMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-900/90 text-white px-6 py-2 rounded shadow-lg z-50 text-sm font-medium animate-fade-in">
          {successMessage}
        </div>
      )}
      <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>Perfil</h1>
      <span className={`text-sm sm:text-base mb-4 sm:mb-6 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>Gerencie todos os perfis do site</span>

      {/* Usuário principal */}
      {usuarioPrincipal && (
        <div className="flex flex-row items-stretch mb-6 sm:mb-8">
          <div className="w-1.5 rounded-lg bg-lime-500" />
          <div className={`flex-1 rounded-lg border p-4 sm:p-6 md:p-8 flex flex-col ml-2 relative ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-zinc-500'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center ${
                  isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-zinc-100 text-gray-400'
                }`}>
                  <User size={28} className="sm:w-10 sm:h-10" />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-1">
                  <span className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-100'}`}>{usuarioPrincipal.nome}</span>
                  <span className="px-3 sm:px-4 py-1 rounded-xl text-xs font-normal bg-lime-500 text-black min-w-[64px] text-center">
                    {usuarioPrincipal.status}
                  </span>
                </div>
              </div>
              <button
                className={`w-full sm:w-44 h-10 rounded-md border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' 
                    : 'bg-white border-black text-black hover:bg-gray-200'
                }`}
                onClick={() => {
                  setEditUserInitialData({
                    email: usuarioPrincipal.email,
                    username: usuarioPrincipal.nome,
                  });
                  setEditUserId(usuarioPrincipal.id);
                  setIsEditModalOpen(true);
                }}
                type="button"
              >
                <Pencil size={18} className="mr-1" /> Editar
              </button>
      {/* Modal de editar usuário (atual ou outro) */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditUserId(null); }}
        onSubmit={handleEditUser}
        onDelete={async () => {
          if (!editUserId) return;
          try {
            const response = await fetch(`https://auth.skytrack.space/users/${editUserId}`, {
              method: 'DELETE',
              headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              const err = await response.json();
              throw new Error(err.message || 'Erro ao deletar usuário');
            }
            setIsEditModalOpen(false);
            setEditUserId(null);
            setSuccessMessage('Usuário deletado com sucesso!');
            setTimeout(() => {
              setSuccessMessage(null);
              window.location.reload();
            }, 2000);
          } catch (err) {
            alert(err instanceof Error ? err.message : 'Erro ao deletar usuário');
          }
        }}
        initialData={editUserInitialData}
      />
            </div>
            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-16 mt-2 text-xs sm:text-sm ${
              isDarkMode ? 'text-gray-200' : 'text-zinc-100'
            }`}>
              <div className="flex-1 flex flex-col justify-start">
                <div className="leading-6 sm:leading-7">ID: {usuarioPrincipal.id}</div>
                <div className="leading-6 sm:leading-7">Nome: {usuarioPrincipal.nome}</div>
                <div className="leading-6 sm:leading-7">Email: {usuarioPrincipal.email}</div>
                <div className="leading-6 sm:leading-7">Role: {usuarioPrincipal.role}</div>
              </div>
              <div className="flex-1 flex flex-col justify-start">
                {usuarioPrincipal.createdAt && (
                  <div className="leading-6 sm:leading-7">Membro desde: {new Date(usuarioPrincipal.createdAt).toLocaleDateString()}</div>
                )}
                {usuarioPrincipal.updatedAt && (
                  <div className="leading-6 sm:leading-7">Última atualização: {new Date(usuarioPrincipal.updatedAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outros usuários */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <span className={`text-lg sm:text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Outros usuários</span>
          <button
            className={`flex items-center justify-center gap-2 w-full sm:w-48 h-11 rounded-lg text-sm font-normal px-4 py-2 transition ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
            onClick={() => setIsAddModalOpen(true)}
            type="button"
          >
            <span className="text-3xl">+</span> Adicionar Usuário
          </button>
      {/* Modal de adicionar usuário */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={({ email, username, password, confirmPassword }) => handleAddUser({ email, username, password, confirmPassword })}
      />
        </div>
        <div className="flex flex-col gap-4 sm:gap-6">
          {outrosUsuarios.length > 0 ? (
            outrosUsuarios.map((u: Usuario) => (
              <div key={u.id} className="flex flex-row items-stretch">
                <div className={`w-1.5 rounded-lg ${u.status === 'Ativo' ? 'bg-lime-500' : 'bg-zinc-400'}`} />
                <div className={`flex-1 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 ml-2 gap-3 sm:gap-4 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-zinc-500'
                }`}>
                  <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-zinc-100 text-gray-400'
                    }`}>
                      <User size={22} className="sm:w-7 sm:h-7" />
                    </div>
                    <span className={`text-sm sm:text-base font-bold flex-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{u.nome}</span>
                    <span className={`px-3 sm:px-4 py-1 rounded-xl text-xs font-normal min-w-[64px] text-center ${u.status === 'Ativo' ? 'bg-lime-500 text-black' : 'bg-neutral-300 text-black'}`}>
                      {u.status}
                    </span>
                  </div>
                  <button
                    className={`w-full sm:w-36 h-10 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                      isDarkMode 
                        ? 'bg-blue-600 border-purple-600 hover:bg-blue-700 text-white' 
                        : 'bg-slate-900 border-slate-900 hover:bg-slate-800 text-white'
                    }`}
                    onClick={() => {
                      setEditUserInitialData({
                        email: u.email,
                        username: u.nome,
                      });
                      setEditUserId(u.id);
                      setIsEditModalOpen(true);
                    }}
                    type="button"
                  >
                    <Settings size={18} className="mr-1" /> Configurar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Nenhum outro usuário encontrado
            </div>
          )}
        </div>
      </div>

      {/* Botão de logout */}
      <div className="absolute bottom-8 left-8">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-600 font-normal text-xs hover:underline"
        >
        </button>
      </div>
    </div>
  );
};

export default Perfil;