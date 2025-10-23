import React from 'react';
import { useEducacaoPage } from '../../hooks/pages/useEducacaoPage';
import ConteudoEducacao from '../../components/conteudoPaginas/educacao/ConteudoEducacao';

const Educacao: React.FC = () => {
  const educacaoPageData = useEducacaoPage();
  
  return (
    <div className="Educacao">
      <ConteudoEducacao {...educacaoPageData} />
    </div>
  );
};

export default Educacao;
