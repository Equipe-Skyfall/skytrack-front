import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTachometerAlt, FaMapMarkerAlt, FaExclamationTriangle, FaBook, FaCog, FaUser, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Configs por cargo
  const isAdmin = user?.cargo === 'GERENTE';
  const isColaborador = user?.cargo === 'COLABORADOR';
  
  const menuItems = isAdmin
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/estacoes', label: 'Estações', icon: <FaMapMarkerAlt /> },
        { path: '/alertas', label: 'Alertas', icon: <FaExclamationTriangle /> },
        { path: '/educacao', label: 'Educação', icon: <FaBook /> },
        { path: '/parametros', label: 'Parâmetros', icon: <FaCog /> },
        { path: '/perfil', label: 'Perfil', icon: <FaUser /> },
      ]
    : [
        { path: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/estacoes', label: 'Estações', icon: <FaMapMarkerAlt /> },
        { path: '/alertas', label: 'Alertas', icon: <FaExclamationTriangle /> },
        { path: '/educacao', label: 'Educação', icon: <FaBook /> },
      ];

  return (
    <div className="w-[17.7rem] bg-slate-900 text-white h-screen fixed left-0 top-0 p-4 flex flex-col overflow-y-auto z-50 transition-all duration-300">
      {/* Logo - Alinhado à esquerda */}
      <div className="flex items-center justify-start mb-2 pl-1"> {/* justify-start e pl-3 */}
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
          {/* Logoff vermelho apenas para GERENTE - hover permanente vermelho */}
          {isAdmin && (
            <button
              onClick={logout}
              className="flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] bg-white text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <span className="ml-[1.2rem] text-lg">
                <FaSignOutAlt />
              </span>
              <span className="flex-1 text-center text-[0.8rem] font-normal font-poppins leading-[1.8rem]">
                Logoff
              </span>
            </button>
          )}

          {/* Login para COLABORADOR - HOVER PERMANENTE (sempre branco) */}
          {isColaborador && (
            <Link
              to="/login"
              className="flex items-center w-[15.4rem] h-[3.3rem] mx-auto rounded-[0.3rem] bg-white text-black transition-colors hover:bg-gray-100"
            >
              <span className="ml-[1.2rem] text-lg">
                <FaSignInAlt />
              </span>
              <span className="flex-1 text-center text-[0.8rem] font-normal font-poppins leading-[1.8rem]">
                Login
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;