// components/navigation/Layout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import type { LayoutProps } from '../../interfaces/components';
import { useTheme } from '../../contexts/ThemeContext';
import Notification from '../notifications/Notification';



const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-white'}`}>
      <Sidebar />
      <div className={`flex-1 ml-[17.7rem] p-6 min-h-screen overflow-auto ${isDarkMode ? 'bg-transparent' : ''}`}>
        <Notification /> {/* Adiciona o componente de notificações */}
        {children}
      </div>
    </div>
  );
};

export default Layout;