import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (cargo: string) => {
    login(cargo);
    navigate('/dashboard'); // Redireciona para dashboard após login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('COLABORADOR')}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Entrar como Colaborador
          </button>
          
          <button
            onClick={() => handleLogin('GERENTE')}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
          >
            Entrar como Gerente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;