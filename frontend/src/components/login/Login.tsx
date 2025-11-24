import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  UsersRound,
  CloudRain,
  LogIn,
  Lock,
  Mail,
  User,
  ArrowLeft,
  Moon,
  Sun
} from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import TwoFactorAuthModal from '../modals/TwoFactorAuthModal';

const ConteudoLogin: React.FC = () => {
  const { login, verify2FA, request2FACode } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await login(email, password);
      
      // Se o resultado contém um sessionToken, significa que precisa de 2FA
      if (result && typeof result === 'object' && 'sessionToken' in result && result.requires2FA) {
        setSessionToken(result.sessionToken);
        setShowTwoFactorModal(true);
      }
      // Caso contrário, o login foi bem-sucedido e o AuthContext já navegou
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleVerify2FA = async (code: string) => {
    if (!sessionToken) {
      throw new Error('Sessão inválida');
    }
    
    try {
      await verify2FA(sessionToken, code);
      setShowTwoFactorModal(false);
      // O AuthContext já deve navegar para o dashboard após verificação bem-sucedida
    } catch (err) {
      throw err; // Propaga o erro para o modal mostrar
    }
  };

  const handleResend2FACode = async () => {
    try {
      const result = await request2FACode(email, password);
      if (result && 'sessionToken' in result) {
        setSessionToken(result.sessionToken);
      }
    } catch (err) {
      throw err;
    }
  };

  const handleBack2FA = () => {
    setShowTwoFactorModal(false);
    setSessionToken(null);
    setPassword(''); // Limpa a senha por segurança
  };

  const handlePublicEntry = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-poppins relative ${
      isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-white'
    }`}>
      <button
        onClick={handleBack}
        className={`absolute top-4 left-4 font-bold py-2 px-3 rounded-md flex items-center gap-2 transition-colors duration-200 cursor-pointer ${
          isDarkMode 
            ? 'text-white hover:text-gray-300' 
            : 'text-black hover:text-slate-700'
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Voltar</span>
      </button>

      {/* Botão Dark Mode no canto superior direito */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-md transition-colors duration-200 cursor-pointer ${
          isDarkMode
            ? 'bg-slate-800 hover:bg-slate-700 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
        title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
      >
        {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-blue-500" />}
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Left Side - Branding */}
        <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
          <div className="space-y-4">
            {/* Layout Mobile: Logo em cima do texto */}
            <div className="lg:hidden flex flex-col items-center">
              <img
                className="w-24 h-24 md:w-32 md:h-32 z-10 -mb-6"
                src="https://c.animaapp.com/j2YDbmTu/img/4-13@2x.png"
                alt="SkyTrack Logo"
              />
              <span className={`text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                SkyTrack
              </span>
            </div>

            {/* Layout Desktop: Logo ao lado do texto */}
            <div className="hidden lg:flex items-center justify-center lg:justify-start gap-1">
              <img
                className="w-[9.25rem] h-[9.25rem]"
                src="https://c.animaapp.com/j2YDbmTu/img/4-13@2x.png"
                alt="SkyTrack Logo"
              />
              <span className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>SkyTrack</span>
            </div>
            
            <h1 className={`text-xl md:text-4xl font-bold lg:-mt-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Sistema de Monitoramento Meteorológico
            </h1>
            <p className={`text-sm md:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Monitore condições meteorológicas em tempo real e receba alertas de desastres naturais.
            </p>
          </div>

          {/* Cards de Features - Apenas no Desktop */}
          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`flex flex-col items-center p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <Shield className={`h-8 w-8 mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Seguro</h3>
              <p className={`text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Dados protegidos e criptografados
              </p>
            </div>
            <div className={`flex flex-col items-center p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <UsersRound className={`h-8 w-8 mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Colaborativo</h3>
              <p className={`text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Acesso para toda sua equipe
              </p>
            </div>
            <div className={`flex flex-col items-center p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <CloudRain className={`h-8 w-8 mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>Tempo Real</h3>
              <p className={`text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Monitoramento 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col space-y-6 md:space-y-8">
          {/* Formulário de Login */}
          <div className={`w-full rounded-lg shadow-md p-4 md:p-6 border-1 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white'
          }`}>
            <div className="text-center mb-4 md:mb-6">
              <h2 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Acesso ao Sistema
              </h2>
              <p className={`text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Entre com suas credenciais para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {error && <p className={`text-sm text-center ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>}
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className={`block text-sm font-bold ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-3 h-4 w-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className={`w-full pl-10 pr-4 py-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className={`block text-sm font-bold ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-3 h-4 w-4 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-4 py-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-blue-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base"
              >
                <LogIn className="h-4 w-4" />
                Entrar no Sistema
              </button>

              <div className={`w-full h-[1px] my-4 md:my-6 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-300'}`}></div>

              <div className="space-y-3 md:space-y-4">
                <div className="text-center">
                  <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Não tem uma conta?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={handlePublicEntry}
                    className={`w-full border font-bold py-2 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base ${
                      isDarkMode
                        ? 'border-slate-600 bg-slate-700 text-white hover:bg-slate-600'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Entrada Pública
                  </button>
                </div>
              </div>

              <div className={`p-3 md:p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                <h4 className={`font-bold mb-2 text-sm md:text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Tipos de Acesso:
                </h4>
                <ul className={`text-xs md:text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}>
                  <li>• <strong>Público:</strong> Visualização de dados e alertas</li>
                  <li>• <strong>Administrador:</strong> Acesso completo ao sistema</li>
                </ul>
              </div>
            </form>
          </div>

          {/* Cards de Features - Apenas no Mobile */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className={`flex flex-col items-center p-3 md:p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <Shield className={`h-8 w-8 md:h-8 md:w-8 mb-1 md:mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <h3 className={`font-semibold text-sm md:text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>Seguro</h3>
              <p className={`text-xs md:text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Dados protegidos e criptografados
              </p>
            </div>
            <div className={`flex flex-col items-center p-3 md:p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <UsersRound className={`h-8 w-8 md:h-8 md:w-8 mb-1 md:mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <h3 className={`font-semibold text-sm md:text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>Colaborativo</h3>
              <p className={`text-xs md:text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Acesso para toda sua equipe
              </p>
            </div>
            <div className={`flex flex-col items-center p-3 md:p-4 rounded-lg ${
              isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
            }`}>
              <CloudRain className={`h-8 w-8 md:h-8 md:w-8 mb-1 md:mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`} />
              <h3 className={`font-semibold text-sm md:text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>Tempo Real</h3>
              <p className={`text-xs md:text-sm text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Monitoramento 24/7
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Autenticação em Dois Fatores */}
      <TwoFactorAuthModal
        isOpen={showTwoFactorModal}
        email={email}
        password={password}
        sessionToken={sessionToken}
        onVerify={handleVerify2FA}
        onResendCode={handleResend2FACode}
        onBack={handleBack2FA}
      />
    </div>
  );
};

export default ConteudoLogin;