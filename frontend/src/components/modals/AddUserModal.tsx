import React, { useState } from 'react';
import type { AddUserModalProps } from '../../interfaces/components';

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // role removido, sempre ADMIN
  const [error, setError] = useState<string | null>(null);


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
      className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/10 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-6">Formulário de Adição</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Nome de Usuário</label>
            <input type="text" className="w-full border rounded px-3 py-2" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">E-mail</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Senha</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Confirmar Senha</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          {/* Campo Tipo removido, sempre ADMIN */}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-between mt-4">
            <button type="button" className="px-6 py-2 rounded border border-black hover:bg-red-500 hover:text-white transition-colors" onClick={onClose}>Cancelar</button>
            <button type="submit" className="px-6 py-2 rounded bg-[#0F172B] text-white font-semibold hover:bg-blue-900">Salvar Usuário</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
