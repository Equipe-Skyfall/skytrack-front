import React from 'react';
import ConteudoEducacao from '../../components/education/ConteudoEducacao';

const Educacao: React.FC = () => {
  const educacaoPageData = useEducacaoPage();
  
  return (
    <div className="Educacao">
      <ConteudoEducacao {...educacaoPageData} />
    </div>
  );
};

export default Educacao;
