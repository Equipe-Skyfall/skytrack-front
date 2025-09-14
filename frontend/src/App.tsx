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
  return user?.role === 'ADMIN' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login - acessível para todos */}
          <Route path="/login" element={<Login />} />
          
          {/* Páginas públicas com Layout (sidebar) */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/estacoes" element={<Layout><Estacoes /></Layout>} />
          <Route path="/alertas" element={<Layout><Alertas /></Layout>} />
          <Route path="/educacao" element={<Layout><Educacao /></Layout>} />
          <Route path="/perfil" element={<Layout><Perfil /></Layout>} />

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
          
          {/* Default redireciona para dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Redireciona rotas não encontradas */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;