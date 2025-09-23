import React, { useState } from 'react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; username: string; password: string }) => void;
  initialData: { email: string; username: string };
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [email, setEmail] = useState(initialData.email);
  const [username, setUsername] = useState(initialData.username);
  const [password, setPassword] = useState('');
  // role removido, sempre ADMIN

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
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>&times;</button>
  <h2 className="text-2xl font-bold mb-2">Editar Usuário</h2>
  <div className="text-2xl font-bold text-gray-800 mb-4">{initialData.username}</div>
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
            <label className="block font-semibold mb-1">Nova senha (opcional)</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {/* Campo Tipo removido, sempre ADMIN */}
          <div className="flex justify-between mt-4">
            <button type="button" className="px-6 py-2 rounded border border-black hover:bg-red-500 hover:text-white transition-colors" onClick={onClose}>Cancelar</button>
            <button type="submit" className="px-6 py-2 rounded bg-[#0F172B] text-white font-semibold hover:bg-blue-900">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
