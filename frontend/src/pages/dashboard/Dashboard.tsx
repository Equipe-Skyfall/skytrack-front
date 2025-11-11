
import React from 'react';
import Charts from '../../components/dashboard/Charts';
import { useStations } from '../../hooks/stations/useStations';
import { useAlerts } from '../../hooks/alerts/useAlerts';
import { useTheme } from '../../contexts/ThemeContext';
import { Radio, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { stations, loading: loadingStations, error: errorStations } = useStations();
  const { activeAlerts, loading: loadingAlerts, error: errorAlerts } = useAlerts();

  const activeStations = stations.filter(s => s.status === 'ACTIVE');

  const loading = loadingStations || loadingAlerts;
  const error = errorStations || errorAlerts;

  return (
    <div className="min-h-screen font-poppins flex">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <h1 className={`text-3xl font-bold font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
          Dashboard
        </h1>

        {loading ? (
          <div className={`text-lg font-poppins ${isDarkMode ? 'text-gray-200' : 'text-zinc-600'}`}>Carregando dashboard...</div>
        ) : error ? (
          <div className={`text-lg font-poppins ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Erro: {error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card de Estações Ativas */}
              <div className={`rounded-xl border p-6 flex items-center gap-4 shadow-md ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-blue-200'
              }`}>
                <div className={`rounded-lg p-3 flex items-center justify-center ${
                  isDarkMode ? 'bg-slate-700' : 'bg-blue-100'
                }`}>
                  <Radio className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-lg font-semibold mb-1 font-poppins ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-900'
                  }`}>Estações Ativas</h2>
                  <div className={`text-3xl font-bold mb-2 font-poppins ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-700'
                  }`}>{activeStations.length}</div>
                  <ul className={`text-sm space-y-1 font-poppins ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-800'
                  }`}>
                    {activeStations.map(estacao => (
                      <li key={estacao.id} className="truncate">{estacao.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Card de Alertas Ativos */}
              <div className={`rounded-xl border p-6 flex items-center gap-4 shadow-md ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-red-200'
              }`}>
                <div className={`rounded-lg p-3 flex items-center justify-center ${
                  isDarkMode ? 'bg-slate-700' : 'bg-red-100'
                }`}>
                  <AlertTriangle className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className={`text-lg font-semibold mb-1 font-poppins ${
                    isDarkMode ? 'text-red-300' : 'text-red-900'
                  }`}>Alertas Ativos</h2>
                  <div className={`text-3xl font-bold mb-2 font-poppins ${
                    isDarkMode ? 'text-red-400' : 'text-red-700'
                  }`}>{activeAlerts.length}</div>
                  <ul className={`text-sm space-y-1 font-poppins ${
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
    </div>
  );
};

export default Dashboard;
