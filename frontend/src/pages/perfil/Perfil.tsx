import React from 'react';
import { usePerfilPage } from '../../hooks/pages/usePerfilPage';
import PerfilComponent from '../../components/conteudoPaginas/perfil/Perfil';

const Perfil: React.FC = () => {
  const perfilPageData = usePerfilPage();
  
  return (
    <PerfilComponent {...perfilPageData} />
  );
};

export default Perfil;