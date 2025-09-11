import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  cargo: string;
  nome: string;
}

interface AuthContextType {
  user: User | null;
  login: (cargo: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({ cargo: 'GERENTE', nome: 'João' }); // COLABORADOR ou GERENTE

  const login = (cargo: string) => {
    setUser({ cargo, nome: 'Usuário' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};