import React from 'react';
import { Lightbulb } from 'lucide-react';

interface CardEducacaoProps {
  tipo: 'estatistica' | 'conceito' | 'parametro';
  dados: {
    valor?: string;
    titulo: string;
    descricao: string;
    formula?: string;
    aplicacao?: string;
    unidade?: string;
    interpretacao?: string;
    faixasReferencia?: string;
  };
}

const CardEducacao: React.FC<CardEducacaoProps> = ({ tipo, dados }) => {
  if (tipo === 'estatistica') {
    return (
      <div className="bg-zinc-100 rounded-lg p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
        <p className="text-4xl font-extrabold text-zinc-800">{dados.valor}</p>
        <h3 className="text-lg font-semibold text-zinc-700">{dados.titulo}</h3>
        <p className="text-sm text-zinc-500">{dados.descricao}</p>
      </div>
    );
  }

  if (tipo === 'conceito') {
    return (
      <article className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-bold text-zinc-800">{dados.titulo}</h3>
        <p className="text-sm text-zinc-600">{dados.descricao}</p>
        <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
          <p className="text-xs text-zinc-500">Fórmula</p>
          <p className="text-sm font-semibold text-zinc-700 tracking-wider">{dados.formula}</p>
        </div>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          <p className="text-sm font-medium text-zinc-600">{dados.aplicacao}</p>
        </div>
      </article>
    );
  }

  if (tipo === 'parametro') {
    return (
      <article className="bg-white rounded-xl border border-zinc-300 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div>
          <h3 className="text-lg font-bold text-zinc-800">{dados.titulo}</h3>
          <p className="text-base text-zinc-600">{dados.descricao}</p>
          <p className="text-base font-bold text-zinc-700 mt-4">Fórmula:</p>
          <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
            <p className="text-base font-semibold text-zinc-700 tracking-wider">{dados.formula}</p>
          </div>
          <p className="text-base font-bold text-zinc-700 mt-4">Unidade:</p>
          <p className="text-base text-zinc-600">{dados.unidade}</p>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-base font-bold text-zinc-700">Interpretação:</p>
          <p className="text-base text-zinc-600">{dados.interpretacao}</p>
          <p className="text-base font-bold text-zinc-700 mt-4">Faixas de Referência:</p>
          <p className="text-base text-zinc-600">{dados.faixasReferencia}</p>
        </div>
      </article>
    );
  }

  return null;
};

export default CardEducacao;