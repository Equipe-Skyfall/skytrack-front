import React, { useState, useEffect } from 'react';
import SensorReadingsChart from '../../components/sensor-readings/SensorReadingsChart';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import type { Station } from '../../interfaces/stations';

const SensorReadings: React.FC = () => {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with real API call
        // const response = await getStations();
        // setStations([{ id: '', name: 'Todas as Estações' }, ...response.data]);
        
        // For now, provide basic empty state to avoid mock data
        setStations([{ 
          id: '', 
          name: 'Todas as Estações', 
          macAddress: '', 
          latitude: 0, 
          longitude: 0, 
          address: null, 
          description: null, 
          status: 'INACTIVE' as const, 
          createdAt: '', 
          updatedAt: '',
          statusColor: 'gray'
        }]);
      } catch (error) {
        console.error('Erro ao carregar estações:', error);
        setStations([{ 
          id: '', 
          name: 'Todas as Estações', 
          macAddress: '', 
          latitude: 0, 
          longitude: 0, 
          address: null, 
          description: null, 
          status: 'INACTIVE' as const, 
          createdAt: '', 
          updatedAt: '',
          statusColor: 'gray'
        }]);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-lg text-zinc-600 font-poppins">Carregando estações...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-zinc-800 font-poppins">
              Monitoramento de Sensores
            </h1>
          </div>
          <p className="text-zinc-600 text-lg font-poppins">
            Visualize e analise as leituras dos sensores meteorológicos em tempo real
          </p>
        </div>

        {/* Station Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-zinc-700 font-poppins">
              Selecionar Estação:
            </label>
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-poppins"
            >
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 ml-auto">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-zinc-600 font-poppins">
                {selectedStationId ? 'Dados específicos da estação' : 'Dados agregados de todas as estações'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="mb-8">
          <SensorReadingsChart 
            stationId={selectedStationId || undefined}
            height={500}
            showControls={true}
            chartType="line"
            timeRange="24h"
          />
        </div>

        {/* Quick Views Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-zinc-900 font-poppins">Vista Rápida - 1 Hora</h2>
            </div>
            <SensorReadingsChart 
              stationId={selectedStationId || undefined}
              height={300}
              showControls={false}
              chartType="area"
              timeRange="1h"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-zinc-900 font-poppins">Vista Rápida - 6 Horas</h2>
            </div>
            <SensorReadingsChart 
              stationId={selectedStationId || undefined}
              height={300}
              showControls={false}
              chartType="line"
              timeRange="6h"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-zinc-900 font-poppins">Vista Rápida - 7 Dias</h2>
            </div>
            <SensorReadingsChart 
              stationId={selectedStationId || undefined}
              height={300}
              showControls={false}
              chartType="bar"
              timeRange="7d"
            />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900 font-poppins">Dados em Tempo Real</h3>
            </div>
            <p className="text-blue-700 text-sm font-poppins">
              Os gráficos são atualizados automaticamente com as últimas leituras dos sensores.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-900 font-poppins">Múltiplos Sensores</h3>
            </div>
            <p className="text-green-700 text-sm font-poppins">
              Visualize temperatura, umidade e pressão atmosférica em um único gráfico.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold text-purple-900 font-poppins">Controles Flexíveis</h3>
            </div>
            <p className="text-purple-700 text-sm font-poppins">
              Escolha o período, tipo de gráfico e quais sensores visualizar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorReadings;