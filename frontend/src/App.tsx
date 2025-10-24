// App.tsx (atualizado)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/navigation/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Estacoes from './pages/estacoes/Estacoes';
import Alertas from './pages/alertas/Alertas';
import Educacao from './pages/educacao/Educacao';
import Parametros from './pages/parametros/Parametros';
import Perfil from './pages/perfil/Perfil';
import Usuarios from './pages/usuarios/Usuarios';
import Relatorios from './pages/relatorios/Relatorios';
import Login from './pages/login/Login';
import NotFoundPage from './components/notFound/notFoundPage';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'ADMIN' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/estacoes" element={<Layout><Estacoes /></Layout>} />
            <Route path="/alertas" element={<Layout><Alertas /></Layout>} />
            <Route path="/educacao" element={<Layout><Educacao /></Layout>} />
            {/* RELATÓRIOS APENAS PARA ADMIN */}
            <Route path="/relatorios" element={
              <AdminRoute>
                <Layout><Relatorios /></Layout>
              </AdminRoute>
            } />
            <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
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
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;