import React, { useState } from 'react';
import { ArrowLeft, BarChart2, Calculator, BookOpen, AlertTriangle, TrendingUp } from 'lucide-react';
import CardEducacao from './CardEducacao';


const ConteudoEducacao: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: '📊 Dados Vivos', icon: BarChart2 },
    { id: 'formulas', label: '🧮 Fórmulas', icon: Calculator },
    { id: 'parametros', label: '📖 Parâmetros', icon: BookOpen },
    { id: 'alertas', label: '⚠️ Alertas', icon: AlertTriangle },
    { id: 'estatistica', label: '📈 Estatística', icon: TrendingUp }
  ];

  const estatisticasDashboard = [
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '🌡️ 25.3°C',
        titulo: 'Temperatura',
        descricao: '= 77.5°F = 298.5K 🔄'
      }
    },
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '💧 68%',
        titulo: 'Umidade do Ar',
        descricao: 'Como uma esponja 68% cheia! 🧽'
      }
    },
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '📊 1013 hPa',
        titulo: 'Pressão do Ar',
        descricao: 'Peso de toda a atmosfera! ⚖️'
      }
    },
    {
      tipo: 'estatistica' as const,
      dados: {
        valor: '💨 12.5 m/s',
        titulo: 'Vento',
        descricao: 'Brisa forte = 45 km/h 🍃'
      }
    }
  ];

  const conceitosEstatisticos = [
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: '🌡️ Temperatura: Como Converter?',
        descricao: 'Imagina que a temperatura é como trocar de roupa entre países!',
        formula: '🇧🇷 Celsius → 🇺🇸 Fahrenheit: (°C × 9 ÷ 5) + 32\n🔬 Absoluto: °C + 273 = Kelvin',
        aplicacao: '💡 Exemplo: 25°C = (25×9÷5)+32 = 77°F!'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: '💧 Umidade: O Ar Tem Sede!',
        descricao: 'É como uma esponja: quanto % de água ela pode segurar?',
        formula: '🧽 Umidade = (Vapor Atual ÷ Vapor Máximo) × 100',
        aplicacao: '🌧️ 80% = quase chuva! | 30% = ar seco!'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: '🌫️ Ponto de Orvalho',
        descricao: 'Quando o ar fica "cheio" e não aguenta mais vapor!',
        formula: '🔍 Fórmula Simples: Temperatura - ((100 - Umidade%) ÷ 5)',
        aplicacao: '✨ Quando T°= Ponto Orvalho → Névoa aparece!'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: '📊 Pressão: O Peso do Ar',
        descricao: 'Imagina toda a atmosfera "pesando" em você!',
        formula: '⚖️ 1 atm = 1013 hPa = 760 mmHg',
        aplicacao: '🏔️ Subiu na montanha? Pressão diminui!'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: '💨 Vento: Velocidade do Ar',
        descricao: 'Como converter a "correria" do vento?',
        formula: '🚗 m/s × 3.6 = km/h | ⛵ m/s × 1.944 = nós',
        aplicacao: '🍃 10 m/s = 36 km/h = vento moderado'
      }
    },
    {
      tipo: 'conceito' as const,
      dados: {
        titulo: '🔥 Sensação Térmica',
        descricao: 'O que seu corpo "sente" (não só o termômetro!)',
        formula: '🌡️+💧 = Calor + Umidade = Sensação Real',
        aplicacao: '😅 30°C + 80% umidade = Sentir 37°C!'
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
    <div className="min-h-screen bg-gradient-to-b to-white font-poppins flex flex-col">
      <main className="flex-1 p-6 md:p-10 space-y-10 relative">
        <button
          onClick={() => window.history.back()}
          className="absolute top-6 left-6 text-black hover:text-zinc-600 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md md:hidden bg-white border border-zinc-300"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </button>

        <header className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🌤️</span>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent tracking-tight">
              Meteorologia Fácil
            </h1>
            <span className="text-4xl">📚</span>
          </div>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Aprenda sobre o clima de forma <span className="font-semibold text-blue-600">divertida</span> e <span className="font-semibold text-green-600">visual</span>! 
            Descubra as fórmulas por trás dos dados meteorológicos.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-500 pt-2">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <span>Conceitos Básicos</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span>Fórmulas Práticas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
              <span>Exemplos Reais</span>
            </div>
          </div>
        </header>

        {/* Navegação por Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex flex-wrap bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 px-4 py-4 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 border-b-4 border-blue-500 shadow-lg'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-white/50'
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
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">📊 Dados ao Vivo - Aprenda Vendo!</h2>
                  <p className="text-lg text-blue-700 font-semibold">👀 Veja os dados reais e entenda o que eles significam!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {estatisticasDashboard.map((item, index) => (
                    <CardEducacao
                      key={index}
                      tipo={item.tipo}
                      dados={item.dados}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'formulas' && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-purple-600 mb-2">🧮 Fórmulas Descomplicadas - Passo a Passo!</h2>
                  <p className="text-lg text-purple-700 font-semibold">✨ Matemática meteorológica sem complicação!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {conceitosEstatisticos.map((item, index) => (
                    <CardEducacao
                      key={index}
                      tipo={item.tipo}
                      dados={item.dados}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'parametros' && (
              <div className="space-y-6">
                <div className="text-center mb-6 bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <h2 className="text-2xl font-bold text-green-600 mb-2">📖 Guia Completo - Tudo Sobre Clima!</h2>
                  <p className="text-lg text-green-700 font-semibold">🌤️ Entenda cada aspecto do tempo que você vê todos os dias!</p>
                </div>
                <div className="space-y-8">
                  {parametrosMeteorologicos.map((item, index) => (
                    <CardEducacao
                      key={index}
                      tipo={item.tipo}
                      dados={item.dados}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'alertas' && (
              <div className="space-y-6">
                <div className="text-center mb-6 bg-red-50 rounded-xl p-4 border-2 border-red-200">
                  <h2 className="text-2xl font-bold text-red-600 mb-2">⚠️ Alertas Meteorológicos - Quando se Preocupar?</h2>
                  <p className="text-lg text-red-700 font-semibold">🚨 Aprenda a identificar quando o tempo pode ser perigoso!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '🌡️ Temperatura Perigosa',
                      descricao: 'Quando o termômetro vira seu inimigo!',
                      formula: '🥶 Menos de 0°C → Geada (plantas morrem!)\n🔥 Mais de 35°C → Perigo para saúde\n☄️ Mais de 40°C → EMERGÊNCIA!',
                      aplicacao: '🏥 Hospitais ficam cheios no calor extremo!'
                    }}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '💨 Vento Destruidor',
                      descricao: 'Quando o vento deixa de ser brisa!',
                      formula: '🍃 15 m/s (54 km/h) → Ventania (galhos quebram)\n🌪️ 25 m/s (90 km/h) → Vendaval (árvores caem!)\n🏚️ 33 m/s (120 km/h) → Furacão!',
                      aplicacao: '🏠 Melhor ficar em casa quando ventar muito!'
                    }}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '🌧️ Chuva Perigosa',
                      descricao: 'Quando a chuva vira enchente!',
                      formula: '💧 50mm em 24h → Chuva forte (ruas alagam)\n🌊 100mm em 24h → PERIGO (rios transbordam!)\n⚡ 20mm em 1h → Temporal!',
                      aplicacao: '🚗 Não dirija em enchente - carro boia!'
                    }}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '🤒 Sensação Térmica',
                      descricao: 'Quando seu corpo "mente" sobre a temperatura!',
                      formula: '🌡️+💧 = Calor Real + Umidade = Como Você Sente\n❄️+💨 = Frio + Vento = Sensação de Congelamento',
                      aplicacao: '😵 30°C + muita umidade = sentir 40°C!'
                    }}
                  />
                </div>
              </div>
            )}

            {activeTab === 'estatistica' && (
              <div className="space-y-6">
                <div className="text-center mb-6 bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <h2 className="text-2xl font-bold text-purple-600 mb-2">📈 Estatística Meteorológica - Descobrindo Padrões!</h2>
                  <p className="text-lg text-purple-700 font-semibold">🔍 Como os meteorologistas encontram padrões no caos do tempo!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '📊 Média: O "Normal"',
                      descricao: 'Soma tudo e divide! Tipo nota da turma.',
                      formula: '📝 (Temp1 + Temp2 + Temp3...) ÷ Quantidade de Dias',
                      aplicacao: '🏖️ "Verão tem 28°C em média" = isso!'
                    }}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '📏 Amplitude: A Diferença',
                      descricao: 'Quanto varia do mais frio ao mais quente?',
                      formula: '🌡️ Temperatura Máxima - Temperatura Mínima = Amplitude',
                      aplicacao: '🏔️ Montanha: 30°C dia, 5°C noite = 25°C amplitude!'
                    }}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '📈 Tendência: Subindo ou Descendo?',
                      descricao: 'O clima está mudando ao longo dos anos?',
                      formula: '📅 Comparar anos: 2020 vs 2021 vs 2022... = Tendência',
                      aplicacao: '🌍 Aquecimento global = tendência de aumento!'
                    }}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '🔗 Correlação: Eles Andam Juntos?',
                      descricao: 'Quando uma coisa sobe, a outra também?',
                      formula: '🤝 Se Temperatura ↑ então Umidade ↓ = Correlação!',
                      aplicacao: '☀️ Dia quente = ar seco (correlação negativa)'
                    }}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '🎯 Percentil: Sua Posição',
                      descricao: 'De 100 dias, quantos foram mais frios que hoje?',
                      formula: '📊 (Dias mais frios que hoje ÷ Total de dias) × 100',
                      aplicacao: '❄️ "Hoje está no percentil 10" = 90% dos dias são mais quentes!'
                    }}
                  />
                  <CardEducacao
                    tipo="conceito"
                    dados={{
                      titulo: '📐 Desvio: Quão "Louco"?',
                      descricao: 'Quanto os dados variam da média?',
                      formula: '🎢 Quanto cada dia "foge" da temperatura média',
                      aplicacao: '🌦️ Desvio alto = tempo maluco e imprevisível!'
                    }}
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