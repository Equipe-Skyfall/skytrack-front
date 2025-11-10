import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, MapPin } from 'lucide-react';
import useSensorReadings from '../../hooks/sensor-readings/useSensorReadings';
import { useStations } from '../../hooks/stations/useStations';

const GLOBAL_STATION_ID = null; // Use null to represent "all stations"

const Charts: React.FC = () => {
  const [activeChart, setActiveChart] = useState<'line' | 'area' | 'bar'>('line');
  const [selectedSensors, setSelectedSensors] = useState<Set<string>>(new Set());
  const [selectedStationId, setSelectedStationId] = useState<string | null>(GLOBAL_STATION_ID);

  const {
    readings,
    sensorTypes,
    loading,
    error,
    hasData,
    loadReadings,
    loadStationReadings,
  } = useSensorReadings();


  // Stations hook for dropdown
  const { stations } = useStations();

  // Add "Todas as estações" as first option with null id (global)
  const stationsWithGlobal: Array<{ id: string | null; name: string }> = [
    { id: GLOBAL_STATION_ID, name: 'Todas as estações' },
    ...(stations?.map(s => ({ id: s.id, name: s.name })) || []),
  ];

  // Initialize selected sensors based on available sensor types
  useEffect(() => {
    if (sensorTypes.length > 0) {
      const defaultSelected = new Set(sensorTypes.map(type => type.key));
      setSelectedSensors(defaultSelected);
    }
  }, [sensorTypes]);

  // When the selected station changes, reload readings for that station
  useEffect(() => {
    const load = async () => {
      try {
        if (selectedStationId === GLOBAL_STATION_ID) {
          // Global view - load all readings and explicitly clear station filters
          console.log('Loading global readings (all stations)');
          await loadReadings({}, true); // Force refresh to clear any cached station filters
        } else {
          // Station-specific view
          console.log('Loading readings for station:', selectedStationId);
          if (typeof loadStationReadings === 'function') {
            await loadStationReadings(selectedStationId);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar leituras da estação:', err);
      }
    };

    load();
  }, [selectedStationId]); // Remove loadReadings, loadStationReadings from deps to prevent infinite loops

  // Transform readings to chart data
  const chartData = readings.map(reading => {
    const timestamp = new Date(reading.timestamp);
    const timeLabel = timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const dataPoint: any = {
      time: timeLabel,
      timestamp: reading.timestamp,
    };

    // Add all sensor values dynamically
    Object.keys(reading.valor).forEach(key => {
      dataPoint[key] = reading.valor[key] || 0;
    });

    return dataPoint;
  });

  const toggleSensor = (sensor: string) => {
    const newSelection = new Set(selectedSensors);
    if (newSelection.has(sensor)) {
      newSelection.delete(sensor);
    } else {
      newSelection.add(sensor);
    }
    setSelectedSensors(newSelection);
  };

  const getSensorConfig = (sensorKey: string) => {
    const sensorType = sensorTypes.find(type => type.key === sensorKey);
    
    if (sensorType) {
      return {
        key: sensorType.key,
        name: sensorType.label,
        color: sensorType.color,
        unit: sensorType.unit,
        // icons removed (mocked); UI uses a colored dot instead
      };
    }

    // Fallback for unknown sensors
    return {
      key: sensorKey,
      name: sensorKey.charAt(0).toUpperCase() + sensorKey.slice(1),
      color: '#6b7280',
      unit: '',
      icon: <TrendingUp className="h-4 w-4" />
    };
  };

  // Removed getSensorIcon — icons were mocked. Use colored dot + label instead.

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-40">
          <div className="font-medium text-gray-700 mb-2">{label}</div>
          {payload.map((entry: any, index: number) => {
            const config = getSensorConfig(entry.dataKey);
            return (
              <div key={index} className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  {config?.name}:
                </span>
                <span className="font-semibold text-gray-900 ml-2">
                  {entry.value.toFixed(1)}{config?.unit}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-red-400 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-2" />
            <p>Erro ao carregar dados: {error}</p>
          </div>
        </div>
      );
    }

    // Show loading spinner while data is being fetched
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400 text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p>Carregando dados...</p>
          </div>
        </div>
      );
    }

    // Only show "no data" message AFTER loading is complete
    if (!loading && !hasData) {
      return (
        <div className="flex items-center z-10 fixed justify-center h-96 w-full text-center ">
          <div className="text-gray-400 text-center items-center  m mb-2 m-auto">
            <TrendingUp className="h-12 w-12" />
            <p >Nenhum dado disponível</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const renderSensorLines = () => {
      return Array.from(selectedSensors).map(sensor => {
        const config = getSensorConfig(sensor);
        if (!config) return null;

        if (activeChart === 'area') {
          return (
            <Area
              key={sensor}
              type="monotone"
              dataKey={config.key}
              stroke={config.color}
              fill={config.color}
              fillOpacity={0.3}
              strokeWidth={2}
              name={config.name}
              className="chart-line-glow"
            />
          );
        } else if (activeChart === 'bar') {
          return (
            <Bar
              key={sensor}
              dataKey={config.key}
              fill={config.color}
              name={config.name}
              className="chart-bar-glow"
            />
          );
        } else {
          return (
            <Line
              key={sensor}
              type="monotone"
              dataKey={config.key}
              stroke={config.color}
              strokeWidth={3}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              name={config.name}
              className="chart-line-glow"
            />
          );
        }
      });
    };

    const ChartComponent = activeChart === 'area' ? AreaChart : activeChart === 'bar' ? BarChart : LineChart;

    return (
      <ChartComponent {...commonProps}>
        {activeChart === 'area' && (
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorPres" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#45b7d1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#45b7d1" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        )}
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 12 }} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {renderSensorLines()}
      </ChartComponent>
    );
  };

  // Calculate statistics
  const getStats = () => {
    if (!hasData) return null;

    const stats: { [key: string]: { current: number, avg: number } } = {};
    
    sensorTypes.forEach(sensorType => {
      const sensorKey = sensorType.key;
      const values = chartData.map(d => d[sensorKey] as number).filter(v => v > 0);
      if (values.length > 0) {
        stats[sensorKey] = {
          current: values[values.length - 1] || 0,
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        };
      }
    });

    return stats;
  };

  const stats = getStats();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Dados Meteorológicos - Tempo Real
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            {hasData ? `${readings.length} leituras` : 'Aguardando dados...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveChart('line')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeChart === 'line'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Linha
            </button>
            <button
              onClick={() => setActiveChart('area')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeChart === 'area'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Área
            </button>
            <button
              onClick={() => setActiveChart('bar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeChart === 'bar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Barras
            </button>
          </div>

          {/* Station selector */}
          <div className="relative">
            <label className="sr-only">Selecionar estação</label>
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={selectedStationId ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedStationId(val === '' ? GLOBAL_STATION_ID : val);
              }}
              className="appearance-none pl-10 pr-8 py-2 border border-gray-200 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
            >
              {stationsWithGlobal.map(st => (
                <option key={st.id ?? 'global'} value={st.id ?? ''}>
                  {st.name}
                </option>
              ))}
            </select>
            {/* Caret */}
            <svg className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sensor Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sensorTypes.map(sensorType => {
          const config = getSensorConfig(sensorType.key);
          const isSelected = selectedSensors.has(sensorType.key);
          
          return (
            <button
              key={sensorType.key}
              onClick={() => toggleSensor(sensorType.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                isSelected
                  ? 'bg-white border-gray-300 text-gray-900 shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              {config?.icon}
              {config?.name}
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: isSelected ? config?.color : '#d1d5db' }}
              />
            </button>
          );
        })}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <ResponsiveContainer width="100%" height={420}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {sensorTypes.map(sensorType => {
            const config = getSensorConfig(sensorType.key);
            const sensorStats = stats[sensorType.key];
            
            if (!config || !sensorStats) return null;

            return (
              <div 
                key={sensorType.key}
                className="bg-gray-50 rounded-lg p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-gray-700 text-sm font-medium">{config.name}</span>
                </div>
                <div className="text-gray-900 text-2xl font-bold">
                  {sensorStats.current.toFixed(1)}{config.unit}
                </div>
                <div className="text-gray-500 text-xs">
                  Média: {sensorStats.avg.toFixed(1)}{config.unit}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Charts;