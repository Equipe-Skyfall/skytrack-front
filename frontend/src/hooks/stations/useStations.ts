import { useState, useEffect, useCallback } from 'react';
import { 
  getStations, 
  createStation, 
  updateStation, 
  deleteStation
} from '../../services/api/stations';
import type { 
  Station, 
  StationDto, 
  StationFormData, 
  PaginationData 
} from '../../interfaces/stations';

export const useStations = (initialPage = 1, limit = 10) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: initialPage,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStations = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // getStations was refactored to sometimes return a raw array or an envelope { data, pagination }
      const response: any = await getStations(page, limit);

      let list: StationDto[] = [];
      let newPagination: PaginationData | undefined;

      if (response && Array.isArray(response)) {
        list = response as StationDto[];
      } else if (response && response.data && Array.isArray(response.data)) {
        list = response.data as StationDto[];
        newPagination = response.pagination;
      }

      // Map StationDto -> Station by adding UI helpers
      const processedStations = list.map((s: StationDto) => ({
        ...s,
        statusColor: s.status === 'ACTIVE' ? 'green' : 'gray',
      }));

      setStations(processedStations as Station[]);
      if (newPagination) setPagination(newPagination);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar estações');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const handleCreateStation = async (stationData: StationFormData): Promise<StationDto> => {
    try {
      const newStation = await createStation(stationData);
      await loadStations(pagination.page); // Reload current page
      return newStation;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateStation = async (id: string, stationData: Partial<StationFormData>): Promise<StationDto> => {
    try {
      const updatedStation = await updateStation(id, stationData);
      await loadStations(pagination.page); // Reload current page
      return updatedStation;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteStation = async (id: string): Promise<void> => {
    try {
      await deleteStation(id);
      await loadStations(pagination.page); // Reload current page
    } catch (error) {
      throw error;
    }
  };

  const changePage = (page: number) => {
    loadStations(page);
  };

  useEffect(() => {
    loadStations(initialPage);
  }, [loadStations, initialPage]);

  return {
    stations,
    pagination,
    loading,
    error,
    loadStations,
    createStation: handleCreateStation,
    updateStation: handleUpdateStation,
    deleteStation: handleDeleteStation,
    changePage,
  };
};