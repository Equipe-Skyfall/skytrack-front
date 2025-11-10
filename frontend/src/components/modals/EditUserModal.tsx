import React, { useEffect, useState } from 'react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; username: string; password: string }) => void;
  onDelete: () => void;
  initialData: { email: string; username: string };
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSubmit, onDelete, initialData }) => {
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
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-8 relative transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={e => e.stopPropagation()}
      >
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-2 font-poppins text-zinc-800">Editar Usuário</h2>
        <div className="text-xl font-semibold text-zinc-700 mb-4 font-poppins">{initialData.username}</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 font-poppins mb-1">Nome de Usuário</label>
            <input type="text" className="w-full border rounded px-3 py-2 font-poppins" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 font-poppins mb-1">E-mail</label>
            <input type="email" className="w-full border rounded px-3 py-2 font-poppins" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 font-poppins mb-1">Nova senha (opcional)</label>
            <input type="password" className="w-full border rounded px-3 py-2 font-poppins" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {/* Campo Tipo removido, sempre ADMIN */}
          <div className="flex justify-between mt-4 gap-2">
          <button type="button" className="px-6 py-2 rounded bg-white border border-gray-300 hover:bg-gray-50 transition-colors" onClick={onClose}>Cancelar</button>
          <button type="button" className="px-6 py-2 rounded border border-red-600 text-red-600 font-semibold hover:bg-red-600 hover:text-white transition-colors" onClick={() => setShowDeleteConfirm(true)}>Deletar Usuário</button>
          <button type="submit" className="px-6 py-2 rounded bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors">Salvar Alterações</button>
          </div>
        </form>
        {/* Popup de confirmação de deleção */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white rounded-xl shadow-lg p-8 relative w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4 text-red-700">Confirmar deleção</h3>
              <p className="mb-6 text-gray-700">Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.</p>
              <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-white border border-gray-300 hover:bg-gray-50 transition-colors" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors" onClick={() => { setShowDeleteConfirm(false); onDelete(); }}>Deletar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserModal;
