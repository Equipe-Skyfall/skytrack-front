import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuthService } from '../hooks/auth/useAuthService';
import type { AuthContextType } from '../interfaces/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const authService = useAuthService();

  return (
    <AuthContext.Provider value={authService}>
      {authService.isCheckingAuth ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-zinc-600">Carregando...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};