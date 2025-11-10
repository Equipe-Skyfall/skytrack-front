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

  const loadStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // getStations returns an array directly (no pagination params)
      const response: any = await getStations();

      let list: StationDto[] = [];
      let newPagination: PaginationData | undefined;

      if (response && Array.isArray(response)) {
        list = response as StationDto[];
      } else if (response && response.data && Array.isArray(response.data)) {
        list = response.data as StationDto[];
        newPagination = response.pagination;
      }

      // Map StationDto -> Station by adding UI helpers
      const processedStations = list.map((s: any) => ({
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
  }, []);

  const handleCreateStation = async (stationData: StationFormData): Promise<StationDto> => {
    const newStation = await createStation(stationData as any);
    await loadStations(); // Reload
    return newStation as any;
  };

  const handleUpdateStation = async (id: string, stationData: Partial<StationFormData>): Promise<StationDto> => {
    const updatedStation = await updateStation(id, stationData as any);
    await loadStations(); // Reload
    return updatedStation as any;
  };

  const handleDeleteStation = async (id: string): Promise<void> => {
    await deleteStation(id);
    await loadStations(); // Reload
  };

  const changePage = () => {
    loadStations();
  };

  useEffect(() => {
    loadStations();
  }, [loadStations]);

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