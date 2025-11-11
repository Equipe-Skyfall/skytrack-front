import React from 'react';
import { TrendingUp, Calculator, BookOpen, Thermometer, Droplets, Wind, Gauge, Cloud, Sun } from 'lucide-react';

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
    nome?: string;
  };
  isDarkMode?: boolean;
}

const CardEducacao: React.FC<CardEducacaoProps> = ({ tipo, dados, isDarkMode = false }) => {
  // Função para obter o ícone correto baseado no título
  const getIconByTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('temperatura') || lowerTitle.includes('térmica')) return Thermometer;
    if (lowerTitle.includes('umidade')) return Droplets;
    if (lowerTitle.includes('vento') || lowerTitle.includes('velocidade')) return Wind;
    if (lowerTitle.includes('pressão') || lowerTitle.includes('atmosférica')) return Gauge;
    if (lowerTitle.includes('precipitação') || lowerTitle.includes('chuva')) return Cloud;
    if (lowerTitle.includes('radiação') || lowerTitle.includes('solar')) return Sun;
    return TrendingUp;
  };

  if (tipo === 'estatistica') {
    const Icon = getIconByTitle(dados.titulo);
    
    return (
      <div className={`rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-2">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <p className={`text-4xl font-bold font-poppins ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{dados.valor}</p>
          <h3 className={`text-lg font-semibold font-poppins ${isDarkMode ? 'text-gray-200' : 'text-zinc-800'}`}>{dados.titulo}</h3>
          <p className={`text-sm font-poppins ${isDarkMode ? 'text-gray-400' : 'text-zinc-600'}`}>{dados.descricao}</p>
        </div>
      </div>
    );
  }

  if (tipo === 'conceito') {
    return (
      <article className={`rounded-lg border p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-900 rounded-lg">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <h3 className={`text-lg font-semibold font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>{dados.titulo}</h3>
        </div>
        <p className={`text-base font-poppins leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>{dados.descricao}</p>
        
        {/* Destaque para Fórmula com barra lateral */}
        <div className={`relative rounded-lg p-4 border-l-4 border-slate-900 ${
          isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
            <p className={`text-sm font-bold font-poppins uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fórmula</p>
          </div>
          <pre className={`text-sm font-mono leading-relaxed whitespace-pre-line p-3 rounded border ${
            isDarkMode 
              ? 'text-gray-200 bg-slate-800 border-slate-600' 
              : 'text-zinc-800 bg-white border-gray-200'
          }`}>{dados.formula}</pre>
        </div>
        
        <div className={`rounded-lg p-4 border ${
          isDarkMode 
            ? 'bg-blue-900/30 border-blue-700' 
            : 'bg-blue-50 border-blue-100'
        }`}>
          <div className="flex items-start gap-2">
            <TrendingUp className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`text-sm font-medium font-poppins mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Aplicação Prática</p>
              <p className={`text-sm font-poppins ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>{dados.aplicacao}</p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (tipo === 'parametro') {
    return (
      <article className={`rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="space-y-4">
          <div className={`flex items-center gap-2 pb-3 border-b-2 border-slate-900`}>
            <div className="p-2 bg-slate-900 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className={`text-xl font-semibold font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>{dados.nome || dados.titulo}</h3>
          </div>
          <p className={`text-base font-poppins leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>{dados.descricao}</p>
          
          {/* Grid com destaque para Fórmula */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`relative rounded-lg p-4 border-l-4 border-slate-900 ${
              isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
                <p className={`text-sm font-bold font-poppins uppercase tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Fórmula</p>
              </div>
              <pre className={`text-sm font-mono whitespace-pre-wrap ${isDarkMode ? 'text-gray-200' : 'text-zinc-800'}`}>{dados.formula}</pre>
            </div>
            
            <div className={`rounded-lg p-4 border ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <p className={`text-sm font-medium font-poppins mb-2 ${isDarkMode ? 'text-gray-300' : 'text-zinc-700'}`}>Unidade</p>
              <p className={`text-base font-semibold font-poppins ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{dados.unidade}</p>
            </div>
          </div>

          <div className={`rounded-lg p-4 border ${
            isDarkMode 
              ? 'bg-slate-700 border-slate-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <p className={`text-sm font-medium font-poppins mb-2 ${isDarkMode ? 'text-gray-300' : 'text-zinc-700'}`}>Interpretação</p>
            <p className={`text-sm font-poppins ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>{dados.interpretacao}</p>
          </div>

          <div className={`rounded-lg p-4 border-l-4 border-blue-600 ${
            isDarkMode 
              ? 'bg-blue-900/30 border-blue-700' 
              : 'bg-blue-50'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <p className={`text-sm font-bold font-poppins uppercase tracking-wide ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Valores de Referência</p>
            </div>
            <p className={`text-sm font-poppins ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>{dados.faixasReferencia || dados.aplicacao}</p>
          </div>
        </div>
      </article>
    );
  }

  return null;
};

export default CardEducacao;