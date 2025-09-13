import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/sidebar/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Estacoes from './pages/estacoes/Estacoes';
import Alertas from './pages/alertas/Alertas';
import Educacao from './pages/educacao/Educacao';
import Parametros from './pages/parametros/Parametros';
import Perfil from './pages/perfil/Perfil';
import Usuarios from './pages/usuarios/Usuarios';
import Login from './pages/login/Login';

// Componente para proteger rotas de admin
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.cargo === 'GERENTE' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Componente para proteger rotas gerais (apenas usuários logados)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Login - acessível sempre (com ou sem login) */}
          <Route path="/login" element={<Login />} />
          
          {/* Páginas com Layout (sidebar) - apenas para usuários logados */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Rotas que qualquer usuário logado pode acessar */}
          <Route path="/estacoes" element={
            <ProtectedRoute>
              <Layout><Estacoes /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/alertas" element={
            <ProtectedRoute>
              <Layout><Alertas /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/educacao" element={
            <ProtectedRoute>
              <Layout><Educacao /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Layout><Perfil /></Layout>
            </ProtectedRoute>
          } />

          {/* Rotas apenas para admin */}
          <Route path="/parametros" element={
            <AdminRoute>
              <Layout><Parametros /></Layout>
            </AdminRoute>
          } />
          <Route path="/usuarios" element={
            <AdminRoute>
              <Layout><Usuarios /></Layout>
            </AdminRoute>
          } />
          
          {/* Default redireciona para dashboard se logado, senão para login */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Redireciona rotas não encontradas */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Componente para redirecionamento inteligente da raiz
const RootRedirect: React.FC = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default App;