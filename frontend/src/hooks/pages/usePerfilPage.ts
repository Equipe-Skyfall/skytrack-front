import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Tipo para dados de perfil
export interface PerfilData {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para dados do formulário de perfil
export interface PerfilFormData {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// Tipo para dados do formulário de senha
export interface SenhaFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const usePerfilPage = () => {
  const { user, updateUser } = useAuth();
  
  // Estado dos dados
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado da UI
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Carregamento inicial do perfil
  useEffect(() => {
    if (user) {
      setPerfil({
        id: user.id || '1',
        email: user.email,
        username: user.username,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  }, [user]);

  // Handlers da página
  const onStartEdit = () => {
    setIsEditing(true);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    // Restaurar dados originais
    if (user) {
      setPerfil({
        id: user.id || '1',
        email: user.email,
        username: user.username,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  };

  const onSaveProfile = async (formData: PerfilFormData) => {
    if (!perfil) return;
    
    setSavingProfile(true);
    setError(null);
    
    try {
      // Simular atualização do perfil (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedPerfil: PerfilData = {
        ...perfil,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      setPerfil(updatedPerfil);
      
      // Atualizar contexto de autenticação
      await updateUser({
        ...user!,
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar perfil');
      throw err;
    } finally {
      setSavingProfile(false);
    }
  };

  const onOpenChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const onCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const onChangePassword = async (passwordData: SenhaFormData) => {
    setChangingPassword(true);
    setError(null);
    
    try {
      // Simular mudança de senha (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação básica
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Senhas não coincidem');
      }
      
      if (passwordData.newPassword.length < 6) {
        throw new Error('Nova senha deve ter pelo menos 6 caracteres');
      }
      
      setShowChangePasswordModal(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar senha');
      throw err;
    } finally {
      setChangingPassword(false);
    }
  };

  const onUploadProfilePicture = async (file: File) => {
    if (!perfil) return;
    
    setLoading(true);
    try {
      // Simular upload de imagem (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Criar URL temporária para preview
      const imageUrl = URL.createObjectURL(file);
      
      const updatedPerfil: PerfilData = {
        ...perfil,
        profilePicture: imageUrl,
        updatedAt: new Date().toISOString(),
      };
      
      setPerfil(updatedPerfil);
      
      // Atualizar contexto de autenticação
      await updateUser({
        ...user!,
        profilePicture: imageUrl,
      });
      
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da imagem');
    } finally {
      setLoading(false);
    }
  };

  // Computed values
  const perfilFormData = perfil ? {
    email: perfil.email,
    username: perfil.username,
    firstName: perfil.firstName || '',
    lastName: perfil.lastName || '',
    phone: perfil.phone || '',
  } : null;

  const fullName = perfil && (perfil.firstName || perfil.lastName) 
    ? `${perfil.firstName || ''} ${perfil.lastName || ''}`.trim()
    : perfil?.username || '';

  const isAdmin = user?.role === 'ADMIN';

  return {
    // Estado dos dados
    user,
    perfil,
    loading,
    error,
    
    // Estado da UI
    isEditing,
    showChangePasswordModal,
    savingProfile,
    changingPassword,
    
    // Handlers
    onStartEdit,
    onCancelEdit,
    onSaveProfile,
    onOpenChangePasswordModal,
    onCloseChangePasswordModal,
    onChangePassword,
    onUploadProfilePicture,
    
    // Computed values
    perfilFormData,
    fullName,
    isAdmin,
  };
};