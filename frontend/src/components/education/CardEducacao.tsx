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
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 text-center space-y-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-blue-100">
        <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{dados.valor}</p>
        <h3 className="text-lg font-bold text-zinc-700">{dados.titulo}</h3>
        <p className="text-sm text-zinc-600 font-medium">{dados.descricao}</p>
      </div>
    );
  }

  if (tipo === 'conceito') {
    return (
      <article className="bg-white rounded-2xl border-2 border-purple-100 p-6 space-y-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-102 hover:border-purple-200">
        <h3 className="text-lg font-bold text-purple-800 flex items-center gap-2">{dados.titulo}</h3>
        <p className="text-base text-zinc-600 leading-relaxed">{dados.descricao}</p>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📝</span>
            <p className="text-sm font-bold text-purple-700 uppercase tracking-wide">Como Calcular</p>
          </div>
          <p className="text-base font-bold text-zinc-800 leading-relaxed whitespace-pre-line">{dados.formula}</p>
        </div>
        <div className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
          <Lightbulb className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-yellow-800 mb-1">💡 Dica Prática:</p>
            <p className="text-sm font-medium text-yellow-700">{dados.aplicacao}</p>
          </div>
        </div>
      </article>
    );
  }

  if (tipo === 'parametro') {
    return (
      <article className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-101">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">{dados.titulo}</h3>
          <p className="text-base text-zinc-700 leading-relaxed font-medium">{dados.descricao}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border-2 border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🧮</span>
                <p className="text-sm font-bold text-green-700 uppercase tracking-wide">Fórmula</p>
              </div>
              <p className="text-base font-bold text-zinc-800">{dados.formula}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 border-2 border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">📏</span>
                <p className="text-sm font-bold text-blue-700 uppercase tracking-wide">Unidade</p>
              </div>
              <p className="text-base font-semibold text-zinc-800">{dados.unidade}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border-2 border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💭</span>
              <p className="text-sm font-bold text-purple-700 uppercase tracking-wide">O que significa?</p>
            </div>
            <p className="text-base text-zinc-700 font-medium">{dados.interpretacao}</p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📊</span>
              <p className="text-sm font-bold text-orange-700 uppercase tracking-wide">Valores de Referência</p>
            </div>
            <p className="text-sm font-bold text-orange-800">{dados.faixasReferencia}</p>
          </div>
        </div>
      </article>
    );
  }

  return null;
};

export default CardEducacao;