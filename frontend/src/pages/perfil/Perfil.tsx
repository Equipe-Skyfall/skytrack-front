import React from 'react';
import PerfilComponent from '../../components/profile/Perfil';

const Perfil: React.FC = () => {
  const perfilPageData = usePerfilPage();
  
  return (
    <PerfilComponent {...perfilPageData} />
  );
};

export default Perfil;