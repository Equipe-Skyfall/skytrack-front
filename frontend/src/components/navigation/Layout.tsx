// components/navigation/Layout.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import type { LayoutProps } from '../../interfaces/components';
import { useTheme } from '../../contexts/ThemeContext';
import Notification from '../notifications/Notification';
import { Menu } from 'lucide-react';



const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-white'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`flex-1 lg:ml-[17.7rem] min-h-screen overflow-auto ${isDarkMode ? 'bg-transparent' : ''}`}>
        {/* Header mobile com menu hambúrguer */}
        <div className={`lg:hidden sticky top-0 z-30 flex items-center gap-3 py-2 px-4 border-b ${
          isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
            }`}
            aria-label="Abrir menu"
          >
            <Menu className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/favicon.png"
              alt="SkyTrack Logo"
              className="w-[3.75rem] h-[3.75rem] object-contain"
            />
            <h1 className={`text-xl font-bold font-poppins ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              SkyTrack
            </h1>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <Notification /> {/* Adiciona o componente de notificações */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;