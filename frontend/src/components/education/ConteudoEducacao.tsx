import React, { useState } from 'react';
import { ArrowLeft, BarChart2, Calculator, BookOpen, AlertTriangle, TrendingUp } from 'lucide-react';
import CardEducacao from './CardEducacao';
import { useTheme } from '../../contexts/ThemeContext';


const ConteudoEducacao: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { isDarkMode } = useTheme();

  const tabs = [
    { id: 'dashboard', label: 'Dados ao Vivo', icon: BarChart2 },
    { id: 'formulas', label: 'Fórmulas', icon: Calculator },
    { id: 'parametros', label: 'Parâmetros', icon: BookOpen },
    { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
    { id: 'estatistica', label: 'Estatística', icon: TrendingUp }
  ];

  const estatisticasDashboard = [
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '25.3°C',
        titulo: 'Temperatura',
        descricao: 'Equivalente a 77.5°F ou 298.5K'
      }
    },
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '68%',
        titulo: 'Umidade Relativa',
        descricao: 'Percentual de saturação de vapor d\'água'
      }
    },
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '1013 hPa',
        titulo: 'Pressão Atmosférica',
        descricao: 'Força exercida pela coluna de ar'
      }
    },
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '12.5 m/s',
        titulo: 'Velocidade do Vento',
        descricao: 'Equivalente a 45 km/h'
      }
    }
  ];

  const conceitosEstatisticos = [
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Conversão de Temperatura',
        descricao: 'As escalas termométricas medem a energia cinética das partículas, sendo fundamentais para comparação internacional de dados.',
        formula: 'Celsius → Fahrenheit: (°C × 9/5) + 32\nCelsius → Kelvin: °C + 273.15',
        aplicacao: 'Exemplo: 25°C = (25×9/5)+32 = 77°F = 298.15K'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Umidade Relativa do Ar',
        descricao: 'Razão entre a pressão parcial de vapor d\'água e a pressão de saturação do vapor d\'água na mesma temperatura.',
        formula: 'UR = (Pv / Pvs) × 100\nonde Pv = pressão parcial do vapor, Pvs = pressão de saturação',
        aplicacao: 'UR alta (>80%) indica proximidade de precipitação. UR baixa (<30%) indica ar seco.'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Ponto de Orvalho',
        descricao: 'Temperatura na qual o ar atinge saturação de vapor d\'água, causando condensação.',
        formula: 'Td = T - ((100 - UR) / 5)\nonde Td = ponto de orvalho, T = temperatura, UR = umidade relativa',
        aplicacao: 'Quando temperatura = ponto de orvalho, ocorre formação de névoa ou orvalho.'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Pressão Atmosférica',
        descricao: 'Força exercida pelo peso da coluna de ar sobre uma unidade de área. Varia com altitude e temperatura.',
        formula: 'P = P₀ × e^(-Mgh/RT)\n1 atm = 1013.25 hPa = 760 mmHg',
        aplicacao: 'A pressão diminui aproximadamente 1 hPa a cada 8 metros de altitude.'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Velocidade do Vento',
        descricao: 'Medida do deslocamento horizontal do ar, expressa em diferentes unidades conforme aplicação.',
        formula: 'm/s × 3.6 = km/h\nm/s × 1.944 = nós (navegação)\nm/s × 2.237 = mph',
        aplicacao: '10 m/s = 36 km/h = 19.44 nós = 22.37 mph'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: 'Sensação Térmica',
        descricao: 'Temperatura percebida pelo corpo humano considerando temperatura do ar, umidade e velocidade do vento.',
        formula: 'ST = 13.12 + 0.6215T - 11.37v^0.16 + 0.3965Tv^0.16\nonde T = temperatura, v = velocidade do vento',
        aplicacao: 'Temperatura de 30°C com umidade de 80% resulta em sensação térmica próxima a 37°C.'
      }
    }
  ];

  const parametrosMeteorologicos = [
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Temperatura (°C)',
        descricao: 'Medida da energia cinética média das partículas',
        formula: '°C = K - 273.15 | °C = (°F - 32) × 5/9',
        unidade: 'Celsius (°C), Fahrenheit (°F), Kelvin (K)',
        interpretacao: 'Parâmetro fundamental para todos os processos atmosféricos',
        faixasReferencia: 'Frio extremo: <0°C | Normal: 15-30°C | Calor extremo: >40°C'
      }
    },
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Umidade Relativa (%)',
        descricao: 'Percentual de vapor de água em relação à saturação',
        formula: 'UR = (Pv / Pvs) × 100',
        unidade: 'Percentual (%)',
        interpretacao: 'Influencia conforto térmico e formação de precipitação',
        faixasReferencia: 'Seco: <30% | Confortável: 40-60% | Úmido: >80%'
      }
    },
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Pressão Atmosférica (hPa)',
        descricao: 'Força exercida pela coluna de ar sobre uma área',
        formula: 'P = P₀ × e^(-Mgh/RT) (variação com altitude)',
        unidade: 'hectoPascal (hPa), mmHg, atm',
        interpretacao: 'Indica sistemas de alta e baixa pressão',
        faixasReferencia: 'Baixa: <1010hPa | Normal: 1010-1020hPa | Alta: >1020hPa'
      }
    },
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Velocidade do Vento (m/s)',
        descricao: 'Movimento do ar na horizontal',
        formula: 'v = Δs / Δt (velocidade = distância / tempo)',
        unidade: 'metros por segundo (m/s), km/h, nós',
        interpretacao: 'Afeta sensação térmica e transporte de umidade',
        faixasReferencia: 'Calmo: <2m/s | Brisa: 2-8m/s | Vento forte: >15m/s'
      }
    },
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Precipitação (mm)',
        descricao: 'Volume de água acumulado por unidade de área',
        formula: 'P = V / A (volume por área)',
        unidade: 'milímetros (mm)',
        interpretacao: '1mm = 1 litro por metro quadrado',
        faixasReferencia: 'Leve: <2.5mm/h | Moderada: 2.5-10mm/h | Forte: >10mm/h'
      }
    },
    {
      tipo: 'parametro' as const,
      dados: {
        titulo: 'Radiação Solar (W/m²)',
        descricao: 'Energia eletromagnética do sol por unidade de área',
        formula: 'I = I₀ × cos(θ) × τ^m',
        unidade: 'Watts por metro quadrado (W/m²)',
        interpretacao: 'Motor dos processos atmosféricos e fotossíntese',
        faixasReferencia: 'Baixa: <200W/m² | Moderada: 200-600W/m² | Alta: >800W/m²'
      }
    }
  ];

  return (
    <div className="min-h-screen font-poppins">
      <main className="flex-1 space-y-8 relative">
        <button
          onClick={() => window.history.back()}
          className={`absolute top-6 left-6 font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200 cursor-pointer md:hidden border ${
            isDarkMode 
              ? 'text-white hover:text-gray-300 bg-slate-800 border-slate-700' 
              : 'text-slate-900 hover:text-slate-700 bg-white border-gray-300'
          }`}
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>

        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <BookOpen className={`h-8 w-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
            <h1 className={`text-3xl font-bold font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
              Centro Educacional
            </h1>
          </div>
          <p className={`text-base font-poppins max-w-3xl ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
            Aprenda sobre meteorologia e compreenda os fundamentos científicos por trás das medições e alertas meteorológicos.
          </p>
        </header>

        {/* Navegação por Tabs */}
        <div className={`rounded-lg shadow-md overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
          {/* Tab Headers */}
          <div className={`flex flex-wrap border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? isDarkMode 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-900 text-white'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-slate-700'
                      : 'text-zinc-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Dados em Tempo Real</h2>
                  <p className={`text-base font-poppins ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>Visualize dados meteorológicos ao vivo e compreenda seu significado.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {estatisticasDashboard.map((item, index) => (
                    <CardEducacao
                      key={index}
                      tipo={item.tipo}
                      dados={item.dados}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'formulas' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Fórmulas Meteorológicas</h2>
                  <p className={`text-base font-poppins ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>Compreenda os cálculos científicos por trás dos dados meteorológicos.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {conceitosEstatisticos.map((item, index) => (
                    <CardEducacao
                      key={index}
                      tipo={item.tipo}
                      dados={item.dados}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'parametros' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Parâmetros Monitorados</h2>
                  <p className={`text-base font-poppins ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>Guia completo sobre cada parâmetro monitorado pelas estações meteorológicas.</p>
                </div>
                <div className="space-y-8">
                  {parametrosMeteorologicos.map((item, index) => (
                    <CardEducacao
                      key={index}
                      tipo={item.tipo}
                      dados={item.dados}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'alertas' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Sistema de Alertas</h2>
                  <p className={`text-base font-poppins ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>Compreenda os critérios e limiares utilizados para emissão de alertas meteorológicos.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Alertas de Temperatura',
                      descricao: 'Critérios para identificação de temperaturas extremas que representam riscos à saúde e agricultura.',
                      formula: 'Temperatura < 0°C → Risco de geada\nTemperatura > 35°C → Alerta de calor intenso\nTemperatura > 40°C → Emergência térmica',
                      aplicacao: 'Temperaturas extremas afetam saúde humana, agricultura e infraestrutura urbana.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Alertas de Vento',
                      descricao: 'Limiares de velocidade do vento que indicam condições perigosas.',
                      formula: 'Velocidade > 15 m/s (54 km/h) → Ventania\nVelocidade > 25 m/s (90 km/h) → Vendaval\nVelocidade > 33 m/s (120 km/h) → Furacão',
                      aplicacao: 'Ventos fortes podem causar danos estruturais, queda de árvores e interrupção de serviços.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Alertas de Precipitação',
                      descricao: 'Volumes de chuva que indicam risco de alagamentos e deslizamentos.',
                      formula: 'Precipitação > 50mm/24h → Chuva forte\nPrecipitação > 100mm/24h → Risco elevado\nPrecipitação > 20mm/h → Temporal',
                      aplicacao: 'Chuvas intensas podem causar inundações, alagamentos e deslizamentos de terra.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Sensação Térmica Extrema',
                      descricao: 'Índice que combina temperatura, umidade e vento para avaliar desconforto térmico.',
                      formula: 'ST = f(T, UR, v)\nonde T=temperatura, UR=umidade relativa, v=velocidade do vento',
                      aplicacao: 'Sensação térmica extrema requer cuidados adicionais para evitar insolação ou hipotermia.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            )}

            {activeTab === 'estatistica' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="mb-6">
                  <h2 className={`text-2xl font-bold font-poppins mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>Análise Estatística</h2>
                  <p className={`text-base font-poppins ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>Métodos estatísticos aplicados à análise de séries temporais meteorológicas.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Média Aritmética',
                      descricao: 'Medida de tendência central que representa o valor médio de um conjunto de observações.',
                      formula: 'μ = Σ(xi) / n\nonde xi = observações, n = número de observações',
                      aplicacao: 'Temperatura média mensal é calculada pela soma das temperaturas diárias dividida pelo número de dias.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Amplitude Térmica',
                      descricao: 'Diferença entre a temperatura máxima e mínima em um período determinado.',
                      formula: 'A = Tmax - Tmin\nonde Tmax = temperatura máxima, Tmin = temperatura mínima',
                      aplicacao: 'Amplitude térmica diária elevada é característica de regiões continentais e desérticas.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Análise de Tendência',
                      descricao: 'Identificação de padrões de aumento ou diminuição ao longo do tempo.',
                      formula: 'y = a + bx\nonde y = variável dependente, x = tempo, a = intercepto, b = coeficiente angular',
                      aplicacao: 'Análise de tendência identifica mudanças climáticas de longo prazo.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Coeficiente de Correlação',
                      descricao: 'Medida da força e direção da relação linear entre duas variáveis.',
                      formula: 'r = Σ((xi-x̄)(yi-ȳ)) / √(Σ(xi-x̄)²Σ(yi-ȳ)²)\nonde r ∈ [-1, 1]',
                      aplicacao: 'Correlação negativa entre temperatura e umidade relativa é comum em climas secos.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Percentil',
                      descricao: 'Valor abaixo do qual uma determinada porcentagem de observações se encontra.',
                      formula: 'Pk = valor tal que k% das observações ≤ Pk',
                      aplicacao: 'Percentil 90 de temperatura indica que 90% dos dias apresentam temperatura inferior.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: 'Desvio Padrão',
                      descricao: 'Medida de dispersão que indica a variabilidade dos dados em relação à média.',
                      formula: 'σ = √(Σ(xi-μ)² / n)\nonde μ = média, xi = observações',
                      aplicacao: 'Desvio padrão elevado indica alta variabilidade meteorológica.'
                    }}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConteudoEducacao;