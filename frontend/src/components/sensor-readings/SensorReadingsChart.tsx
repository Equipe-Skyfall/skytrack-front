import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import {  RefreshCw, Download, TrendingUp, Thermometer, Droplets, Gauge } from 'lucide-react';
import useSensorReadings from '../../hooks/sensor-readings/useSensorReadings';

import '../dashboard/charts-neon.css';

interface SensorReadingsChartProps {
  stationId?: string;
  height?: number;
  showControls?: boolean;
  chartType?: 'line' | 'area' | 'bar';
  timeRange?: '1h' | '6h' | '24h' | '7d' | '30d';
}

const numberFormat = (value: number, suffix = '') => `${value.toFixed(1)}${suffix}`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-40">
        <div className="font-medium text-gray-700 mb-2">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              {entry.dataKey}:
            </span>
            <span className="font-semibold text-gray-900 ml-2">
              {numberFormat(entry.value, getUnitForSensor(entry.dataKey))}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const getUnitForSensor = (sensorKey: string): string => {
  switch (sensorKey) {
    case 'temperature': return '°C';
    case 'humidity': return '%';
    case 'pressure': return 'hPa';
    default: return '';
  }
};

const getIconForSensor = (sensorKey: string) => {
  switch (sensorKey) {
    case 'temperature': return <Thermometer className="h-4 w-4" />;
    case 'humidity': return <Droplets className="h-4 w-4" />;
    case 'pressure': return <Gauge className="h-4 w-4" />;
    default: return <TrendingUp className="h-4 w-4" />;
  }
};

const SensorReadingsChart: React.FC<SensorReadingsChartProps> = ({
  stationId,
  height = 420,
  showControls = true,
  chartType = 'line',
  timeRange = '24h',
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedChartType, setSelectedChartType] = useState(chartType);
  const [selectedSensors, setSelectedSensors] = useState<Set<string>>(new Set(['temperature', 'humidity', 'pressure']));

  const {
    readings,
    sensorTypes,
    loading,
    error,
    refreshing,
    loadReadings,
    loadStationReadings,
    refreshData,
    hasData,
    totalReadings,
  } = useSensorReadings();

  // Load data based on time range
  useEffect(() => {
    if (stationId) {
      loadStationReadings(stationId);
    } else {
      loadReadings();
    }
  }, [selectedTimeRange, stationId, loadReadings, loadStationReadings]);

  // Transform data for charts
  const chartData = readings.map(reading => {
    const timestamp = new Date(reading.timestamp);
    const timeLabel = selectedTimeRange === '1h' || selectedTimeRange === '6h' 
      ? timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : selectedTimeRange === '24h'
      ? timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : timestamp.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    return {
      time: timeLabel,
      timestamp: reading.timestamp,
      temperature: reading.valor.temperature || 0,
      humidity: reading.valor.humidity || 0,
      pressure: reading.valor.pressure || 0,
    };
  });

  // Get enabled sensor types
  const activeSensorTypes = sensorTypes.filter(sensor => 
    selectedSensors.has(sensor.key) && sensor.enabled
  );

  // Calculate statistics
  const getStats = () => {
    const stats: { [key: string]: { avg: number, min: number, max: number, current: number } } = {};
    
    activeSensorTypes.forEach(sensor => {
      const values = chartData.map(d => d[sensor.key as keyof typeof d] as number).filter(v => v > 0);
      if (values.length > 0) {
        stats[sensor.key] = {
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          current: values[values.length - 1] || 0,
        };
      }
    });
    
    return stats;
  };

  const stats = getStats();

  // Handle sensor toggle
  const toggleSensor = (sensorKey: string) => {
    const newSelected = new Set(selectedSensors);
    if (newSelected.has(sensorKey)) {
      newSelected.delete(sensorKey);
    } else {
      newSelected.add(sensorKey);
    }
    setSelectedSensors(newSelected);
  };

  // Download CSV
  const downloadData = () => {
    if (!chartData.length) return;

    const headers = ['Timestamp', ...activeSensorTypes.map(type => `${type.label} (${type.unit})`)];
    const csvContent = [
      headers.join(','),
      ...chartData.map(row => [
        row.timestamp,
        ...activeSensorTypes.map(type => row[type.key as keyof typeof row] || '')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensor-data-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 20, left: -10, bottom: 0 },
    };

    switch (selectedChartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {activeSensorTypes.map(sensor => (
                <linearGradient key={sensor.key} id={`color${sensor.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sensor.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={sensor.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {activeSensorTypes.map((sensor, index) => (
              <Area
                key={sensor.key}
                type="monotone"
                dataKey={sensor.key}
                stroke={sensor.color}
                fillOpacity={1}
                fill={`url(#color${sensor.key})`}
                name={sensor.label}
                className="neon-glow wave"
                animationDuration={900 + index * 100}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {activeSensorTypes.map((sensor, index) => (
              <Bar
                key={sensor.key}
                dataKey={sensor.key}
                fill={sensor.color}
                name={sensor.label}
                radius={[4, 4, 0, 0]}
                className="neon-glow"
                animationDuration={800 + index * 100}
              />
            ))}
          </BarChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {activeSensorTypes.map((sensor, index) => (
              <Line
                key={sensor.key}
                type="monotone"
                dataKey={sensor.key}
                stroke={sensor.color}
                strokeWidth={3}
                dot={{ fill: sensor.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: sensor.color, strokeWidth: 2 }}
                name={sensor.label}
                className="neon-glow pulse-slow"
                animationDuration={1000 + index * 100}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="neon-card neon-blue bg-gradient-to-br from-white to-slate-50 p-6 rounded-lg shadow-lg border border-gray-100">
      <div className="chart-overlay-line overlay-blue" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Leituras dos Sensores
            {stationId && <span className="text-base text-gray-600 ml-2">- Estação {stationId.slice(-8)}</span>}
          </h3>
          {hasData && (
            <p className="text-sm text-gray-500">
              {totalReadings} leituras • Últimas {chartData.length} exibidas
            </p>
          )}
        </div>
        
        {showControls && (
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {hasData && (
              <button
                onClick={downloadData}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
        {showControls && hasData && (
        <div className="mb-6 space-y-4">
          {/* Time Range Selector */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 mr-2">Período:</span>
            {[
              { value: '1h', label: '1h' },
              { value: '6h', label: '6h' },
              { value: '24h', label: '24h' },
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedTimeRange(range.value as any)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedTimeRange === range.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 mr-2">Tipo:</span>
            {[
              { value: 'line', label: 'Linha' },
              { value: 'area', label: 'Área' },
              { value: 'bar', label: 'Barras' },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedChartType(type.value as any)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  selectedChartType === type.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Sensor Selection */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 mr-2">Sensores:</span>
            {sensorTypes.map((sensor) => (
              <button
                key={sensor.key}
                onClick={() => toggleSensor(sensor.key)}
                className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg border transition-colors ${
                  selectedSensors.has(sensor.key)
                    ? 'bg-white border-gray-300 text-gray-900'
                    : 'bg-gray-100 border-gray-200 text-gray-500'
                }`}
              >
                {getIconForSensor(sensor.key)}
                <span>{sensor.label}</span>
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedSensors.has(sensor.key) ? sensor.color : '#d1d5db' }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(stats).map(([sensorKey, sensorStats]) => {
            const sensor = sensorTypes.find(s => s.key === sensorKey);
            if (!sensor) return null;

            return (
              <div key={sensorKey} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIconForSensor(sensorKey)}
                    <span className="text-sm font-medium text-gray-700">{sensor.label}</span>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: sensor.color }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Atual:</span>
                    <span className="font-semibold" style={{ color: sensor.color }}>
                      {numberFormat(sensorStats.current, sensor.unit)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Média: {numberFormat(sensorStats.avg, sensor.unit)}</span>
                    <span>Min/Max: {numberFormat(sensorStats.min)}/{numberFormat(sensorStats.max)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Chart */}
      <div style={{ width: '100%', height }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Carregando dados...</div>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 mb-2 text-lg font-medium">Nenhum dado disponível</p>
              <p className="text-sm text-gray-400">
                Verifique se há dados disponíveis para o período selecionado
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

// Helper functions
export default SensorReadingsChart;