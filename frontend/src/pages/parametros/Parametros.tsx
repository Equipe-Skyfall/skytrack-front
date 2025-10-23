import React from 'react';
import { useParametrosPage } from '../../hooks/pages/useParametrosPage';
import ParametersContent from '../../components/conteudoPaginas/parametros/ParametersContent';

const Parametros: React.FC = () => {
  const parametrosPageData = useParametrosPage();
  
  return <ParametersContent {...parametrosPageData} />;
};

export default Parametros;