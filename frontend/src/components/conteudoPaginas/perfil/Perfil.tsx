
import React, { useState, useEffect } from 'react';
import AddUserModal from '../../addUserModal/AddUserModal';
import EditUserModal from '../../editUserModal/EditUserModal';
import { User, Pencil, Settings } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

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
      const response = await fetch('https://authservice-brown.vercel.app/users', {
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
      const response = await fetch(`https://authservice-brown.vercel.app/users/${editUserId}`, {
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
        const profileResponse = await fetch('https://authservice-brown.vercel.app/auth/profile', {
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
        const usersResponse = await fetch('https://authservice-brown.vercel.app/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!usersResponse.ok) {
          throw new Error(`Erro ao buscar usuários: ${usersResponse.status}`);
        }

        const usersData: ApiResponse = await usersResponse.json();

        if (!usersData.success || !usersData.data) {
          throw new Error(usersData.message || 'Erro ao carregar usuários');
        }

        // Processar dados
        const currentUser = profileData.data as Usuario;
        const allUsers = usersData.data as Usuario[];

        // Marcar o usuário atual como principal
        const processedUsers = allUsers.map(user => ({
          ...user,
          nome: user.username, // Usar username como nome
          status: 'Ativo' as const, // Definir status padrão
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando dados do perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">Erro: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white font-['Poppins'] p-8 relative">
      {successMessage && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-900/90 text-white px-6 py-2 rounded shadow-lg z-50 text-sm font-medium animate-fade-in">
          {successMessage}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-1 text-black">Perfil</h1>
      <span className="text-base text-black mb-6">Gerencie todos os perfis do site</span>

      {/* Usuário principal */}
      {usuarioPrincipal && (
        <div className="flex flex-row items-stretch mb-8">
          <div className="w-1.5 rounded-lg bg-lime-500" />
          <div className="flex-1 bg-slate-900 rounded-lg border border-zinc-500 p-8 flex flex-col ml-2 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-lg bg-zinc-100 flex items-center justify-center text-gray-400">
                  <User size={40} />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-zinc-100">{usuarioPrincipal.nome}</span>
                </div>
                <div className="flex-1 flex justify-end">
                  <span className="px-4 py-1 rounded-xl text-xs font-normal bg-lime-500 text-black align-middle min-w-[64px] text-center">
                    {usuarioPrincipal.status}
                  </span>
                </div>
              </div>
              <button
                className="w-44 h-10 bg-white rounded-md border border-black text-black text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
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
        initialData={editUserInitialData}
      />
            </div>
            <div className="flex flex-row gap-16 mt-2 text-zinc-100 text-sm">
              <div className="w-72 h-24 flex flex-col justify-start">
                <div className="leading-7">ID: {usuarioPrincipal.id}</div>
                <div className="leading-7">Nome: {usuarioPrincipal.nome}</div>
                <div className="leading-7">Email: {usuarioPrincipal.email}</div>
                <div className="leading-7">Role: {usuarioPrincipal.role}</div>
              </div>
              <div className="w-72 h-24 flex flex-col justify-start">
                {usuarioPrincipal.createdAt && (
                  <div className="leading-7">Membro desde: {new Date(usuarioPrincipal.createdAt).toLocaleDateString()}</div>
                )}
                {usuarioPrincipal.updatedAt && (
                  <div className="leading-7">Última atualização: {new Date(usuarioPrincipal.updatedAt).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outros usuários */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-black">Outros usuários</span>
          <button
            className="flex items-center gap-2 w-48 h-11 bg-slate-900 rounded-lg text-white text-sm font-normal px-4 py-2 hover:bg-blue-900 transition"
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
        <div className="flex flex-col gap-6">
          {outrosUsuarios.length > 0 ? (
            outrosUsuarios.map((u: Usuario) => (
              <div key={u.id} className="flex flex-row items-stretch">
                <div className={`w-1.5 rounded-lg ${u.status === 'Ativo' ? 'bg-lime-500' : 'bg-zinc-400'}`} />
                <div className="flex-1 bg-white rounded-lg border border-zinc-500 flex items-center justify-between px-8 py-5 ml-2">
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 w-full">
                    <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-gray-400">
                      <User size={28} />
                    </div>
                    <span className="text-base font-bold text-black">{u.nome}</span>
                    <span className={`px-4 py-1 rounded-xl text-xs font-normal min-w-[64px] text-center ${u.status === 'Ativo' ? 'bg-lime-500 text-black' : 'bg-neutral-300 text-black'}`}>
                      {u.status}
                    </span>
                  </div>
                  <button
                    className="w-36 h-10 bg-slate-900 rounded-lg border border-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors ml-6 shadow-sm"
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
            <div className="text-center text-gray-500 py-8">
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
