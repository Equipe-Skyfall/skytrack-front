import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; username: string; password: string }) => void;
  onDelete: () => void;
  initialData: { email: string; username: string };
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSubmit, onDelete, initialData }) => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState(initialData.email);
  const [username, setUsername] = useState(initialData.username);
  const [password, setPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

    // Sync state with initialData when it changes (e.g., for different users)
  useEffect(() => {
    setEmail(initialData.email);
    setUsername(initialData.username);
    setPassword('');  // Reset password to empty on new user (optional, since it's optional)
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, username, password });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30 transition-opacity duration-300 p-4 overflow-y-auto"
      onClick={onClose}
      style={{ touchAction: 'none' }}
    >
      <div
        className={`rounded-xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl p-4 sm:p-6 md:p-8 relative transform transition-all duration-300 ease-out scale-100 opacity-100 max-h-[90vh] overflow-y-auto ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <button className={`absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-zinc-800 hover:text-black'}`} onClick={onClose}>&times;</button>
        <h2 className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Editar Usuário</h2>
        <div className={`text-lg sm:text-xl font-semibold mb-3 sm:mb-4 font-poppins ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>{initialData.username}</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
          <div>
            <label className={`block text-sm font-medium font-poppins mb-1 ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>Nome de Usuário</label>
            <input 
              type="text" 
              className={`w-full border rounded px-3 py-2 font-poppins ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-zinc-300 text-zinc-800'
              }`}
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>
          <div>
            <label className={`block text-sm font-medium font-poppins mb-1 ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>E-mail</label>
            <input 
              type="email" 
              className={`w-full border rounded px-3 py-2 font-poppins ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-zinc-300 text-zinc-800'
              }`}
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className={`block text-sm font-medium font-poppins mb-1 ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>Nova senha (opcional)</label>
            <input 
              type="password" 
              className={`w-full border rounded px-3 py-2 font-poppins ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-zinc-300 text-zinc-800'
              }`}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          {/* Campo Tipo removido, sempre ADMIN */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 mt-3 sm:mt-4">
          <button 
            type="button" 
            className={`px-4 sm:px-6 py-2 rounded border transition-colors text-sm sm:text-base w-full sm:w-auto order-1 sm:order-1 ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' 
                : 'bg-white border-gray-300 text-zinc-800 hover:bg-gray-50'
            }`}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className={`px-4 sm:px-6 py-2 rounded border font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto order-3 sm:order-2 ${
              isDarkMode 
                ? 'border-red-500 text-red-400 hover:bg-red-600 hover:text-white' 
                : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
            }`}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Deletar Usuário
          </button>
          <button 
            type="submit" 
            className={`px-4 sm:px-6 py-2 rounded font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto order-2 sm:order-3 ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            Salvar Alterações
          </button>
          </div>
        </form>
        {/* Popup de confirmação de deleção */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40 p-4" onClick={() => setShowDeleteConfirm(false)} style={{ touchAction: 'none' }}>
            <div className={`rounded-xl shadow-lg p-4 sm:p-6 md:p-8 relative w-full max-w-sm ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            }`} onClick={e => e.stopPropagation()}>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-red-700">Confirmar deleção</h3>
              <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.</p>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button 
                className={`px-3 sm:px-4 py-2 rounded border transition-colors text-sm sm:text-base w-full sm:w-auto ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' 
                    : 'bg-white border-gray-300 text-zinc-800 hover:bg-gray-50'
                }`}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button 
                className="px-3 sm:px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto" 
                onClick={() => { setShowDeleteConfirm(false); onDelete(); }}
              >
                Deletar
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;
