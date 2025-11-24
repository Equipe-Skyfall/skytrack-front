import React, { useState } from 'react';
import type { AddUserModalProps } from '../../interfaces/components';
import { useTheme } from '../../contexts/ThemeContext';

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // role removido, sempre ADMIN
  const [error, setError] = useState<string | null>(null);

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


  // Animação: transição de escala e opacidade
  // O modal só é renderizado se isOpen for true, mas a animação é feita via Tailwind
  // Para animação suave, pode-se usar transition, duration, ease, scale e opacity
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !username || !password || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
  onSubmit({ email, username, password, confirmPassword });
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
        <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Criar Novo Usuário</h2>
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
            <label className={`block text-sm font-medium font-poppins mb-1 ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>Senha</label>
            <input 
              type="password" 
              className={`w-full border rounded px-3 py-2 font-poppins ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-zinc-300 text-zinc-800'
              }`}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          <div>
            <label className={`block text-sm font-medium font-poppins mb-1 ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>Confirmar Senha</label>
            <input 
              type="password" 
              className={`w-full border rounded px-3 py-2 font-poppins ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-zinc-300 text-zinc-800'
              }`}
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
            />
          </div>
          {/* Campo Tipo removido, sempre ADMIN */}
          {error && <div className="text-red-500 text-xs sm:text-sm font-poppins">{error}</div>}
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3 mt-3 sm:mt-4">
          <button 
            type="button" 
            className={`px-4 sm:px-6 py-2 rounded border transition-colors text-sm sm:text-base w-full sm:w-auto ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' 
                : 'bg-white border-gray-300 text-zinc-800 hover:bg-gray-50'
            }`}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={`px-4 sm:px-6 py-2 rounded font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            Salvar Usuário
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
