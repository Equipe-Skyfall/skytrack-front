import apiClient from './axios';
import type { 
  SensorReading, 
  SensorReadingsResponse, 
  ReadingsFilters,
  ChartDataPoint,
  SensorChart,
  SensorType
} from '../../interfaces/sensor-readings';

// Cache para evitar múltiplas requisições
let cachedReadings: SensorReading[] | null = null;
let cachedSensorTypes: SensorType[] | null = null;
let lastFetchTime: number = 0;
let ongoingRequest: Promise<SensorReading[]> | null = null; // Prevent multiple simultaneous requests
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Clear cache manually
 */
export function clearCache(): void {
  cachedReadings = null;
  cachedSensorTypes = null;
  lastFetchTime = 0;
  ongoingRequest = null;
  console.log('🗑️ Cache cleared');
}

/**
 * Check if cache is still valid
 */
function isCacheValid(): boolean {
  return cachedReadings !== null && (Date.now() - lastFetchTime) < CACHE_DURATION;
}

/**
 * Fetch fresh data from API (internal function)
 */
async function fetchFreshData(): Promise<SensorReading[]> {
  if (ongoingRequest) {
    console.log('⏳ Request already in progress, waiting...');
    return ongoingRequest;
  }

  ongoingRequest = (async () => {
    try {
      console.log('🌐 Fetching fresh data from API');
      const response = await apiClient.get('/api/sensor-readings');
      const readings = response.data.data || response.data || [];
      
      // Update cache
      cachedReadings = readings;
      lastFetchTime = Date.now();
      console.log(`💾 Cached ${readings.length} readings`);
      
      return readings;
    } finally {
      ongoingRequest = null;
    }
  })();

  return ongoingRequest;
}

/**
 * Get sensor readings - using cache to avoid multiple requests
 */
export async function getSensorReadings(filters: ReadingsFilters = {}): Promise<SensorReadingsResponse> {
  console.log('📊 getSensorReadings called - checking cache first');
  
  let readings: SensorReading[];
  
  // Use cache if valid
  if (isCacheValid()) {
    console.log('💾 Using cached readings data');
    readings = cachedReadings!;
  } else {
    readings = await fetchFreshData();
  }
  
  let filteredReadings = [...readings]; // Create copy to avoid mutating cache
  
  // Apply client-side filtering if needed
  if (filters.stationId) {
    filteredReadings = filteredReadings.filter((reading: SensorReading) => reading.stationId === filters.stationId);
  }
  
  if (filters.macEstacao) {
    filteredReadings = filteredReadings.filter((reading: SensorReading) => reading.macEstacao === filters.macEstacao);
  }
  
  // Apply date filtering on client side
  if (filters.startDate || filters.endDate) {
    filteredReadings = filteredReadings.filter((reading: SensorReading) => {
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
  const aggregatedReadings = aggregateReadingsByTimestamp(filteredReadings);
  console.log(`📊 Aggregated ${filteredReadings.length} readings into ${aggregatedReadings.length} unique timestamps`);
  
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
  
  // The data is already aggregated by timestamp in getSensorReadings
  // For time period aggregation, we would need more complex logic here
  // For now, return the timestamp-aggregated data
  return response;
}

/**
 * Get available sensor types - using cache to avoid multiple requests
 */
export async function getAvailableSensorTypes(): Promise<SensorType[]> {
  try {
    // Use cached sensor types if available
    if (cachedSensorTypes !== null) {
      console.log('💾 Using cached sensor types');
      return cachedSensorTypes;
    }
    
    console.log('📊 Getting available sensor types from main readings');
    
    // Try to get sensor types from actual data
    const response = await getSensorReadings({ limit: 10 });
    
    if (response.data && response.data.length > 0) {
      // Extract unique sensor keys from actual data
      const sensorKeys = new Set<string>();
      response.data.forEach(reading => {
        Object.keys(reading.valor).forEach(key => sensorKeys.add(key));
      });
      
      // Map to sensor types with defaults
      const detectedTypes: SensorType[] = Array.from(sensorKeys).map(key => {
        const defaultType = getDefaultSensorTypes().find(t => t.key === key);
        return defaultType || {
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          unit: '',
          color: '#6b7280',
          enabled: true
        };
      });
      
      console.log('📊 Detected sensor types from data:', detectedTypes.map(t => t.key));
      
      // Cache the sensor types
      cachedSensorTypes = detectedTypes;
      
      return detectedTypes;
    }
    
    const defaultTypes = getDefaultSensorTypes();
    cachedSensorTypes = defaultTypes;
    return defaultTypes;
  } catch (error) {
    console.warn('Could not fetch sensor types from data, using defaults');
    const defaultTypes = getDefaultSensorTypes();
    cachedSensorTypes = defaultTypes;
    return defaultTypes;
  }
}

/**
 * Default sensor types configuration
 */
export function getDefaultSensorTypes(): SensorType[] {
  return [
    {
      key: 'temperatura',
      label: 'Temperatura',
      unit: '°C',
      color: '#ef4444', // red
      enabled: true,
    },
    {
      key: 'umidade',
      label: 'Umidade',
      unit: '%',
      color: '#3b82f6', // blue
      enabled: true,
    },
    {
      key: 'chuva',
      label: 'Chuva',
      unit: 'mm',
      color: '#10b981', // green
      enabled: true,
    },
  ];
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
  getDefaultSensorTypes,
  transformToChartData,
  transformToDataPoints,
  aggregateReadingsByTimestamp,
  getReadingsByDateRange,
  searchReadings,
  clearCache,
};