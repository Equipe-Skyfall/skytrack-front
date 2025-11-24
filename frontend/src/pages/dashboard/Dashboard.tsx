
import React, { useState } from 'react';
import Charts from '../../components/dashboard/Charts';
import ExportCSVModal from '../../components/dashboard/ExportCSVModal';
import { useStations } from '../../hooks/stations/useStations';
import { useAlerts } from '../../hooks/alerts/useAlerts';
import { useTheme } from '../../contexts/ThemeContext';
import { Radio, AlertTriangle, Download } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { stations, loading: loadingStations, error: errorStations } = useStations();
  const { activeAlerts, loading: loadingAlerts, error: errorAlerts } = useAlerts();
  const [showExportModal, setShowExportModal] = useState(false);

  const activeStations = stations.filter(s => s.status === 'ACTIVE');

  const loading = loadingStations || loadingAlerts;
  const error = errorStations || errorAlerts;

  return (
    <div className="min-h-screen font-poppins">
      <main className="space-y-6 sm:space-y-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className={`text-2xl sm:text-3xl font-bold font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
            Dashboard
          </h1>
          
          {/* Botão de Exportar CSV */}
          <button
            onClick={() => setShowExportModal(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto justify-center ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Download className="h-5 w-5" />
            Exportar
          </button>
        </div>

        {loading ? (
          <div className={`text-lg font-poppins ${isDarkMode ? 'text-gray-200' : 'text-zinc-600'}`}>Carregando dashboard...</div>
        ) : error ? (
          <div className={`text-lg font-poppins ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Erro: {error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Card de Estações Ativas */}
              <div className={`rounded-xl border p-4 sm:p-6 flex items-center gap-4 shadow-md ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-blue-200'
              }`}>
                <div className={`rounded-lg p-2 sm:p-3 flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-blue-100'
                }`}>
                  <Radio className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-base sm:text-lg font-semibold mb-1 font-poppins ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-900'
                  }`}>Estações Ativas</h2>
                  <div className={`text-2xl sm:text-3xl font-bold mb-2 font-poppins ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-700'
                  }`}>{activeStations.length}</div>
                  <ul className={`text-xs sm:text-sm space-y-1 font-poppins ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-800'
                  }`}>
                    {activeStations.map(estacao => (
                      <li key={estacao.id} className="truncate">{estacao.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Card de Alertas Ativos */}
              <div className={`rounded-xl border p-4 sm:p-6 flex items-center gap-4 shadow-md ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-red-200'
              }`}>
                <div className={`rounded-lg p-2 sm:p-3 flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-slate-700' : 'bg-red-100'
                }`}>
                  <AlertTriangle className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-base sm:text-lg font-semibold mb-1 font-poppins ${
                    isDarkMode ? 'text-red-300' : 'text-red-900'
                  }`}>Alertas Ativos</h2>
                  <div className={`text-2xl sm:text-3xl font-bold mb-2 font-poppins ${
                    isDarkMode ? 'text-red-400' : 'text-red-700'
                  }`}>{activeAlerts.length}</div>
                  <ul className={`text-xs sm:text-sm space-y-1 font-poppins ${
                    isDarkMode ? 'text-red-200' : 'text-red-800'
                  }`}>
                    {activeAlerts.map(alerta => (
                      <li key={alerta.id} className="truncate">
                        {(alerta as any).alert_name || `Alerta ${alerta.id}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

         
            <div className="mt-6">
              <Charts />
            </div>
          </>
        )}
      </main>

      {/* Modal de Exportação CSV */}
      <ExportCSVModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
};

export default Dashboard;
