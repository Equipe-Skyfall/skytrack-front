import React, { useState } from 'react';
import SensorReadingsCards from '../../components/sensor-readings/SensorReadingsCards';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';

const SensorReadings: React.FC = () => {
  const [selectedStationId, setSelectedStationId] = useState<string>('');

  // Station list - replace with real data from API if needed
  const stations = [
    { id: '', name: 'Todas as Estações' },
    { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Estação Central' },
    { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Estação Norte' },
    { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Estação Sul' },
    { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Estação Leste' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Monitoramento de Sensores
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Visualize as leituras atuais dos sensores meteorológicos
          </p>
        </div>

        {/* Station Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Selecionar Estação:
            </label>
            <select
              value={selectedStationId}
              onChange={(e) => setSelectedStationId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 ml-auto">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">
                {selectedStationId ? 'Dados específicos da estação' : 'Dados de todas as estações'}
              </span>
            </div>
          </div>
        </div>

        {/* Sensor Readings Cards */}
        <SensorReadingsCards 
          stationId={selectedStationId || undefined}
          autoRefresh={true}
          refreshInterval={180} // 3 minutes
        />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Dados Atuais</h3>
            </div>
            <p className="text-blue-700 text-sm">
              Os valores exibidos são as leituras mais recentes de cada sensor.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Atualização Automática</h3>
            </div>
            <p className="text-green-700 text-sm">
              Os dados são atualizados automaticamente a cada 3 minutos.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-6 w-6 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Status das Estações</h3>
            </div>
            <p className="text-purple-700 text-sm">
              Monitore o status online/offline de cada estação meteorológica.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorReadings;