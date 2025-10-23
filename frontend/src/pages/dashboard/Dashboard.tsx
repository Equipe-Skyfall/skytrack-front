
import React from 'react';
import StatusEstacoes from '../../components/dashboard/StatusEstacoes';
import AlertasRecentes from '../../components/dashboard/AlertasRecentes';
import Charts from '../../components/dashboard/Charts';
import { useStations } from '../../hooks/stations/useStations';
import { useAlerts } from '../../hooks/alerts/useAlerts';

const Dashboard: React.FC = () => {
  const { stations, loading: loadingStations, error: errorStations } = useStations();
  const { activeAlerts, loading: loadingAlerts, error: errorAlerts } = useAlerts();

  const activeStations = stations.filter(s => s.status === 'ACTIVE');

  const loading = loadingStations || loadingAlerts;
  const error = errorStations || errorAlerts;

  return (
    <div className="min-h-screen bg-white font-poppins flex">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-800 tracking-tight">
          Dashboard
        </h1>

        {loading ? (
          <div className="text-lg text-zinc-600">Carregando dashboard...</div>
        ) : error ? (
          <div className="text-lg text-red-600">Erro: {error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card de Estações Ativas */}
              <div className="bg-white border border-blue-200 rounded-xl shadow-md p-6 flex items-center gap-4">
                <div className="bg-blue-100 rounded-lg p-3 flex items-center justify-center">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7a2 2 0 012-2h2m12 0h2a2 2 0 012 2v7c0 2.21-3.582 4-8 4z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-blue-900 mb-1">Estações Ativas</h2>
                  <div className="text-3xl font-bold text-blue-700 mb-2">{activeStations.length}</div>
                  <ul className="text-blue-800 text-sm space-y-1">
                    {activeStations.map(estacao => (
                      <li key={estacao.id} className="truncate">{estacao.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Card de Alertas Ativos */}
              <div className="bg-white border border-red-200 rounded-xl shadow-md p-6 flex items-center gap-4">
                <div className="bg-red-100 rounded-lg p-3 flex items-center justify-center">
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-red-900 mb-1">Alertas Ativos</h2>
                  <div className="text-3xl font-bold text-red-700 mb-2">{activeAlerts.length}</div>
                  <ul className="text-red-800 text-sm space-y-1">
                    {activeAlerts.map(alerta => (
                      <li key={alerta.id} className="truncate">Estação: {alerta.stationId} | Parâmetro: {alerta.parameterId}</li>
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
