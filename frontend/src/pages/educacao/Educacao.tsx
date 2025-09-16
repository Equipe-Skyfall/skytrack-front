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
    <div className="min-h-screen bg-white font-poppins flex flex-col">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 space-y-8 relative">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-black hover:text-slate-700 font-bold py-2 px-3 rounded-md flex items-center gap-2 transition-colors duration-200 cursor-pointer md:hidden"
          aria-label="Voltar para o Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Centro de Conhecimento</h1>
          <p className="text-base">Recursos educacionais e explicativos sobre dados meteorológicos</p>
        </header>

        {/* Dashboard Educativo */}
        <section className="bg-white rounded-lg border border-zinc-500 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5" />
            <h2 className="text-2xl font-bold">Dashboard Educativo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-100 rounded-md p-4 text-center space-y-2">
              <p className="text-3xl font-bold">15.2mm</p>
              <h3 className="text-base font-bold">Precipitação Atual</h3>
              <p className="text-sm font-light">Equivale a 15.2 litros por m²</p>
            </div>
            <div className="bg-zinc-100 rounded-md p-4 text-center space-y-2">
              <p className="text-3xl font-bold">8.5mm/h</p>
              <h3 className="text-base font-bold">Intensidade</h3>
              <p className="text-sm font-light">Classificada como moderada</p>
            </div>
            <div className="bg-zinc-100 rounded-md p-4 text-center space-y-2">
              <p className="text-3xl font-bold">78.4mm</p>
              <h3 className="text-base font-bold">Acumulado 24h</h3>
              <p className="text-sm font-light">Evento significativo (&gt;50mm)</p>
            </div>
          </div>
        </section>

        {/* Conceitos Estatísticos */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            <h2 className="text-xl font-bold">Conceitos Estatísticos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <article className="bg-white rounded-md border border-zinc-500 p-4 space-y-4">
              <h3 className="text-xl font-bold">Média Móvel</h3>
              <p className="text-sm font-light">Suaviza variações de curto prazo para identificar tendências</p>
              <div className="bg-zinc-100 rounded-md p-2">
                <p className="text-xs font-light">Fórmula</p>
                <p className="text-xs font-semibold tracking-widest">MA = (x₁ + x₂ + ... + xₙ) / n</p>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <p className="text-sm font-medium">Análise de tendências de precipitação</p>
              </div>
            </article>
            <article className="bg-white rounded-md border border-zinc-500 p-4 space-y-4">
              <h3 className="text-xl font-bold">Desvio Padrão</h3>
              <p className="text-sm font-light">Mede a dispersão dos dados em relação à média</p>
              <div className="bg-zinc-100 rounded-md p-2">
                <p className="text-xs font-light">Fórmula</p>
                <p className="text-xs font-semibold tracking-widest">σ = √[(Σ(x - μ)²) / N]</p>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <p className="text-sm font-medium">Variabilidade das medições</p>
              </div>
            </article>
            <article className="bg-white rounded-md border border-zinc-500 p-4 space-y-4">
              <h3 className="text-xl font-bold">Percentis</h3>
              <p className="text-sm font-light">Indica a posição relativa de um valor no conjunto de dados</p>
              <div className="bg-zinc-100 rounded-md p-2">
                <p className="text-xs font-light">Fórmula</p>
                <p className="text-xs font-semibold tracking-widest">P = (n/N) × 100</p>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <p className="text-sm font-medium">Classificação de eventos extremos</p>
              </div>
            </article>
          </div>
        </section>

        {/* Relatórios Prontos */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="text-xl font-bold">Relatórios Prontos</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-zinc-500 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 rounded-md p-2">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Relatório Diário de Precipitação</h3>
                  <p className="text-sm">Resumo das condições meteorológicas das últimas 24 horas</p>
                  <p className="text-sm">
                    <span className="bg-zinc-100 rounded-xl px-2 py-1 text-xs">Diário</span> PDF • 1.2 MB • Gerado: Hoje, 06:00
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={downloadDailyReport}
                  className="flex-1 md:flex-none bg-black text-white rounded-md py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2"
                  aria-label="Baixar Relatório Diário em PDF"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-zinc-500 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 rounded-md p-2">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Análise Semanal de Tendências</h3>
                  <p className="text-sm">Estatísticas e análises comparativas da semana</p>
                  <p className="text-sm">
                    <span className="bg-zinc-100 rounded-xl px-2 py-1 text-xs">Semanal</span> PDF • 2.8 MB • Gerado: Segunda, 06:00
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={downloadWeeklyReport}
                  className="flex-1 md:flex-none bg-black text-white rounded-md py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2"
                  aria-label="Baixar Análise Semanal em PDF"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-zinc-500 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 rounded-md p-2">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Relatório Mensal Climatológico</h3>
                  <p className="text-sm">Resumo das condições meteorológicas do último mês</p>
                  <p className="text-sm">
                    <span className="bg-zinc-100 rounded-xl px-2 py-1 text-xs">Mensal</span> PDF • 4.5 MB • Gerado: 01/01/2024
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={downloadMonthlyReport}
                  className="flex-1 md:flex-none bg-black text-white rounded-md py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2"
                  aria-label="Baixar Relatório Mensal em PDF"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-zinc-500 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-zinc-100 rounded-md p-2">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Relatório Diário de Precipitação</h3>
                  <p className="text-sm">Análise detalhada com dados históricos e projeções</p>
                  <p className="text-sm">
                    <span className="bg-zinc-100 rounded-xl px-2 py-1 text-xs">Sob demanda</span> PDF • 1.8 MB • Gerado: Hoje, 14:30
                  </p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={downloadOnDemandReport}
                  className="flex-1 md:flex-none bg-black text-white rounded-md py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2"
                  aria-label="Baixar Relatório Sob Demanda em PDF"
                >
                  <Download className="h-4 w-4" />
                  Baixar PDF
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Guia de Parâmetros Meteorológicos */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-xl font-bold">Guia de Parâmetros Meteorológicos</h2>
          </div>
          <div className="space-y-8">
            <article className="bg-white rounded-lg border border-zinc-500 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold">Precipitação (mm)</h3>
                <p className="text-base">Volume de água acumulado por unidade de área</p>
                <p className="text-base font-bold mt-4">Fórmula:</p>
                <div className="bg-zinc-100 rounded p-2">
                  <p className="text-base font-semibold tracking-widest">P = V / A</p>
                </div>
                <p className="text-base font-bold mt-4">Unidade:</p>
                <p className="text-base">milímetros (mm)</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-base font-bold">Interpretação:</p>
                <p className="text-base">1mm = 1 litro por metro quadrado</p>
                <p className="text-base font-bold mt-4">Faixas de Referência:</p>
                <p className="text-base">Leve: 0-2.5mm/h | Moderada: 2.5-10mm/h | Forte: &gt;10mm/h</p>
              </div>
            </article>
            <article className="bg-white rounded-lg border border-zinc-500 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold">Intensidade Pluviométrica</h3>
                <p className="text-base">Taxa de precipitação por unidade de tempo</p>
                <p className="text-base font-bold mt-4">Fórmula:</p>
                <div className="bg-zinc-100 rounded p-2">
                  <p className="text-base font-semibold tracking-widest">I = P / t</p>
                </div>
                <p className="text-base font-bold mt-4">Unidade:</p>
                <p className="text-base">mm/hora (mm/h)</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-base font-bold">Interpretação:</p>
                <p className="text-base">Indica o ritmo de acumulação de chuva</p>
                <p className="text-base font-bold mt-4">Faixas de Referência:</p>
                <p className="text-base">Fraca: &lt;2mm/h | Moderada: 2-10mm/h | Forte: &gt;10mm/h</p>
              </div>
            </article>
            <article className="bg-white rounded-lg border border-zinc-500 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-bold">Acumulado em 24h</h3>
                <p className="text-base">Total de precipitação em um período de 24 horas</p>
                <p className="text-base font-bold mt-4">Fórmula:</p>
                <div className="bg-zinc-100 rounded p-2">
                  <p className="text-base font-semibold tracking-widest">P₂₄ = Σ Pᵢ (i=1 to 24)</p>
                </div>
                <p className="text-base font-bold mt-4">Unidade:</p>
                <p className="text-base">milímetros (mm)</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-base font-bold">Interpretação:</p>
                <p className="text-base">Referência para classificação de eventos</p>
                <p className="text-base font-bold mt-4">Faixas de Referência:</p>
                <p className="text-base">Normal: &lt;50mm | Significativo: 50-100mm | Extremo: &gt;100mm</p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Education;