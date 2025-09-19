import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  BarChart2,
  FileText,
  CloudRain,
  Calculator,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const Education: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  // Função para gerar e baixar o Relatório Diário
  const downloadDailyReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Relatório Diário de Precipitação', 20, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    doc.text('Resumo das condições meteorológicas das últimas 24 horas:', 20, 40);
    doc.text('- Precipitação Atual: 15.2 mm (equivalente a 15.2 litros/m²)', 20, 50);
    doc.text('- Intensidade: 8.5 mm/h (classificada como moderada)', 20, 60);
    doc.text('- Acumulado 24h: 78.4 mm (evento significativo)', 20, 70);
    doc.text('Impacto: Possível risco de alagamentos em áreas urbanas.', 20, 80);
    doc.save('Relatorio_Diario_Precipitacao.pdf');
  };

  // Função para gerar e baixar a Análise Semanal
  const downloadWeeklyReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Análise Semanal de Tendências', 20, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    doc.text('Estatísticas e análises comparativas da semana:', 20, 40);
    doc.text('- Média de precipitação: 10.5 mm/dia', 20, 50);
    doc.text('- Pico de precipitação: 78.4 mm em 24h', 20, 60);
    doc.text('- Tendência: Aumento de eventos de chuva intensa.', 20, 70);
    doc.text('Risco: Monitoramento de deslizamentos em áreas de encosta.', 20, 80);
    doc.save('Analise_Semanal_Tendencias.pdf');
  };

  // Função para gerar e baixar o Relatório Mensal
  const downloadMonthlyReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Relatório Mensal Climatológico', 20, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    doc.text('Resumo das condições meteorológicas do último mês:', 20, 40);
    doc.text('- Precipitação total: 250 mm', 20, 50);
    doc.text('- Média diária: 8.3 mm', 20, 60);
    doc.text('- Eventos extremos: 2 eventos com >100 mm em 24h', 20, 70);
    doc.text('Impacto: Atenção a inundações em áreas ribeirinhas.', 20, 80);
    doc.save('Relatorio_Mensal_Climatologico.pdf');
  };

  // Função para gerar e baixar o Relatório Sob Demanda
  const downloadOnDemandReport = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Relatório Diário de Precipitação (Sob Demanda)', 20, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 30);
    doc.text('Análise detalhada com dados históricos e projeções:', 20, 40);
    doc.text('- Precipitação acumulada: 78.4 mm em 24h', 20, 50);
    doc.text('- Projeção para 48h: Risco de chuva forte (50-80 mm)', 20, 60);
    doc.text('- Histórico: Comparação com eventos similares em 2024', 20, 70);
    doc.text('Recomendação: Preparar defesas contra inundações.', 20, 80);
    doc.save('Relatorio_Sob_Demanda_Precipitacao.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b to-white font-poppins flex flex-col">
      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 space-y-10 relative">
        <button
          onClick={handleBack}
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

        {/* Dashboard Educativo */}
        <section className="bg-white rounded-xl border border-zinc-300 p-6 space-y-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <BarChart2 className="h-6 w-6 text-zinc-700" />
            <h2 className="text-2xl font-bold text-zinc-800">Dashboard Educativo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-100 rounded-lg p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-4xl font-extrabold text-zinc-800">15.2mm</p>
              <h3 className="text-lg font-semibold text-zinc-700">Precipitação Atual</h3>
              <p className="text-sm text-zinc-500">Equivale a 15.2 litros por m²</p>
            </div>
            <div className="bg-zinc-100 rounded-lg p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-4xl font-extrabold text-zinc-800">8.5mm/h</p>
              <h3 className="text-lg font-semibold text-zinc-700">Intensidade</h3>
              <p className="text-sm text-zinc-500">Classificada como moderada</p>
            </div>
            <div className="bg-zinc-100 rounded-lg p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <p className="text-4xl font-extrabold text-zinc-800">78.4mm</p>
              <h3 className="text-lg font-semibold text-zinc-700">Acumulado 24h</h3>
              <p className="text-sm text-zinc-500">Evento significativo (&gt;50mm)</p>
            </div>
          </div>
        </section>

        {/* Conceitos Estatísticos */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6 text-zinc-700" />
            <h2 className="text-2xl font-bold text-zinc-800">Conceitos Estatísticos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-zinc-800">Média Móvel</h3>
              <p className="text-sm text-zinc-600">Suaviza variações de curto prazo para identificar tendências</p>
              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                <p className="text-xs text-zinc-500">Fórmula</p>
                <p className="text-sm font-semibold text-zinc-700 tracking-wider">MA = (x₁ + x₂ + ... + xₙ) / n</p>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <p className="text-sm font-medium text-zinc-600">Análise de tendências de precipitação</p>
              </div>
            </article>
            <article className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-zinc-800">Desvio Padrão</h3>
              <p className="text-sm text-zinc-600">Mede a dispersão dos dados em relação à média</p>
              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                <p className="text-xs text-zinc-500">Fórmula</p>
                <p className="text-sm font-semibold text-zinc-700 tracking-wider">σ = √[(Σ(x - μ)²) / N]</p>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <p className="text-sm font-medium text-zinc-600">Variabilidade das medições</p>
              </div>
            </article>
            <article className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-zinc-800">Percentis</h3>
              <p className="text-sm text-zinc-600">Indica a posição relativa de um valor no conjunto de dados</p>
              <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                <p className="text-xs text-zinc-500">Fórmula</p>
                <p className="text-sm font-semibold text-zinc-700 tracking-wider">P = (n/N) × 100</p>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <p className="text-sm font-medium text-zinc-600">Classificação de eventos extremos</p>
              </div>
            </article>
          </div>
        </section>

        {/*
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-zinc-700" />
            <h2 className="text-2xl font-bold text-zinc-800">Relatórios Prontos</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-zinc-300 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Relatório Diário de Precipitação</h3>
                  <p className="text-sm text-zinc-600">Resumo das condições meteorológicas das últimas 24 horas</p>
                  <p className="text-sm text-zinc-500">
                    <span className="bg-zinc-100 rounded-full px-3 py-1 text-xs font-medium">Diário</span> PDF • 1.2 MB • Gerado: Hoje, 06:00
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={downloadDailyReport}
                  className="flex-1 md:flex-none bg-black text-white rounded-lg py-2 px-5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors duration-300 shadow-sm"
                  aria-label="Baixar Relatório Diário em PDF"
                >
                  <Download className="h-5 w-5" />
                  Baixar PDF
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-zinc-300 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Análise Semanal de Tendências</h3>
                  <p className="text-sm text-zinc-600">Estatísticas e análises comparativas da semana</p>
                  <p className="text-sm text-zinc-500">
                    <span className="bg-zinc-100 rounded-full px-3 py-1 text-xs font-medium">Semanal</span> PDF • 2.8 MB • Gerado: Segunda, 06:00
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={downloadWeeklyReport}
                  className="flex-1 md:flex-none bg-black text-white rounded-lg py-2 px-5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors duration-300 shadow-sm"
                  aria-label="Baixar Análise Semanal em PDF"
                >
                  <Download className="h-5 w-5" />
                  Baixar PDF
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-zinc-300 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Relatório Mensal Climatológico</h3>
                  <p className="text-sm text-zinc-600">Resumo das condições meteorológicas do último mês</p>
                  <p className="text-sm text-zinc-500">
                    <span className="bg-zinc-100 rounded-full px-3 py-1 text-xs font-medium">Mensal</span> PDF • 4.5 MB • Gerado: 01/01/2024
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={downloadMonthlyReport}
                  className="flex-1 md:flex-none bg-black text-white rounded-lg py-2 px-5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors duration-300 shadow-sm"
                  aria-label="Baixar Relatório Mensal em PDF"
                >
                  <Download className="h-5 w-5" />
                  Baixar PDF
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-zinc-300 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 rounded-lg p-3">
                  <FileText className="h-6 w-6 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-800">Relatório Diário de Precipitação</h3>
                  <p className="text-sm text-zinc-600">Análise detalhada com dados históricos e projeções</p>
                  <p className="text-sm text-zinc-500">
                    <span className="bg-zinc-100 rounded-full px-3 py-1 text-xs font-medium">Sob demanda</span> PDF • 1.8 MB • Gerado: Hoje, 14:30
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={downloadOnDemandReport}
                  className="flex-1 md:flex-none bg-black text-white rounded-lg py-2 px-5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors duration-300 shadow-sm"
                  aria-label="Baixar Relatório Sob Demanda em PDF"
                >
                  <Download className="h-5 w-5" />
                  Baixar PDF
                </button>
              </div>
            </div>
          </div>
        </section>
        */}

        {/* Guia de Parâmetros Meteorológicos */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-zinc-700" />
            <h2 className="text-2xl font-bold text-zinc-800">Guia de Parâmetros Meteorológicos</h2>
          </div>
          <div className="space-y-6">
            <article className="bg-white rounded-xl border border-zinc-300 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div>
                <h3 className="text-lg font-bold text-zinc-800">Precipitação (mm)</h3>
                <p className="text-base text-zinc-600">Volume de água acumulado por unidade de área</p>
                <p className="text-base font-bold text-zinc-700 mt-4">Fórmula:</p>
                <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                  <p className="text-base font-semibold text-zinc-700 tracking-wider">P = V / A</p>
                </div>
                <p className="text-base font-bold text-zinc-700 mt-4">Unidade:</p>
                <p className="text-base text-zinc-600">milímetros (mm)</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-base font-bold text-zinc-700">Interpretação:</p>
                <p className="text-base text-zinc-600">1mm = 1 litro por metro quadrado</p>
                <p className="text-base font-bold text-zinc-700 mt-4">Faixas de Referência:</p>
                <p className="text-base text-zinc-600">Leve: 0-2.5mm/h | Moderada: 2.5-10mm/h | Forte: &gt;10mm/h</p>
              </div>
            </article>
            <article className="bg-white rounded-xl border border-zinc-300 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div>
                <h3 className="text-lg font-bold text-zinc-800">Intensidade Pluviométrica</h3>
                <p className="text-base text-zinc-600">Taxa de precipitação por unidade de tempo</p>
                <p className="text-base font-bold text-zinc-700 mt-4">Fórmula:</p>
                <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                  <p className="text-base font-semibold text-zinc-700 tracking-wider">I = P / t</p>
                </div>
                <p className="text-base font-bold text-zinc-700 mt-4">Unidade:</p>
                <p className="text-base text-zinc-600">mm/hora (mm/h)</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-base font-bold text-zinc-700">Interpretação:</p>
                <p className="text-base text-zinc-600">Indica o ritmo de acumulação de chuva</p>
                <p className="text-base font-bold text-zinc-700 mt-4">Faixas de Referência:</p>
                <p className="text-base text-zinc-600">Fraca: &lt;2mm/h | Moderada: 2-10mm/h | Forte: &gt;10mm/h</p>
              </div>
            </article>
            <article className="bg-white rounded-xl border border-zinc-300 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div>
                <h3 className="text-lg font-bold text-zinc-800">Acumulado em 24h</h3>
                <p className="text-base text-zinc-600">Total de precipitação em um período de 24 horas</p>
                <p className="text-base font-bold text-zinc-700 mt-4">Fórmula:</p>
                <div className="bg-zinc-50 rounded-lg p-3 border border-zinc-200">
                  <p className="text-base font-semibold text-zinc-700 tracking-wider">P₂₄ = Σ Pᵢ (i=1 to 24)</p>
                </div>
                <p className="text-base font-bold text-zinc-700 mt-4">Unidade:</p>
                <p className="text-base text-zinc-600">milímetros (mm)</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-base font-bold text-zinc-700">Interpretação:</p>
                <p className="text-base text-zinc-600">Referência para classificação de eventos</p>
                <p className="text-base font-bold text-zinc-700 mt-4">Faixas de Referência:</p>
                <p className="text-base text-zinc-600">Normal: &lt;50mm | Significativo: 50-100mm | Extremo: &gt;100mm</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Education;