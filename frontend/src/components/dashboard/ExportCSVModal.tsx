// components/dashboard/ExportCSVModal.tsx
import React, { useState } from 'react';
import { X, Download, FileText, CheckSquare, Square, FileSpreadsheet, BarChart3, Building2, MapPin, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-toastify';
import { useStations } from '../../hooks/stations/useStations';
import { getAlerts } from '../../services/api/alerts';
import { getSensorReadings } from '../../services/api/sensorReadings';

interface ExportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportCSVModal: React.FC<ExportCSVModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const { stations } = useStations();
  
  // Estados dos filtros
  const [selectedStations, setSelectedStations] = useState<string[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<string[]>(['temperatura', 'umidade', 'chuva', 'pressure']);
  const [includeAlerts, setIncludeAlerts] = useState(true);
  const [includeStationInfo, setIncludeStationInfo] = useState(true);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [exporting, setExporting] = useState(false);

  // Parâmetros disponíveis
  const availableParameters = [
    { id: 'temperatura', label: 'Temperatura (°C)', color: 'text-red-500' },
    { id: 'umidade', label: 'Umidade (%)', color: 'text-blue-500' },
    { id: 'chuva', label: 'Chuva (mm)', color: 'text-cyan-500' },
    { id: 'pressure', label: 'Pressão (hPa)', color: 'text-purple-500' }
  ];

  // Selecionar/Desselecionar todas as estações
  const toggleAllStations = () => {
    if (selectedStations.length === stations.length) {
      setSelectedStations([]);
    } else {
      setSelectedStations(stations.map(s => s.id));
    }
  };

  // Selecionar/Desselecionar estação individual
  const toggleStation = (stationId: string) => {
    if (selectedStations.includes(stationId)) {
      setSelectedStations(selectedStations.filter(id => id !== stationId));
    } else {
      setSelectedStations([...selectedStations, stationId]);
    }
  };

  // Selecionar/Desselecionar parâmetro
  const toggleParameter = (parameterId: string) => {
    if (selectedParameters.includes(parameterId)) {
      setSelectedParameters(selectedParameters.filter(id => id !== parameterId));
    } else {
      setSelectedParameters([...selectedParameters, parameterId]);
    }
  };

  // Função para exportar CSV
  // Função para exportar em PDF
  const exportPDF = async (allAlerts: any[]) => {
    // Importar dynamicamente para garantir que autoTable seja estendido
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE DADOS - SKYTRACK', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data de Geração: ${new Date().toLocaleString('pt-BR')}`, 14, yPos);
    yPos += 6;
    doc.text(`Estações Selecionadas: ${selectedStations.length}`, 14, yPos);
    yPos += 6;
    doc.text(`Parâmetros: ${selectedParameters.join(', ')}`, 14, yPos);
    
    if (includeAlerts && allAlerts.length > 0) {
      yPos += 6;
      doc.text(`Alertas Ativos no Sistema: ${allAlerts.length}`, 14, yPos);
    }

    yPos += 10;

    // ========== INFORMAÇÕES DAS ESTAÇÕES ==========
    if (includeStationInfo) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMAÇÕES DAS ESTAÇÕES', 14, yPos);
      yPos += 5;

      const stationTableData = selectedStations.map(stationId => {
        const station = stations.find(s => s.id === stationId);
        return [
          station?.name || 'N/A',
          station?.status === 'ACTIVE' ? 'Ativa' : 'Inativa',
          station?.address || 'N/A',
          station?.macAddress || 'N/A',
          station?.latitude?.toFixed(6) || 'N/A',
          station?.longitude?.toFixed(6) || 'N/A'
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Nome', 'Status', 'Endereço', 'MAC', 'Latitude', 'Longitude']],
        body: stationTableData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        styles: { cellPadding: 2 },
        margin: { left: 14, right: 14 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }

    // ========== LEITURAS DOS SENSORES ==========
    for (const stationId of selectedStations) {
      const station = stations.find(s => s.id === stationId);
      
      // Adicionar nova página se necessário
      if (yPos > 170) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`LEITURAS - ${station?.name || 'Estação'}`, 14, yPos);
      yPos += 5;

      try {
        const response = await getSensorReadings({ stationId, limit: 100 });
        const readings = response?.data || [];

        console.log(`📊 Leituras da estação ${station?.name}:`, readings.length);
        if (readings.length > 0) {
          console.log('🔍 Primeira leitura completa:', JSON.stringify(readings[0], null, 2));
          console.log('🔑 Chaves disponíveis:', Object.keys(readings[0]));
        }

        if (readings.length === 0) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.text('Nenhuma leitura disponível', 14, yPos);
          yPos += 10;
          continue;
        }

        const readingsTableData = readings.map((reading: any) => {
          const row: any[] = [
            new Date(reading.createdAt).toLocaleString('pt-BR')
          ];

          // Os dados estão dentro de reading.valor
          const valores = reading.valor || {};
          
          if (selectedParameters.includes('temperatura')) {
            row.push(valores.temperatura ? valores.temperatura.toFixed(1) : '-');
          }
          if (selectedParameters.includes('umidade')) {
            row.push(valores.umidade ? valores.umidade.toFixed(1) : '-');
          }
          if (selectedParameters.includes('chuva')) {
            row.push(valores.chuva ? valores.chuva.toFixed(1) : '-');
          }
          if (selectedParameters.includes('pressure')) {
            row.push(valores.pressure || valores.pressao ? (valores.pressure || valores.pressao).toFixed(1) : '-');
          }

          console.log('📝 Linha montada:', row);
          return row;
        });

        const headersRow = ['Data/Hora'];
        if (selectedParameters.includes('temperatura')) headersRow.push('Temp (°C)');
        if (selectedParameters.includes('umidade')) headersRow.push('Umid (%)');
        if (selectedParameters.includes('chuva')) headersRow.push('Chuva (mm)');
        if (selectedParameters.includes('pressure')) headersRow.push('Pressão (hPa)');

        autoTable(doc, {
          startY: yPos,
          head: [headersRow],
          body: readingsTableData,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246], fontSize: 8 },
          bodyStyles: { fontSize: 7 },
          styles: { cellPadding: 1.5 },
          margin: { left: 14, right: 14 },
          pageBreak: 'auto'
        });

        yPos = (doc as any).lastAutoTable.finalY + 10;
      } catch (error) {
        console.error(`Erro ao buscar dados da estação ${station?.name}:`, error);
        doc.setFontSize(9);
        doc.text('Erro ao carregar dados', 14, yPos);
        yPos += 10;
      }
    }

    // ========== ALERTAS ATIVOS ==========
    if (includeAlerts && allAlerts.length > 0) {
      if (yPos > 170) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ALERTAS ATIVOS NO SISTEMA', 14, yPos);
      yPos += 5;

      const alertsTableData = allAlerts.map(alert => {
        const station = stations.find(s => 
          s.id === alert.stationId || 
          s.macAddress === alert.stationId ||
          s.id === (alert as any).stationId ||
          s.macAddress === (alert as any).stationId
        );
        const macAddress = alert.stationId || (alert as any).macEstacao || station?.macAddress || 'N/A';
        const alertName = (alert as any).alert_name || (alert as any).description || 'Alerta';
        const level = alert.level === 'critical' ? 'Crítico' : 'Aviso';
        const createdAt = alert.createdAt ? new Date(alert.createdAt).toLocaleString('pt-BR') : 'N/A';

        return [
          station?.name || 'Estação não identificada',
          macAddress,
          alertName,
          level,
          createdAt
        ];
      });

      autoTable(doc, {
        startY: yPos,
        head: [['Estação', 'MAC', 'Tipo/Nome do Alerta', 'Nível', 'Data de Criação']],
        body: alertsTableData,
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        styles: { cellPadding: 2 },
        margin: { left: 14, right: 14 }
      });

      yPos = (doc as any).lastAutoTable.finalY + 5;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total de Alertas Ativos: ${allAlerts.length}`, 14, yPos);
    }

    // Salvar PDF
    doc.save(`skytrack_relatorio_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExport = async () => {
    if (selectedStations.length === 0) {
      toast.error('Selecione pelo menos uma estação!', { position: 'top-right' });
      return;
    }

    if (selectedParameters.length === 0) {
      toast.error('Selecione pelo menos um parâmetro!', { position: 'top-right' });
      return;
    }

    setExporting(true);

    try {
      // Buscar alertas ativos se a opção estiver marcada
      let allAlerts: any[] = [];
      if (includeAlerts) {
        const activeAlertsData = await getAlerts(true); // Busca apenas alertas ativos
        allAlerts = activeAlertsData || [];
        console.log('📊 Total de alertas ativos buscados da API:', allAlerts.length);
        console.log('📋 Alertas completos:', allAlerts);
      }

      // Se for PDF, chama a função de exportação PDF
      if (exportFormat === 'pdf') {
        await exportPDF(allAlerts);
        
        toast.success('✅ PDF exportado com sucesso!', {
          position: 'top-right',
          autoClose: 3000,
        });

        onClose();
        return;
      }

      // ========== EXPORTAÇÃO CSV ==========
      const csvData: string[][] = [];

      // ========== CABEÇALHO DO RELATÓRIO ==========
      csvData.push(['RELATÓRIO DE DADOS - SKYTRACK']);
      csvData.push(['']);
      csvData.push(['Data de Geração:', new Date().toLocaleString('pt-BR')]);
      csvData.push(['Estações Selecionadas:', selectedStations.length.toString()]);
      csvData.push(['Parâmetros Selecionados:', selectedParameters.length.toString()]);
      if (includeAlerts) {
        csvData.push(['Alertas Ativos no Sistema:', allAlerts.length.toString()]);
      }
      csvData.push(['']);
      csvData.push(['════════════════════════════════════════════════════════════════']);
      csvData.push(['']);

      // ========== INFORMAÇÕES DAS ESTAÇÕES (se selecionado) ==========
      if (includeStationInfo && selectedStations.length > 0) {
        csvData.push(['INFORMAÇÕES DAS ESTAÇÕES']);
        csvData.push(['']);
        csvData.push(['Nome', 'Status', 'Endereço', 'MAC', 'Latitude', 'Longitude']);
        
        selectedStations.forEach(stationId => {
          const station = stations.find(s => s.id === stationId);
          if (station) {
            csvData.push([
              station.name || 'N/A',
              station.status === 'ACTIVE' ? 'Ativa' : 'Inativa',
              station.address || 'N/A',
              station.macAddress || 'N/A',
              station.latitude?.toString() || 'N/A',
              station.longitude?.toString() || 'N/A'
            ]);
          }
        });
        
        csvData.push(['']);
        csvData.push(['════════════════════════════════════════════════════════════════']);
        csvData.push(['']);
      }

      // ========== LEITURAS DOS SENSORES ==========
      csvData.push(['LEITURAS DOS SENSORES']);
      csvData.push(['']);

      // Cabeçalho das colunas de dados
      const dataHeaders = ['Estação', 'Data/Hora'];
      selectedParameters.forEach(param => {
        const paramInfo = availableParameters.find(p => p.id === param);
        if (paramInfo) {
          dataHeaders.push(paramInfo.label);
        }
      });
      if (includeAlerts) {
        dataHeaders.push('Alertas');
      }
      csvData.push(dataHeaders);

      // Buscar todos os alertas já foi feito acima
      console.log('📊 Total de alertas disponíveis:', allAlerts.length);

      // Buscar dados de cada estação
      for (const stationId of selectedStations) {
        const station = stations.find(s => s.id === stationId);
        if (!station) continue;

        try {
          // Buscar leituras do sensor
          const response = await getSensorReadings({
            stationId: stationId,
            limit: 1000 // Limite grande para pegar vários dados
          });

          const readings = response.data || [];

          // Adicionar cada leitura como linha
          readings.forEach(reading => {
            const row: string[] = [
              station.name || 'N/A',
              new Date(reading.timestamp).toLocaleString('pt-BR')
            ];

            // Adicionar valores dos parâmetros selecionados
            selectedParameters.forEach(param => {
              const value = reading.valor[param as keyof typeof reading.valor];
              row.push(value !== undefined && value !== null ? value.toString() : 'N/A');
            });

            // Adicionar alertas se selecionado
            if (includeAlerts) {
              // Verificar alertas na própria leitura
              let alertInfo = '-';
              const readingAlertCount = reading.alerts?.length || 0;
              
              if (readingAlertCount > 0) {
                alertInfo = `${readingAlertCount} alerta(s)`;
              } else {
                // Se não tem alertas na leitura, buscar alertas ativos relacionados à estação
                const stationAlerts = allAlerts.filter(alert => 
                  alert.stationId === stationId || 
                  (alert as any).stationId === stationId
                );
                
                if (stationAlerts.length > 0) {
                  // Mostrar nomes dos alertas e MAC da estação
                  const alertNames = stationAlerts
                    .map(a => (a as any).alert_name || (a as any).tipoAlertaId || 'Alerta')
                    .slice(0, 2) // Mostrar no máximo 2
                    .join(', ');
                  
                  const macInfo = stationAlerts[0]?.macEstacao || station.macAddress || '';
                  alertInfo = `${stationAlerts.length} (${alertNames}${stationAlerts.length > 2 ? '...' : ''})${macInfo ? ` [MAC: ${macInfo}]` : ''}`;
                }
              }
              
              row.push(alertInfo);
            }

            csvData.push(row);
          });

          // Linha separadora entre estações
          if (selectedStations.indexOf(stationId) < selectedStations.length - 1) {
            csvData.push(['---']);
          }

        } catch (error) {
          console.error(`Erro ao buscar dados da estação ${station.name}:`, error);
        }
      }

      // ========== SEÇÃO DE ALERTAS (se incluir alertas) ==========
      if (includeAlerts && allAlerts.length > 0) {
        csvData.push(['']);
        csvData.push(['════════════════════════════════════════════════════════════════']);
        csvData.push(['']);
        csvData.push(['ALERTAS ATIVOS NO SISTEMA']);
        csvData.push(['']);
        csvData.push(['Estação', 'MAC', 'Tipo/Nome do Alerta', 'Nível', 'Data de Criação']);
        
        // Mostrar TODOS os alertas ativos, não filtrar por estações selecionadas
        allAlerts.forEach(alert => {
          // O stationId pode ser o MAC address ou o ID da estação
          const station = stations.find(s => 
            s.id === alert.stationId || 
            s.macAddress === alert.stationId ||
            s.id === (alert as any).stationId ||
            s.macAddress === (alert as any).stationId
          );
          const macAddress = alert.stationId || (alert as any).macEstacao || station?.macAddress || 'N/A';
          const alertName = (alert as any).alert_name || (alert as any).description || (alert as any).tipoAlertaId || 'Alerta';
          const level = alert.level === 'critical' ? 'Crítico' : 'Aviso';
          const createdAt = alert.createdAt ? new Date(alert.createdAt).toLocaleString('pt-BR') : 'N/A';
          
          const row = [
            station?.name || 'Estação não identificada',
            macAddress,
            alertName,
            level,
            createdAt
          ];
          
          console.log('📊 Linha do alerta:', row);
          csvData.push(row);
        });
        
        csvData.push(['']);
        csvData.push([`Total de Alertas Ativos: ${allAlerts.length}`]);
      }

      // ========== RODAPÉ ==========
      csvData.push(['']);
      csvData.push(['════════════════════════════════════════════════════════════════']);
      csvData.push(['']);
      csvData.push(['RESUMO DA EXPORTAÇÃO']);
      csvData.push(['Total de Linhas:', (csvData.length - 20).toString()]); // Aproximado
      csvData.push(['Parâmetros Exportados:', selectedParameters.join(', ')]);
      csvData.push(['']);
      csvData.push(['Relatório gerado automaticamente pelo Sistema SkyTrack']);
      csvData.push(['Para mais informações, acesse o painel administrativo']);

      // ========== CONVERSÃO PARA CSV ==========
      const csvString = csvData.map(row =>
        row.map(field => {
          // Escapar aspas duplas e envolver em aspas
          const fieldStr = String(field).replace(/"/g, '""');
          return `"${fieldStr}"`;
        }).join(';') // Usar ponto-e-vírgula para compatibilidade com Excel/Sheets em português
      ).join('\n');

      // ========== DOWNLOAD ==========
      const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `skytrack_dados_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.success('✅ Dados exportados com sucesso!', {
        position: 'top-right',
        autoClose: 3000,
      });

      onClose();

    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('❌ Erro ao exportar dados. Tente novamente.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className={`rounded-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${isDarkMode ? 'bg-slate-700' : 'bg-blue-100'}`}>
                  <FileText className={`h-5 w-5 sm:h-6 sm:w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base sm:text-xl font-bold truncate ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                    Exportar Dados CSV
                  </h2>
                  <p className={`text-xs sm:text-sm hidden sm:block ${isDarkMode ? 'text-gray-400' : 'text-zinc-600'}`}>
                    Selecione estações e parâmetros para gerar seu relatório
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors shrink-0 ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100'
              }`}
            >
              <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-zinc-600'}`} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-200px)]">
          
          {/* Estações */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
              <label className={`text-xs sm:text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>
                Estações ({selectedStations.length}/{stations.length})
              </label>
              <button
                onClick={toggleAllStations}
                className={`text-xs font-medium px-2 sm:px-3 py-1 rounded ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-blue-400'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                }`}
              >
                {selectedStations.length === stations.length ? 'Desmarcar' : 'Selecionar'}
              </button>
            </div>
            <div className={`border rounded-lg p-2 sm:p-3 max-h-32 sm:max-h-40 overflow-y-auto ${
              isDarkMode ? 'border-slate-700 bg-slate-700/30' : 'border-slate-200 bg-slate-50'
            }`}>
              {stations.map(station => (
                <div
                  key={station.id}
                  onClick={() => toggleStation(station.id)}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-white'
                  }`}
                >
                  {selectedStations.includes(station.id) ? (
                    <CheckSquare className={`h-3 w-3 sm:h-4 sm:w-4 shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  ) : (
                    <Square className={`h-3 w-3 sm:h-4 sm:w-4 shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`} />
                  )}
                  <span className={`text-xs sm:text-sm flex-1 truncate ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>
                    {station.name}
                  </span>
                  <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded shrink-0 ${
                    station.status === 'ACTIVE'
                      ? isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                      : isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                  }`}>
                    {station.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Parâmetros */}
          <div className="mb-4 sm:mb-6">
            <label className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 block ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>
              Parâmetros a Exportar
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {availableParameters.map(param => (
                <div
                  key={param.id}
                  onClick={() => toggleParameter(param.id)}
                  className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg cursor-pointer border transition-all ${
                    selectedParameters.includes(param.id)
                      ? isDarkMode
                        ? 'bg-blue-900/20 border-blue-600'
                        : 'bg-blue-50 border-blue-300'
                      : isDarkMode
                        ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {selectedParameters.includes(param.id) ? (
                    <CheckSquare className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  ) : (
                    <Square className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`} />
                  )}
                  <span className={`text-xs sm:text-sm font-medium ${
                    selectedParameters.includes(param.id)
                      ? isDarkMode ? 'text-blue-300' : 'text-blue-700'
                      : isDarkMode ? 'text-gray-300' : 'text-zinc-700'
                  }`}>
                    {param.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Formato de Exportação */}
          <div className="mb-6">
            <label className={`text-sm font-semibold mb-3 block ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>
              Formato de Exportação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setExportFormat('csv')}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition-all ${
                  exportFormat === 'csv'
                    ? isDarkMode
                      ? 'bg-blue-900/20 border-blue-600'
                      : 'bg-blue-50 border-blue-300'
                    : isDarkMode
                      ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <FileText className={`h-6 w-6 ${
                  exportFormat === 'csv'
                    ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    : isDarkMode ? 'text-gray-500' : 'text-slate-400'
                }`} />
                <div>
                  <div className={`text-sm font-medium ${
                    exportFormat === 'csv'
                      ? isDarkMode ? 'text-blue-300' : 'text-blue-700'
                      : isDarkMode ? 'text-gray-300' : 'text-zinc-700'
                  }`}>
                    CSV
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    Planilha Excel/Sheets
                  </div>
                </div>
              </div>

              <div
                onClick={() => setExportFormat('pdf')}
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition-all ${
                  exportFormat === 'pdf'
                    ? isDarkMode
                      ? 'bg-blue-900/20 border-blue-600'
                      : 'bg-blue-50 border-blue-300'
                    : isDarkMode
                      ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Download className={`h-6 w-6 ${
                  exportFormat === 'pdf'
                    ? isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    : isDarkMode ? 'text-gray-500' : 'text-slate-400'
                }`} />
                <div>
                  <div className={`text-sm font-medium ${
                    exportFormat === 'pdf'
                      ? isDarkMode ? 'text-blue-300' : 'text-blue-700'
                      : isDarkMode ? 'text-gray-300' : 'text-zinc-700'
                  }`}>
                    PDF
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                    Documento formatado
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opções Adicionais */}
          <div className="mb-6">
            <label className={`text-sm font-semibold mb-3 block ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>
              Informações Adicionais
            </label>
            <div className="space-y-2">
              <div
                onClick={() => setIncludeStationInfo(!includeStationInfo)}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border ${
                  includeStationInfo
                    ? isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'
                    : isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                {includeStationInfo ? (
                  <CheckSquare className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                ) : (
                  <Square className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`} />
                )}
                <div className="flex-1">
                  <span className={`text-sm font-medium block ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>
                    Incluir detalhes das estações
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-zinc-500'}`}>
                    Endereço, coordenadas GPS, MAC, status
                  </span>
                </div>
              </div>
              
              <div
                onClick={() => setIncludeAlerts(!includeAlerts)}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer border ${
                  includeAlerts
                    ? isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-300'
                    : isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                {includeAlerts ? (
                  <CheckSquare className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                ) : (
                  <Square className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`} />
                )}
                <div className="flex-1">
                  <span className={`text-sm font-medium block ${isDarkMode ? 'text-gray-200' : 'text-zinc-700'}`}>
                    Incluir coluna de alertas
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-zinc-500'}`}>
                    Mostra quantos alertas estavam ativos em cada leitura
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do que será exportado */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
              Coisas a serem exportadas:
            </h3>
            <div className={`space-y-2 text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <strong>{selectedParameters.length}</strong> Parâmetro{selectedParameters.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <strong>{selectedStations.length}</strong> Estação{selectedStations.length !== 1 ? 'ões' : ''}
              </div>
              {includeStationInfo && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Detalhes das estações incluídos
                </div>
              )}
              {includeAlerts && (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Coluna de alertas incluída nas leituras
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 sm:p-6 border-t flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 ${
          isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
        }`}>
          <button
            onClick={onClose}
            disabled={exporting}
            className={`px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
              isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-zinc-800'
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || selectedStations.length === 0 || selectedParameters.length === 0}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all w-full sm:w-auto ${
              exporting || selectedStations.length === 0 || selectedParameters.length === 0
                ? isDarkMode
                  ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
            }`}
          >
            <Download className="h-4 w-4" />
            {exporting ? 'Exportando...' : `Exportar ${exportFormat.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportCSVModal;