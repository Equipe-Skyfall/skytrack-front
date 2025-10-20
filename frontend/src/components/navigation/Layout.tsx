// components/navigation/Layout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import type { LayoutProps } from '../../interfaces/components';

import Notification from '../notifications/Notification';



const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[17.7rem] p-6 min-h-screen overflow-auto">
        <Notification /> {/* Adiciona o componente de notificações */}
        {children}
      </div>
    </div>
  );
};

export default Layout;