import apiClient from './axios';
import type { 
  SensorReading, 
  SensorReadingsResponse, 
  ReadingsFilters,
  ChartDataPoint,
  SensorChart,
  SensorType
} from '../../interfaces/sensor-readings';

export async function getSensorReadings(filters: ReadingsFilters = {}): Promise<SensorReadingsResponse> {

  
  // Only use the available sensor-readings route without filters to avoid timeout
  const response = await apiClient.get('/api/sensor-readings');
  
  let readings: SensorReading[] = response.data.data || response.data || [];
  
  // Apply client-side filtering if needed
  if (filters.stationId) {
    readings = readings.filter((reading: SensorReading) => reading.stationId === filters.stationId);
  }
  
  if (filters.macEstacao) {
    readings = readings.filter((reading: SensorReading) => reading.macEstacao === filters.macEstacao);
  }
  
  // Apply date filtering on client side
  if (filters.startDate || filters.endDate) {
    readings = readings.filter((reading: SensorReading) => {
      const readingDate = new Date(reading.timestamp);
      
      if (filters.startDate && readingDate < new Date(filters.startDate)) {
        return false;
      }
      
      if (filters.endDate && readingDate > new Date(filters.endDate)) {
        return false;
      }
      
      return true;
    });
  }
  
  // Aggregate readings by timestamp to handle duplicate data
  const aggregatedReadings = aggregateReadingsByTimestamp(readings);
 
  
  // Apply pagination on aggregated data
  const page = filters.page || 1;
  const limit = filters.limit || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedReadings = aggregatedReadings.slice(startIndex, endIndex);
  
  return {
    data: paginatedReadings,
    pagination: {
      page,
      limit,
      total: aggregatedReadings.length,
      totalPages: Math.ceil(aggregatedReadings.length / limit)
    }
  };
}

/**
 * Get sensor readings for a specific station
 */
export async function getStationReadings(
  stationId: string, 
  filters: Omit<ReadingsFilters, 'stationId'> = {}
): Promise<SensorReadingsResponse> {
  return getSensorReadings({ ...filters, stationId });
}

/**
 * Get sensor readings by MAC address
 */
export async function getReadingsByMac(
  macAddress: string, 
  filters: Omit<ReadingsFilters, 'macEstacao'> = {}
): Promise<SensorReadingsResponse> {
  return getSensorReadings({ ...filters, macEstacao: macAddress });
}

/**
 * Get latest reading for a station - using main route and client-side filtering
 */
export async function getLatestReading(stationId: string): Promise<SensorReading | null> {
  try {
    console.log('🔄 Getting latest reading for station via main route:', stationId);
    const response = await getSensorReadings({ stationId });
    
    if (!response.data || response.data.length === 0) {
      return null;
    }
    
    // Sort by timestamp and get the most recent
    const sortedReadings = response.data.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return sortedReadings[0];
  } catch (error) {
    console.error('Error getting latest reading:', error);
    return null;
  }
}

/**
 * Get readings aggregated by time period - using main route with client-side aggregation
 */
export async function getAggregatedReadings(
  stationId: string,
  period: 'hour' | 'day' | 'week' | 'month',
  startDate?: string,
  endDate?: string
): Promise<SensorReadingsResponse> {
  console.log(`📊 Getting aggregated readings for station ${stationId} by ${period}`);
  
  // Get all readings for the station
  const filters: ReadingsFilters = { stationId };
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  
  const response = await getSensorReadings(filters);
  
 
  return response;
}

/**
 * Get available sensor types - dynamically from actual data
 */
export async function getAvailableSensorTypes(): Promise<SensorType[]> {
  try {
    console.log('📊 Getting available sensor types from actual data');
    
    // Get actual data to detect sensors
    const response = await getSensorReadings({ limit: 50 });
    
    if (response.data && response.data.length > 0) {
      // Extract unique sensor keys from actual data
      const sensorKeys = new Set<string>();
      response.data.forEach(reading => {
        Object.keys(reading.valor).forEach(key => sensorKeys.add(key));
      });
      
      // Generate sensor types dynamically with random colors
      const detectedTypes: SensorType[] = Array.from(sensorKeys).map(key => 
        generateSensorTypeFromKey(key)
      );
      
      console.log('📊 Detected sensor types from data:', detectedTypes.map(t => `${t.key} (${t.label})`));
      return detectedTypes;
    }
    
    // If no data available, return empty array instead of mocked data
    console.warn('No sensor data available, returning empty sensor types');
    return [];
  } catch (error) {
    console.error('Error fetching sensor types from data:', error);
    // Return empty array instead of fallback to mocked data
    return [];
  }
}

/**
 * Generate a random color for sensors
 */
function generateRandomColor(): string {
  const colors = [
    '#ef4444', // red
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#f97316', // orange
    '#84cc16', // lime
    '#ec4899', // pink
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#f43f5e', // rose
    '#a855f7', // violet
    '#22c55e', // emerald
    '#eab308', // amber
    '#64748b', // slate
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Generate sensor type configuration from sensor key
 */
function generateSensorTypeFromKey(key: string): SensorType {
  // NO MOCKED DATA - completely dynamic
  // Just capitalize the first letter of the key as label
  const label = key.charAt(0).toUpperCase() + key.slice(1);
  
  // No predefined units - leave empty for user to see raw sensor names
  const unit = '';

  return {
    key,
    label,
    unit,
    color: generateRandomColor(),
    enabled: true,
  };
}

/**
 * Transform sensor readings into chart data
 */
export function transformToChartData(
  readings: SensorReading[], 
  enabledSensorTypes: SensorType[]
): SensorChart {
  const enabledTypes = enabledSensorTypes.filter(type => type.enabled);
  
  // Extract timestamps (labels)
  const labels = readings.map(reading => 
    new Date(reading.timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  );

  // Create datasets for each enabled sensor type
  const datasets = enabledTypes.map(sensorType => {
    const data = readings.map(reading => 
      reading.valor[sensorType.key] || 0
    );

    return {
      label: sensorType.label,
      data,
      borderColor: sensorType.color,
      backgroundColor: sensorType.color + '20', // Add transparency
      unit: sensorType.unit,
    };
  });

  return {
    labels,
    datasets,
  };
}

/**
 * Transform readings to data points for custom charts
 */
export function transformToDataPoints(readings: SensorReading[]): ChartDataPoint[] {
  return readings.map(reading => ({
    timestamp: reading.timestamp,
    ...reading.valor,
  }));
}

/**
 * Aggregate readings by timestamp for duplicate station data
 * Groups readings by timestamp and averages values for the same timestamps
 */
export function aggregateReadingsByTimestamp(readings: SensorReading[]): SensorReading[] {
  if (!readings || readings.length === 0) return [];

  // Group readings by timestamp
  const grouped = readings.reduce((acc, reading) => {
    const timestamp = reading.timestamp;
    if (!acc[timestamp]) {
      acc[timestamp] = [];
    }
    acc[timestamp].push(reading);
    return acc;
  }, {} as { [timestamp: string]: SensorReading[] });

  // Aggregate readings for each timestamp
  return Object.entries(grouped).map(([, groupedReadings]) => {
    if (groupedReadings.length === 1) {
      return groupedReadings[0];
    }

    // Calculate averages for each sensor value
    const aggregatedValor: { [key: string]: number } = {};
    const allKeys = new Set<string>();
    
    // Collect all possible sensor keys
    groupedReadings.forEach(reading => {
      Object.keys(reading.valor).forEach(key => allKeys.add(key));
    });

    // Calculate average for each sensor type
    allKeys.forEach(key => {
      const values = groupedReadings
        .map(reading => reading.valor[key])
        .filter((val): val is number => val !== undefined && val !== null && !isNaN(val));
      
      if (values.length > 0) {
        aggregatedValor[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });

    // Use data from first reading as base, but with aggregated values
    const firstReading = groupedReadings[0];
    return {
      ...firstReading,
      valor: aggregatedValor,
      // Add metadata about aggregation
      _aggregated: {
        count: groupedReadings.length,
        stationIds: [...new Set(groupedReadings.map(r => r.stationId || ''))].filter(Boolean),
        macAddresses: [...new Set(groupedReadings.map(r => r.macEstacao || ''))].filter(Boolean)
      }
    } as SensorReading & { _aggregated: any };
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Get readings for a specific date range with pagination
 */
export async function getReadingsByDateRange(
  startDate: string,
  endDate: string,
  page = 1,
  limit = 100,
  stationId?: string
): Promise<SensorReadingsResponse> {
  const filters: ReadingsFilters = {
    startDate,
    endDate,
    page,
    limit,
  };
  
  if (stationId) {
    filters.stationId = stationId;
  }

  return getSensorReadings(filters);
}

/**
 * Search readings by multiple criteria - using main route with client-side filtering
 */
export async function searchReadings(searchParams: {
  stationIds?: string[];
  macAddresses?: string[];
  parameterTypes?: string[];
  startDate?: string;
  endDate?: string;
  minValues?: { [key: string]: number };
  maxValues?: { [key: string]: number };
  page?: number;
  limit?: number;
}): Promise<SensorReadingsResponse> {
  console.log('🔍 Searching readings with client-side filtering:', searchParams);
  
  // Get all readings first
  const response = await getSensorReadings({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    page: searchParams.page,
    limit: searchParams.limit
  });
  
  let filteredReadings = response.data;
  
  // Apply additional client-side filters
  if (searchParams.stationIds?.length) {
    filteredReadings = filteredReadings.filter(reading => 
      searchParams.stationIds!.includes(reading.stationId || '')
    );
  }
  
  if (searchParams.macAddresses?.length) {
    filteredReadings = filteredReadings.filter(reading => 
      searchParams.macAddresses!.includes(reading.macEstacao || '')
    );
  }
  
  // Apply value range filters
  if (searchParams.minValues || searchParams.maxValues) {
    filteredReadings = filteredReadings.filter(reading => {
      for (const [key, value] of Object.entries(reading.valor)) {
        if (typeof value === 'number') {
          if (searchParams.minValues?.[key] !== undefined && value < searchParams.minValues[key]) {
            return false;
          }
          if (searchParams.maxValues?.[key] !== undefined && value > searchParams.maxValues[key]) {
            return false;
          }
        }
      }
      return true;
    });
  }
  
  return {
    ...response,
    data: filteredReadings,
    pagination: {
      ...response.pagination!,
      total: filteredReadings.length,
      totalPages: Math.ceil(filteredReadings.length / (searchParams.limit || 100))
    }
  };
}

export default {
  getSensorReadings,
  getStationReadings,
  getReadingsByMac,
  getLatestReading,
  getAggregatedReadings,
  getAvailableSensorTypes,
  transformToChartData,
  transformToDataPoints,
  aggregateReadingsByTimestamp,
  getReadingsByDateRange,
  searchReadings,
};