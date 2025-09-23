import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  UsersRound,
  CloudRain,
  LogIn,
  Lock,
  Mail,
  User,
  ArrowLeft
} from "lucide-react";

const ConteudoLogin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handlePublicEntry = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4 font-poppins relative">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-black hover:text-slate-700 font-bold py-2 px-3 rounded-md flex items-center gap-2 transition-colors duration-200 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-1">
              <img
                className="w-[9.25rem] h-[9.25rem]"
                src="https://c.animaapp.com/j2YDbmTu/img/4-13@2x.png"
                alt="SkyTrack Logo"
              />
              <span className="text-5xl font-bold">SkyTrack</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 -mt-8">
              Sistema de Monitoramento Meteorológico
            </h1>
            <p className="text-lg text-gray-600">
              Monitore condições meteorológicas em tempo real e receba alertas de desastres naturais.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
              <Shield className="h-8 w-8 text-black mb-2" />
              <h3 className="font-semibold">Seguro</h3>
              <p className="text-sm text-gray-600 text-center">Dados protegidos e criptografados</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
              <UsersRound className="h-8 w-8 text-black mb-2" />
              <h3 className="font-semibold">Colaborativo</h3>
              <p className="text-sm text-gray-600 text-center">Acesso para toda sua equipe</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
              <CloudRain className="h-8 w-8 text-black mb-2" />
              <h3 className="font-semibold">Tempo Real</h3>
              <p className="text-sm text-gray-600 text-center">Monitoramento 24/7</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full bg-white rounded-lg shadow-md p-6 border-1">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Acesso ao Sistema</h2>
            <p className="text-gray-600">Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-600" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Entrar no Sistema
            </button>

            <div className="w-full h-[1px] bg-gray-300 my-6"></div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Não tem uma conta?</p>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={handlePublicEntry}
                  className="w-full border border-gray-300 text-gray-700 font-bold py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  Entrada Pública
                </button>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-bold mb-2 text-black">Tipos de Acesso:</h4>
              <ul className="text-sm text-black space-y-1">
                <li>• <strong>Público:</strong> Visualização de dados e alertas</li>
                <li>• <strong>Administrador:</strong> Acesso completo ao sistema</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConteudoLogin;