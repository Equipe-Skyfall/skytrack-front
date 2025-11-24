// Sidebar.tsx (atualizado)
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  BookOpen,
  TriangleAlert,
  MapPin,
  Gauge,
  LogIn,
  Settings,
  User,
  Moon,
  Sun,
  X,
  // BarChart3 // DESATIVADO - usado em Relatórios
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Verifica se é admin
  const isAdmin = user?.role === 'ADMIN';

  // Menu base para todos os usuários
  const baseMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Gauge /> },
    { path: '/estacoes', label: 'Estações', icon: <MapPin /> },
    { path: '/alertas', label: 'Alertas', icon: <TriangleAlert /> },
    { path: '/educacao', label: 'Educação', icon: <BookOpen /> },
  ];

  // Menu adicional apenas para ADMIN
  const adminMenuItems = [
    // { path: '/relatorios', label: 'Relatórios', icon: <BarChart3 /> }, // DESATIVADO
    { path: '/parametros', label: 'Parâmetros', icon: <Settings /> },
    { path: '/perfil', label: 'Perfil', icon: <User /> },
  ];

  // Menu completo baseado no tipo de usuário
  const menuItems = isAdmin 
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  const handleLogoffClick = () => {
    setIsModalOpen(true);
  };

  const confirmLogoff = () => {
    logout();
    setIsModalOpen(false);
  };

  const cancelLogoff = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`w-[17.7rem] h-screen fixed left-0 top-0 p-4 flex flex-col overflow-y-auto z-50 transition-transform duration-300 ${
        isDarkMode 
          ? 'bg-slate-950 text-white' 
          : 'bg-slate-900 text-white'
      } ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo e botão fechar (mobile) */}
        <div className="flex items-center justify-between mb-2 pl-1">
          <div className="flex items-center">
          <img
            className="w-[6rem] h-[6rem] mr-1"
            src="https://c.animaapp.com/j2YDbmTu/img/4-13@2x.png"
            alt="SkyTrack Logo"
          />
          <h2 className="text-xl font-bold font-poppins leading-[1.8rem] text-white">
            SkyTrack
          </h2>
          </div>
          
          {/* Botão fechar (apenas mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Fechar menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu com botões de login/logoff no final */}
        <nav className="flex flex-col flex-1 justify-between">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] transition-colors group ${
                  isDarkMode 
                    ? location.pathname === item.path 
                      ? 'bg-zinc-700 text-white' 
                      : 'hover:bg-zinc-800 text-white'
                    : location.pathname === item.path 
                      ? 'bg-white text-black' 
                      : 'hover:bg-white hover:text-black text-white'
                }`}
              >
                <span
                  className={`ml-[1.2rem] text-lg ${
                    isDarkMode
                      ? location.pathname === item.path ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      : location.pathname === item.path ? 'text-black' : 'text-white group-hover:text-black'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`flex-1 text-center text-[0.8rem] font-normal font-poppins leading-[1.8rem] ${
                    isDarkMode
                      ? location.pathname === item.path ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      : location.pathname === item.path ? 'text-black' : 'text-white group-hover:text-black'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Botões de login/logoff */}
          <div className="space-y-2">
            {/* Botão Dark Mode */}
            <button
              onClick={toggleTheme}
              className={`flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] text-white transition-colors group ${
                isDarkMode
                  ? 'bg-slate-900 hover:bg-slate-800'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <span className="ml-[1.2rem] text-lg">
                {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-300" />}
              </span>
              <span className="flex-1 text-center text-[0.8rem] font-normal font-poppins leading-[1.8rem]">
                {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              </span>
            </button>

            {/* Logoff vermelho apenas para ADMIN */}
            {isAdmin && (
              <button
                onClick={handleLogoffClick}
                className={`flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-700 text-red-400 hover:bg-zinc-600 hover:text-red-300'
                    : 'bg-white text-red-600 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                <span className="ml-[1.2rem] text-lg">
                  <LogIn />
                </span>
                <span className="flex-1 text-center text-[0.8rem] font-normal font-poppins leading-[1.8rem]">
                  Logoff
                </span>
              </button>
            )}

            {/* Login para usuário não logado */}
            {!isAdmin && (
              <Link
                to="/login"
                className={`flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-700 text-white hover:bg-zinc-600'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                <span className="ml-[1.2rem] text-lg">
                  <LogIn />
                </span>
                <span className="flex-1 text-center text-[0.8rem] font-normal font-poppins leading-[1.8rem]">
                  Login
                </span>
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Modal de confirmação de Logoff */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 w-80 shadow-md ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h2 className={`text-lg font-bold font-poppins mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Confirmar Logoff</h2>
            <p className={`text-sm font-normal font-poppins mb-6 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Deseja realmente fazer logoff?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogoff}
                className={`border py-2 px-4 rounded transition-colors font-poppins ${
                  isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                    : 'bg-white border-gray-300 text-black hover:bg-gray-50'
                }`}
              >
                Não
              </button>
              <button
                onClick={confirmLogoff}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors font-poppins"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;