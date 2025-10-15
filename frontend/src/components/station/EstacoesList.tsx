import React, { useState } from "react";
import { MapPin, Plus } from 'lucide-react';
import ModalCadastroEstacao from "../modals/cadastroEstacaoModal";
import ModalEdicaoEstacao from "../modals/modalEdicaoEstacao";
import ModalExcluirEstacao from "../modals/modalExcluirEstacao";
import { useAuth } from "../../context/AuthContext";
import { useStations } from "../../hooks/stations/useStations";
import Pagination from "../pagination/pagination";
import EstacaoCard from "./estacaoCard";
import type { Station, StationFormData } from '../../interfaces/stations';

const STATIONS_PER_PAGE = 10;

const EstacoesList: React.FC = () => {
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

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [deletingStation, setDeletingStation] = useState<Station | null>(null);

  const handleCreateStation = async (stationData: StationFormData) => {
    try {
      await createStation(stationData);
      setShowCreateModal(false);
    } catch (error: any) {
      alert(error.message || 'Erro ao criar estação');
    }
  };

  const handleUpdateStation = async (stationData: StationFormData) => {
    if (!editingStation) return;
    try {
      await updateStation(editingStation.id, stationData);
      setEditingStation(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar estação');
    }
  };

  const handleDeleteStation = async () => {
    if (!deletingStation) return;
    try {
      await deleteStation(deletingStation.id);
      setDeletingStation(null);
    } catch (error: any) {
      alert(error.message || 'Erro ao excluir estação');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-poppins">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-800 tracking-tight">
                Estações Meteorológicas
              </h1>
              <p className="text-base sm:text-lg text-zinc-600">
                Gerencie e monitore suas estações de coleta de dados
              </p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-slate-900 text-white rounded-lg py-3 px-8 flex items-center gap-2 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm"
              >
                <Plus className="h-5 w-5" />
                Nova Estação
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-lg text-zinc-600">Carregando estações...</div>
          ) : error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : stations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-800 mb-2">
                Nenhuma estação encontrada
              </h3>
              <p className="text-zinc-600">
                {user ? 'Comece criando sua primeira estação meteorológica.' : 'Nenhuma estação disponível no momento.'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {stations.map((station) => (
                  <EstacaoCard
                    key={station.id}
                    station={station}
                    onConfigurarClick={() => setEditingStation(station)}
                    onDeleteClick={() => setDeletingStation(station)}
                    isUserLoggedIn={!!user}
                  />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={changePage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <ModalCadastroEstacao
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateStation}
        />
      )}

      {editingStation && (
        <ModalEdicaoEstacao
          isOpen={!!editingStation}
          onClose={() => setEditingStation(null)}
          onSubmit={handleUpdateStation}
          initialData={{
            name: editingStation.name,
            address: editingStation.address || '',
            macAddress: editingStation.macAddress || '',
            latitude: editingStation.latitude.toString(),
            longitude: editingStation.longitude.toString(),
            description: editingStation.description || '',
            status: editingStation.status,
          }}
        />
      )}

      {deletingStation && (
        <ModalExcluirEstacao
          isOpen={!!deletingStation}
          onClose={() => setDeletingStation(null)}
          onConfirm={handleDeleteStation}
          stationName={deletingStation.name}
        />
      )}
    </div>
  );
};

export default EstacoesList;