import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStations } from '../stations/useStations';
import type { Station, StationFormData } from '../../interfaces/stations';

const STATIONS_PER_PAGE = 10;

export const useEstacoesPage = () => {
  const { user } = useAuth();
  const {
    stations,
    pagination,
    loading,
    error,
    createStation,
    updateStation,
    deleteStation,
    changePage,
  } = useStations(1, STATIONS_PER_PAGE);

  // Estado da página
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [deletingStation, setDeletingStation] = useState<Station | null>(null);

  // Handlers da página
  const onOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const onCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const onCreateStation = async (stationData: StationFormData) => {
    try {
      await createStation(stationData);
      setShowCreateModal(false);
    } catch (error: any) {
      alert(error.message || 'Erro ao criar estação');
      throw error;
    }
  };

  const onEditStation = (station: Station) => {
    setEditingStation(station);
  };

  const onCloseEditModal = () => {
    setEditingStation(null);
  };

  const onUpdateStation = async (stationData: StationFormData) => {
    if (!editingStation) return;
    try {
      await updateStation(editingStation.id, stationData);
      setEditingStation(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar estação');
      throw error;
    }
  };

  const onDeleteStation = (station: Station) => {
    setDeletingStation(station);
  };

  const onCloseDeleteModal = () => {
    setDeletingStation(null);
  };

  const onConfirmDeleteStation = async () => {
    if (!deletingStation) return;
    try {
      await deleteStation(deletingStation.id);
      setDeletingStation(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir estação');
      throw error;
    }
  };

  // Computed values
  const hasStations = stations.length > 0;
  const hasMultiplePages = pagination.totalPages > 1;
  const editingStationFormData = editingStation ? {
    name: editingStation.name,
    address: editingStation.address || '',
    macAddress: editingStation.macAddress || '',
    latitude: editingStation.latitude.toString(),
    longitude: editingStation.longitude.toString(),
    description: editingStation.description || '',
    status: editingStation.status,
  } : null;

  return {
    // Estado dos dados
    user,
    stations,
    pagination,
    loading,
    error,
    
    // Estado da UI
    showCreateModal,
    editingStation,
    deletingStation,
    
    // Handlers
    onOpenCreateModal,
    onCloseCreateModal,
    onCreateStation,
    onEditStation,
    onCloseEditModal,
    onUpdateStation,
    onDeleteStation,
    onCloseDeleteModal,
    onConfirmDeleteStation,
    changePage,
    
    // Computed values
    hasStations,
    hasMultiplePages,
    editingStationFormData,
  };
};