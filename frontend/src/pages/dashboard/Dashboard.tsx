
import React from 'react';
import Charts from '../../components/dashboard/Charts';
import { useStations } from '../../hooks/stations/useStations';
import { useAlerts } from '../../hooks/alerts/useAlerts';
import { Radio, AlertTriangle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stations, loading: loadingStations, error: errorStations } = useStations();
  const { activeAlerts, loading: loadingAlerts, error: errorAlerts } = useAlerts();

  const activeStations = stations.filter(s => s.status === 'ACTIVE');

  const loading = loadingStations || loadingAlerts;
  const error = errorStations || errorAlerts;

  return (
    <div className="min-h-screen bg-white font-poppins flex">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <h1 className="text-3xl font-bold text-zinc-800 font-poppins">
          Dashboard
        </h1>

        {loading ? (
          <div className="text-lg text-zinc-600 font-poppins">Carregando dashboard...</div>
        ) : error ? (
          <div className="text-lg text-red-600 font-poppins">Erro: {error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card de Estações Ativas */}
              <div className="bg-white border border-blue-200 rounded-xl shadow-md p-6 flex items-center gap-4">
                <div className="bg-blue-100 rounded-lg p-3 flex items-center justify-center">
                  <Radio className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-blue-900 mb-1 font-poppins">Estações Ativas</h2>
                  <div className="text-3xl font-bold text-blue-700 mb-2 font-poppins">{activeStations.length}</div>
                  <ul className="text-blue-800 text-sm space-y-1 font-poppins">
                    {activeStations.map(estacao => (
                      <li key={estacao.id} className="truncate">{estacao.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Card de Alertas Ativos */}
              <div className="bg-white border border-red-200 rounded-xl shadow-md p-6 flex items-center gap-4">
                <div className="bg-red-100 rounded-lg p-3 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-red-900 mb-1 font-poppins">Alertas Ativos</h2>
                  <div className="text-3xl font-bold text-red-700 mb-2 font-poppins">{activeAlerts.length}</div>
                  <ul className="text-red-800 text-sm space-y-1 font-poppins">
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
