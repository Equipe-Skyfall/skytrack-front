import React, { useState, useEffect } from 'react';
import { RefreshCw, Thermometer, Droplets, CloudRain, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { getSensorReadings } from '../../services/api/sensorReadings';
import type { SensorReading } from '../../interfaces/sensor-readings';

interface SensorReadingsCardsProps {
  stationId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
}

interface StationData {
  stationId: string;
  stationName: string;
  reading: SensorReading | null;
  lastUpdate: string;
  isOnline: boolean;
}

const SensorReadingsCards: React.FC<SensorReadingsCardsProps> = ({
  stationId,
  autoRefresh = false,
  refreshInterval = 300, // 5 minutes default
}) => {
  const [stations, setStations] = useState<StationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadCurrentReadings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Loading current sensor readings...');
      
  const response = await getSensorReadings({ limit: 200 });
  const readings: SensorReading[] = response.data || response || [];
      
      // Group readings by station and get the most recent for each station
      const stationMap = new Map<string, StationData>();
      
      readings.forEach(reading => {
        const key = reading.stationId;
        
        if (!stationMap.has(key)) {
          stationMap.set(key, {
            stationId: reading.stationId,
            stationName: `Estação ${reading.stationId.slice(-8)}`,
            reading: reading,
            lastUpdate: reading.timestamp,
            isOnline: true
          });
        } else {
          // Keep the most recent reading
          const existing = stationMap.get(key)!;
          if (new Date(reading.timestamp) > new Date(existing.lastUpdate)) {
            existing.reading = reading;
            existing.lastUpdate = reading.timestamp;
          }
        }
      });
      
      const stationData = Array.from(stationMap.values());
      
      // Check if stations are online (readings within last 30 minutes)
      const now = new Date();
      stationData.forEach(station => {
        const lastUpdate = new Date(station.lastUpdate);
        const timeDiff = now.getTime() - lastUpdate.getTime();
        station.isOnline = timeDiff < 30 * 60 * 1000; // 30 minutes
      });
      
      setStations(stationData);
      setLastRefresh(new Date());
      
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar leituras atuais';
      setError(errorMessage);
      console.error('Error loading current readings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadCurrentReadings();
  };

  // Load data on mount
  useEffect(() => {
    loadCurrentReadings();
  }, [stationId]);

  // Auto refresh
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        loadCurrentReadings();
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getSensorValue = (reading: SensorReading | null, sensorType: string): number | null => {
    if (!reading || !reading.valor) return null;
    
    const valor = reading.valor as any;
    return valor[sensorType] || null;
  };

  const formatValue = (value: number | null, unit: string): string => {
    if (value === null) return '--';
    return `${value.toFixed(1)}${unit}`;
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'text-green-600' : 'text-red-600';
  };

  const getCardBorderColor = (isOnline: boolean) => {
    return isOnline ? 'border-green-200' : 'border-red-200';
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Erro ao carregar dados</span>
        </div>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Leituras Atuais dos Sensores
          </h3>
          {lastRefresh && (
            <p className="text-sm text-gray-500">
              Última atualização: {lastRefresh.toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>

      {/* Station Cards */}
      {stations.length === 0 && !loading ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Nenhuma leitura disponível</p>
          <p className="text-sm">Verifique se as estações estão funcionando</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div
              key={station.stationId}
              className={`bg-white rounded-xl shadow-sm border-2 ${getCardBorderColor(station.isOnline)} p-6`}
            >
              {/* Station Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{station.stationName}</h4>
                  <p className="text-xs text-gray-500">MAC: {station.reading?.macEstacao || 'N/A'}</p>
                </div>
                <div className={`flex items-center gap-1 ${getStatusColor(station.isOnline)}`}>
                  {station.isOnline ? (
                    <Wifi className="h-4 w-4" />
                  ) : (
                    <WifiOff className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">
                    {station.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {/* Sensor Readings */}
              <div className="space-y-4">
                {/* Temperature */}
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Thermometer className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Temperatura</p>
                      <p className="text-xs text-gray-500">°C</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-700">
                      {formatValue(getSensorValue(station.reading, 'temperatura'), '°C')}
                    </p>
                  </div>
                </div>

                {/* Humidity */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Droplets className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Umidade</p>
                      <p className="text-xs text-gray-500">%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-700">
                      {formatValue(getSensorValue(station.reading, 'umidade'), '%')}
                    </p>
                  </div>
                </div>

                {/* Rain/Precipitation */}
                <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <CloudRain className="h-4 w-4 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Chuva</p>
                      <p className="text-xs text-gray-500">mm</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-cyan-700">
                      {formatValue(getSensorValue(station.reading, 'chuva'), ' mm')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Update */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Última leitura: {new Date(station.lastUpdate).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && stations.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Carregando leituras atuais...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorReadingsCards;