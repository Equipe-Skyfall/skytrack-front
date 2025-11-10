import React, { useState, useEffect } from 'react';
import type { User } from '../../interfaces/auth';

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with real API call
        // const response = await getUsers();
        // setUsers(response.data);
        
        // For now, provide empty array to avoid mock data
        setUsers([]);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-800 font-poppins mb-6">Usuários</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center min-h-32">
            <div className="text-lg text-zinc-600 font-poppins">Carregando usuários...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-800 font-poppins mb-6">Usuários</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-center min-h-32">
            <div className="text-lg text-red-600 font-poppins">Erro: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-800 font-poppins mb-6">Usuários</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {users.length === 0 ? (
          <p className="text-zinc-600 font-poppins">Nenhum usuário encontrado.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="font-semibold text-zinc-900 font-poppins">{user.username}</h3>
                <p className="text-zinc-600 font-poppins">{user.email}</p>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded font-poppins">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Usuarios;