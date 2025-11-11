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
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`rounded-xl shadow-lg w-full max-w-2xl p-8 relative transform transition-all duration-300 ease-out scale-100 opacity-100 ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <button className={`absolute top-4 right-4 text-2xl ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-zinc-800 hover:text-black'}`} onClick={onClose}>&times;</button>
        <h2 className={`text-2xl font-bold mb-2 font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Editar Usuário</h2>
        <div className={`text-xl font-semibold mb-4 font-poppins ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>{initialData.username}</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <div className="flex justify-between mt-4 gap-2">
          <button 
            type="button" 
            className={`px-6 py-2 rounded border transition-colors ${
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
            className={`px-6 py-2 rounded border font-semibold transition-colors ${
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
            className={`px-6 py-2 rounded font-semibold transition-colors ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            Salvar Alterações
          </button>
          </div>
        </form>
        {/* Popup de confirmação de deleção */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20" onClick={() => setShowDeleteConfirm(false)}>
            <div className={`rounded-xl shadow-lg p-8 relative w-full max-w-sm ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            }`} onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4 text-red-700">Confirmar deleção</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end gap-2">
              <button 
                className={`px-4 py-2 rounded border transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' 
                    : 'bg-white border-gray-300 text-zinc-800 hover:bg-gray-50'
                }`}
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors" 
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
