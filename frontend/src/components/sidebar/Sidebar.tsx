import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  TriangleAlert,
  MapPin,
  Gauge,
  LogIn,
  Settings,
  User
} from "lucide-react";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Verifica se é admin
  const isAdmin = user?.role === 'ADMIN';

  const menuItems = isAdmin
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: <Gauge /> },
        { path: '/estacoes', label: 'Estações', icon: <MapPin /> },
        { path: '/alertas', label: 'Alertas', icon: <TriangleAlert /> },
        { path: '/educacao', label: 'Educação', icon: <BookOpen /> },
        { path: '/parametros', label: 'Parâmetros', icon: <Settings /> },
        { path: '/perfil', label: 'Perfil', icon: <User /> },
      ]
    : [
        { path: '/dashboard', label: 'Dashboard', icon: <Gauge /> },
        { path: '/estacoes', label: 'Estações', icon: <MapPin /> },
        { path: '/alertas', label: 'Alertas', icon: <TriangleAlert /> },
        { path: '/educacao', label: 'Educação', icon: <BookOpen /> },
      ];

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
      <div className="w-[17.7rem] bg-slate-900 text-white h-screen fixed left-0 top-0 p-4 flex flex-col overflow-y-auto z-50 transition-all duration-300">
        {/* Logo - Alinhado à esquerda */}
        <div className="flex items-center justify-start mb-2 pl-1">
          <img
            className="w-[6rem] h-[6rem] mr-1"
            src="https://c.animaapp.com/j2YDbmTu/img/4-13@2x.png"
            alt="SkyTrack Logo"
          />
          <h2 className="text-xl font-bold font-poppins leading-[1.8rem]">
            SkyTrack
          </h2>
        </div>

        {/* Menu com botões de login/logoff no final */}
        <nav className="flex flex-col flex-1 justify-between">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] transition-colors group hover:bg-white hover:text-black ${
                  location.pathname === item.path ? 'bg-white text-black' : ''
                }`}
              >
                <span
                  className={`ml-[1.2rem] text-lg ${
                    location.pathname === item.path ? 'text-black' : 'text-white group-hover:text-black'
                  }`}
                >
                  {item.icon}
                </span>
                <span
                  className={`flex-1 text-center text-[0.8rem] font-normal font-poppins leading-[1.8rem] ${
                    location.pathname === item.path ? 'text-black' : 'text-white group-hover:text-black'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Botões de login/logoff */}
          <div className="space-y-2">
            {/* Logoff vermelho apenas para ADMIN */}
            {isAdmin && (
              <button
                onClick={handleLogoffClick}
                className="flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] bg-white text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
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
                className="flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] bg-white text-black transition-colors hover:bg-gray-100"
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
          <div className="bg-white rounded-lg p-6 w-80 shadow-md">
            <h2 className="text-lg font-bold font-poppins mb-4">Confirmar Logoff</h2>
            <p className="text-sm font-normal font-poppins mb-6">Deseja realmente fazer logoff?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelLogoff}
                className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition-colors font-poppins"
              >
                Não
              </button>
              <button
                onClick={confirmLogoff}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors font-poppins"
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