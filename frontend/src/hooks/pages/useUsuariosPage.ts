import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Tipo para dados de usuário
export interface UsuarioData {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para dados do formulário de usuário
export interface UsuarioFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}

export const useUsuariosPage = () => {
  const { user } = useAuth();
  
  // Estado dos dados
  const [usuarios, setUsuarios] = useState<UsuarioData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado da UI
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioData | null>(null);

  // Simulação de carregamento de usuários (substituir por API real)
  const loadUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados
      const mockUsuarios: UsuarioData[] = [
        {
          id: '1',
          email: 'admin@skytrack.com',
          username: 'admin',
          role: 'ADMIN',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          email: 'user@skytrack.com',
          username: 'user',
          role: 'USER',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];
      
      setUsuarios(mockUsuarios);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadUsuarios();
    }
  }, [user]);

  // Handlers da página
  const onOpenAddModal = () => {
    setShowAddModal(true);
  };

  const onCloseAddModal = () => {
    setShowAddModal(false);
  };

  const onAddUser = async (userData: UsuarioFormData) => {
    try {
      // Simular criação de usuário (substituir por API real)
      const newUser: UsuarioData = {
        id: Date.now().toString(),
        email: userData.email,
        username: userData.username,
        role: 'USER',
        createdAt: new Date().toISOString(),
      };
      
      setUsuarios(prev => [newUser, ...prev]);
      setShowAddModal(false);
    } catch (error: any) {
      alert(error.message || 'Erro ao criar usuário');
      throw error;
    }
  };

  const onEditUser = (usuario: UsuarioData) => {
    setEditingUser(usuario);
  };

  const onCloseEditModal = () => {
    setEditingUser(null);
  };

  const onUpdateUser = async (userData: Omit<UsuarioFormData, 'confirmPassword'>) => {
    if (!editingUser) return;
    try {
      // Simular atualização de usuário (substituir por API real)
      setUsuarios(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, email: userData.email, username: userData.username }
          : u
      ));
      setEditingUser(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar usuário');
      throw error;
    }
  };

  const onDeleteUser = async () => {
    if (!editingUser) return;
    try {
      // Simular exclusão de usuário (substituir por API real)
      setUsuarios(prev => prev.filter(u => u.id !== editingUser.id));
      setEditingUser(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir usuário');
      throw error;
    }
  };

  // Computed values
  const isAdmin = user?.role === 'ADMIN';
  const editingUserFormData = editingUser ? {
    email: editingUser.email,
    username: editingUser.username,
  } : null;

  return {
    // Estado dos dados
    user,
    usuarios,
    loading,
    error,
    
    // Estado da UI
    showAddModal,
    editingUser,
    
    // Handlers
    onOpenAddModal,
    onCloseAddModal,
    onAddUser,
    onEditUser,
    onCloseEditModal,
    onUpdateUser,
    onDeleteUser,
    loadUsuarios,
    
    // Computed values
    isAdmin,
    editingUserFormData,
  };
};