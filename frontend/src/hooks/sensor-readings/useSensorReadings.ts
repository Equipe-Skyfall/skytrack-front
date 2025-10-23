import { useState, useEffect, useCallback } from 'react';
import {
  getSensorReadings,
  getStationReadings,
  getLatestReading,
  getAvailableSensorTypes,
  transformToChartData,
  aggregateReadingsByTimestamp,
  searchReadings,
} from '../../services/api/sensor-readings';
import type {
  SensorReading,
  SensorReadingsResponse,
  ReadingsFilters,
  SensorChart,
  SensorType,
} from '../../interfaces/sensor-readings';

export interface UseSensorReadingsResult {
  // Data
  readings: SensorReading[];
  chartData: SensorChart | null;
  sensorTypes: SensorType[];
  pagination: SensorReadingsResponse['pagination'] | null;
  latestReading: SensorReading | null;
  
  // State
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  
  // Actions
  loadReadings: (filters?: ReadingsFilters, forceRefresh?: boolean) => Promise<void>;
  loadStationReadings: (stationId: string, filters?: Omit<ReadingsFilters, 'stationId'>) => Promise<void>;
  loadLatestReading: (stationId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  updateSensorTypes: (types: SensorType[]) => void;
  toggleSensorType: (typeKey: string) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  searchReadings: (searchParams: any) => Promise<void>;
  clearError: () => void;
  clearCache: () => void;
  
  // Computed values
  enabledSensorTypes: SensorType[];
  hasData: boolean;
  totalReadings: number;
}

export const useSensorReadings = (initialFilters?: ReadingsFilters): UseSensorReadingsResult => {
  // Data state
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [chartData, setChartData] = useState<SensorChart | null>(null);
  const [sensorTypes, setSensorTypes] = useState<SensorType[]>([]);
  const [pagination, setPagination] = useState<SensorReadingsResponse['pagination'] | null>(null);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Current filters
  const [currentFilters, setCurrentFilters] = useState<ReadingsFilters>(initialFilters || {});

  // 🚀 CACHE STATE - Simple cache using React State
  const [cache, setCache] = useState<{
    rawData: SensorReading[] | null;
    lastFetch: number | null;
    sensorTypesCache: SensorType[] | null;
  }>({
    rawData: null,
    lastFetch: null,
    sensorTypesCache: null,
  });

  // Cache duration: 30 seconds
  const CACHE_DURATION = 30 * 1000; // 30s

  // Check if cache is still valid
  const isCacheValid = useCallback(() => {
    if (!cache.lastFetch || !cache.rawData) return false;
    const now = Date.now();
    const isValid = (now - cache.lastFetch) < CACHE_DURATION;
    console.log(`🔄 Cache check: ${isValid ? 'VALID' : 'EXPIRED'} (${Math.round((now - cache.lastFetch) / 1000)}s ago)`);
    return isValid;
  }, [cache.lastFetch, cache.rawData]);

  // Load sensor types with cache
  useEffect(() => {
    const loadSensorTypes = async () => {
      try {
        // Use cached sensor types if available
        if (cache.sensorTypesCache) {
          console.log('📊 Using cached sensor types');
          setSensorTypes(cache.sensorTypesCache);
          return;
        }

        console.log('📊 Loading sensor types from API');
        const types = await getAvailableSensorTypes();
        setSensorTypes(types);
        
        // Cache sensor types
        setCache(prev => ({
          ...prev,
          sensorTypesCache: types
        }));
      } catch (err) {
        console.warn('Could not load sensor types from data');
        setSensorTypes([]);
      }
    };
    
    loadSensorTypes();
  }, [cache.sensorTypesCache]);

  // Update chart data when readings or sensor types change
  useEffect(() => {
    if (readings.length > 0) {
      const enabledTypes = sensorTypes.filter(type => type.enabled);
      const newChartData = transformToChartData(readings, enabledTypes);
      setChartData(newChartData);
    } else {
      setChartData(null);
    }
  }, [readings, sensorTypes]);

  // 🚀 Auto-load data on mount
  useEffect(() => {
    const autoLoadData = async () => {
      console.log('🚀 Auto-loading sensor readings on hook mount');
      
      // Check cache first
      if (cache.rawData && isCacheValid()) {
        console.log('📊 Using cached data for auto-load');
        setReadings(cache.rawData);
        return;
      }

      // Load from API if no cache
      setLoading(true);
      setError(null);
      
      try {
        console.log('📊 Fetching sensor readings from API (auto-load)');
        const response = await getSensorReadings();
        
        // Aggregate readings by timestamp to handle duplicate station data
        const aggregatedReadings = aggregateReadingsByTimestamp(response.data);
        console.log(`📊 Auto-loaded and aggregated ${response.data.length} readings into ${aggregatedReadings.length} unique timestamps`);
        
        // Update cache
        setCache(prev => ({
          ...prev,
          rawData: aggregatedReadings,
          lastFetch: Date.now()
        }));
        
        setReadings(aggregatedReadings);
        setPagination(response.pagination);
      } catch (err: any) {
        const errorMessage = err.message || 'Erro ao carregar dados automaticamente';
        setError(errorMessage);
        console.error('Error auto-loading sensor readings:', err);
      } finally {
        setLoading(false);
      }
    };

    // Only auto-load if we don't have data yet and not loading
    if (readings.length === 0 && !loading && !error) {
      autoLoadData();
    }
  }, []); // Empty dependency array - only run on mount

  // Load readings with cache
  const loadReadings = useCallback(async (filters: ReadingsFilters = {}, forceRefresh = false) => {
    const mergedFilters = { ...currentFilters, ...filters };
    setCurrentFilters(mergedFilters);
    
    // 🚀 Check cache first (only for default filters to keep it simple)
    const isDefaultQuery = Object.keys(mergedFilters).length === 0 || 
                          (Object.keys(mergedFilters).length === 1 && mergedFilters.limit);
    
    if (!forceRefresh && isDefaultQuery && isCacheValid()) {
      console.log('📊 Using cached sensor readings');
      
      // Apply client-side filtering to cached data
      let cachedReadings = cache.rawData!;
      
      // Apply filters to cached data
      if (mergedFilters.stationId) {
        cachedReadings = cachedReadings.filter(reading => reading.stationId === mergedFilters.stationId);
      }
      
      if (mergedFilters.macEstacao) {
        cachedReadings = cachedReadings.filter(reading => reading.macEstacao === mergedFilters.macEstacao);
      }
      
      // Apply pagination
      const page = mergedFilters.page || 1;
      const limit = mergedFilters.limit || 100;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedReadings = cachedReadings.slice(startIndex, endIndex);
      
      setReadings(paginatedReadings);
      setPagination({
        page,
        limit,
        total: cachedReadings.length,
        totalPages: Math.ceil(cachedReadings.length / limit)
      });
      return;
    }

    // 📡 Fetch from API
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Fetching sensor readings from API with filters:', mergedFilters);
      
      const response = await getSensorReadings(mergedFilters);
      
      // Aggregate readings by timestamp to handle duplicate station data
      const aggregatedReadings = aggregateReadingsByTimestamp(response.data);
      console.log(`📊 Aggregated ${response.data.length} readings into ${aggregatedReadings.length} unique timestamps`);
      
      // 💾 Update cache only for default queries
      if (isDefaultQuery) {
        console.log('💾 Caching sensor readings');
        setCache(prev => ({
          ...prev,
          rawData: aggregatedReadings,
          lastFetch: Date.now()
        }));
      }
      
      setReadings(aggregatedReadings);
      setPagination(response.pagination);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar leituras do sensor';
      setError(errorMessage);
      console.error('Error loading sensor readings:', err);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, cache.rawData, cache.lastFetch, isCacheValid]);

  // Load readings for specific station
  const loadStationReadings = useCallback(async (
    stationId: string, 
    filters: Omit<ReadingsFilters, 'stationId'> = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏭 Loading station readings for:', stationId);
      
      const response = await getStationReadings(stationId, filters);
      
      // Aggregate readings by timestamp to handle duplicate station data
      const aggregatedReadings = aggregateReadingsByTimestamp(response.data);
      console.log(`🏭 Aggregated ${response.data.length} station readings into ${aggregatedReadings.length} unique timestamps`);
      
      setReadings(aggregatedReadings);
      setPagination(response.pagination);
      setCurrentFilters({ ...filters, stationId });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar leituras da estação';
      setError(errorMessage);
      console.error('Error loading station readings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load latest reading for a station
  const loadLatestReading = useCallback(async (stationId: string) => {
    try {
      console.log('🔄 Loading latest reading for station:', stationId);
      
      const reading = await getLatestReading(stationId);
      setLatestReading(reading);
    } catch (err: any) {
      console.error('Error loading latest reading:', err);
      // Don't set error for latest reading failure
    }
  }, []);

  // Refresh current data (force cache refresh)
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    console.log('🔄 Force refreshing data - clearing cache');
    
    // Clear cache
    setCache({
      rawData: null,
      lastFetch: null,
      sensorTypesCache: null,
    });
    
    try {
      await loadReadings(currentFilters, true); // force refresh
    } finally {
      setRefreshing(false);
    }
  }, [loadReadings, currentFilters]);

  // Update sensor types configuration
  const updateSensorTypes = useCallback((types: SensorType[]) => {
    setSensorTypes(types);
  }, []);

  // Toggle specific sensor type
  const toggleSensorType = useCallback((typeKey: string) => {
    setSensorTypes(prev => 
      prev.map(type => 
        type.key === typeKey 
          ? { ...type, enabled: !type.enabled }
          : type
      )
    );
  }, []);

  // Set date range filter
  const setDateRange = useCallback(async (startDate: string, endDate: string) => {
    const newFilters = { ...currentFilters, startDate, endDate };
    await loadReadings(newFilters);
  }, [currentFilters, loadReadings]);

  // Search readings with complex criteria
  const handleSearchReadings = useCallback(async (searchParams: any) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Searching readings with params:', searchParams);
      
      const response = await searchReadings(searchParams);
      
      // Aggregate readings by timestamp to handle duplicate station data
      const aggregatedReadings = aggregateReadingsByTimestamp(response.data);
      console.log(`🔍 Aggregated ${response.data.length} search results into ${aggregatedReadings.length} unique timestamps`);
      
      setReadings(aggregatedReadings);
      setPagination(response.pagination);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar leituras';
      setError(errorMessage);
      console.error('Error searching readings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear cache manually
  const clearCache = useCallback(() => {
    console.log('🗑️ Manual cache clear');
    setCache({
      rawData: null,
      lastFetch: null,
      sensorTypesCache: null,
    });
  }, []);

  // Computed values
  const enabledSensorTypes = sensorTypes.filter(type => type.enabled);
  const hasData = readings.length > 0;
  const totalReadings = pagination?.total || 0;

  // Debug logging
  console.log('🔍 useSensorReadings Debug:', {
    readingsCount: readings.length,
    hasData,
    loading,
    error,
    sensorTypesCount: sensorTypes.length,
    cacheValid: isCacheValid(),
    cacheData: cache.rawData?.length || 0
  });

  return {
    // Data
    readings,
    chartData,
    sensorTypes,
    pagination,
    latestReading,
    
    // State
    loading,
    error,
    refreshing,
    
    // Actions
    loadReadings,
    loadStationReadings,
    loadLatestReading,
    refreshData,
    updateSensorTypes,
    toggleSensorType,
    setDateRange,
    searchReadings: handleSearchReadings,
    clearError,
    clearCache,
    
    // Computed values
    enabledSensorTypes,
    hasData,
    totalReadings,
  };
};

export default useSensorReadings;