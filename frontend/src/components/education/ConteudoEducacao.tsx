import React from 'react';
import { ArrowLeft, BarChart2, Calculator, BookOpen } from 'lucide-react';
import SecaoEducacao from './SecaoEducacao';
import { useEducacao } from '../../hooks/educacao/useEducacao';
import CardEducacao from './CardEducacao';


const ConteudoEducacao: React.FC = () => {
  const { voltarParaDashboard } = useEducacao();

  const estatisticasDashboard = [
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '15.2mm',
        titulo: 'Precipitação Atual',
        descricao: 'Equivale a 15.2 litros por m²'
      }
    },
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '8.5mm/h',
        titulo: 'Intensidade',
        descricao: 'Classificada como moderada'
      }
    },
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '78.4mm',
        titulo: 'Acumulado 24h',
        descricao: 'Evento significativo (>50mm)'
      }
    }
  ];

  const conceitosEstatisticos = [
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Média Móvel',
        descricao: 'Suaviza variações de curto prazo para identificar tendências',
        formula: 'MA = (x₁ + x₂ + ... + xₙ) / n',
        aplicacao: 'Análise de tendências de precipitação'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Desvio Padrão',
        descricao: 'Mede a dispersão dos dados em relação à média',
        formula: 'σ = √[(Σ(x - μ)²) / N]',
        aplicacao: 'Variabilidade das medições'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Percentis',
        descricao: 'Indica a posição relativa de um valor no conjunto de dados',
        formula: 'P = (n/N) × 100',
        aplicacao: 'Classificação de eventos extremos'
      }
    }
  ];

  const parametrosMeteorologicos = [
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Precipitação (mm)',
        descricao: 'Volume de água acumulado por unidade de área',
        formula: 'P = V / A',
        unidade: 'milímetros (mm)',
        interpretacao: '1mm = 1 litro por metro quadrado',
        faixasReferencia: 'Leve: 0-2.5mm/h | Moderada: 2.5-10mm/h | Forte: >10mm/h'
      }
    },
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Intensidade Pluviométrica',
        descricao: 'Taxa de precipitação por unidade de tempo',
        formula: 'I = P / t',
        unidade: 'mm/hora (mm/h)',
        interpretacao: 'Indica o ritmo de acumulação de chuva',
        faixasReferencia: 'Fraca: <2mm/h | Moderada: 2-10mm/h | Forte: >10mm/h'
      }
    },
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Acumulado em 24h',
        descricao: 'Total de precipitação em um período de 24 horas',
        formula: 'P₂₄ = Σ Pᵢ (i=1 to 24)',
        unidade: 'milímetros (mm)',
        interpretacao: 'Referência para classificação de eventos',
        faixasReferencia: 'Normal: <50mm | Significativo: 50-100mm | Extremo: >100mm'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b to-white font-poppins flex flex-col">
      <main className="flex-1 p-6 md:p-10 space-y-10 relative">
        <button
          onClick={voltarParaDashboard}
          className="absolute top-6 left-6 text-black hover:text-zinc-600 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md md:hidden bg-white border border-zinc-300"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>

        <header className="space-y-3">
          <h1 className="text-4xl font-extrabold text-zinc-800 tracking-tight">Centro de Conhecimento</h1>
          <p className="text-lg text-zinc-600">Explore recursos educacionais e explicações detalhadas sobre dados meteorológicos</p>
        </header>

        <SecaoEducacao 
          icone={BarChart2} 
          titulo="Dashboard Educativo"
          className="bg-white rounded-xl border border-zinc-300 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {estatisticasDashboard.map((item, index) => (
              <CardEducacao
                key={index}
                tipo={item.tipo}
                dados={item.dados}
              />
            ))}
          </div>
        </SecaoEducacao>

        <SecaoEducacao icone={Calculator} titulo="Conceitos Estatísticos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conceitosEstatisticos.map((item, index) => (
              <CardEducacao
                key={index}
                tipo={item.tipo}
                dados={item.dados}
              />
            ))}
          </div>
        </SecaoEducacao>

        <SecaoEducacao icone={BookOpen} titulo="Guia de Parâmetros Meteorológicos">
          <div className="space-y-6">
            {parametrosMeteorologicos.map((item, index) => (
              <CardEducacao
                key={index}
                tipo={item.tipo}
                dados={item.dados}
              />
            ))}
          </div>
        </SecaoEducacao>
      </main>
    </div>
  );
};

export default ConteudoEducacao;