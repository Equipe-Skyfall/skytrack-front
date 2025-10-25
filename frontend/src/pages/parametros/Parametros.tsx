import React from 'react';
import ParametersContent from '../../components/parametros/ParametersContent';
import { useParametrosPage } from '../../hooks/pages/useParametrosPage';

const Parametros: React.FC = () => {
  const parametrosPageData = useParametrosPage();
  
  return <ParametersContent {...(parametrosPageData as any)} />;
};

export default Parametros;