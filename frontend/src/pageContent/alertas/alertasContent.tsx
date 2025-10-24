import { AlertTriangle, Settings, Trash2, MapPin, Clock } from 'lucide-react';
import AlertForm from '../../components/alerts/AlertForm';
import ConfirmDelete from '../../components/alerts/ConfirmDelete';
import TipoAlertaModal from '../../components/modals/TipoAlertaModal';
import AlertDetailModal from '../../components/modals/AlertDetailModal';
import { useAuth } from '../../context/AuthContext';
import { useAlertasPage } from '../../hooks/pages/useAlertasPage';

export default function AlertasContent() {
  const { user } = useAuth();
  const {
    // Data
    activeAlerts,
    historyAlerts,
    loading,
    error,
    
    // Form state
    editing,
    form,
    showForm,
    submitting,
    
    // Modal state
    showTipoAlertaModal,
    deletingId,
  detailAlert,
  showDetailModal,
    
    // Actions
    onEdit,
    onDelete,
    onSubmit,
    onConfirmDelete,
    onCancelForm,
    onCancelDelete,
    onFormChange,
    onOpenTipoAlertaModal,
    onCloseTipoAlertaModal
    ,onOpenDetails, onCloseDetails
  } = useAlertasPage();

  return (
    <div className="min-h-screen bg-white font-poppins flex">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-800 tracking-tight">
              Alertas Meteorológicos
            </h1>
            <p className="text-base sm:text-lg text-zinc-600">
              Monitore condições adversas e gerencie notificações
            </p>
          </div>
          {user && (
            <button
              onClick={onOpenTipoAlertaModal}
              className="bg-slate-900 text-white rounded-lg py-3 px-8 flex items-center gap-2 text-base font-semibold hover:bg-slate-800 transition-colors duration-300 shadow-sm cursor-pointer"
            >
              <Settings className="h-5 w-5" />
              Gerenciar Tipos
            </button>
          )}
        </div>

        {/* Active Alerts Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-zinc-700" />
            Alertas Ativos
          </h2>
          {loading ? (
            <div className="text-lg text-zinc-600">Carregando...</div>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : activeAlerts.length === 0 ? (
            <p className="text-sm text-zinc-600">Nenhum alerta ativo.</p>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {activeAlerts.map(a => (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border border-zinc-300 p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-100 rounded-lg p-2">
                      <AlertTriangle className="h-6 w-6 text-zinc-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-zinc-800 truncate">
                        Alerta {a.parameterId}
                      </h3>
                      <p className="text-sm text-zinc-600 truncate">{a.stationId}</p>
                    </div>
                    <div className="bg-blue-500 text-white rounded-full px-3 py-1 text-xs font-semibold">
                      Ativo
                    </div>
                  </div>
                  <p className="text-sm text-zinc-600">
                    <strong>Data:</strong> {a.createdAt.toLocaleString()}
                  </p>
                  {user && (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => onEdit(a)}
                        className="bg-white border border-zinc-400 rounded-lg py-2 px-6 flex items-center gap-2 text-base font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors duration-300 shadow-sm cursor-pointer"
                      >
                        <Settings className="h-5 w-5" />
                        Detalhes
                      </button>
                      <button
                        onClick={() => onDelete(a.id)}
                        className="bg-red-500 text-white rounded-lg py-2 px-6 flex items-center gap-2 text-base font-semibold hover:bg-red-600 transition-colors duration-300 shadow-sm cursor-pointer"
                      >
                        <Trash2 className="h-5 w-5" />
                        Deletar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-zinc-700" />
            Histórico de Alertas
          </h2>
          {historyAlerts.length === 0 ? (
            <p className="text-sm text-zinc-600">Sem histórico de alertas.</p>
          ) : (
            <div className="space-y-4">
              {historyAlerts.map(h => (
                <div
                  key={h.id}
                  className="bg-white rounded-xl border border-zinc-300 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200 w-full"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-zinc-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-semibold text-zinc-800 truncate">
                          {`Alerta ${h.parameterId}`}
                        </h4>
                        <span className="bg-zinc-100 text-zinc-700 rounded-full px-2 py-1 text-xs font-semibold">
                          Resolvido
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                        <span className="flex items-center gap-1 min-w-0 truncate">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{h.stationId}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {user && (
                    <button
                      onClick={() => onOpenDetails(h)}
                      className="bg-white border border-zinc-300 rounded-lg py-2 px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors duration-200"
                    >
                      Ver Detalhes
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <AlertForm
            value={form}
            onChange={onFormChange}
            onCancel={onCancelForm}
            onSubmit={onSubmit}
            submitting={submitting}
            title={editing ? 'Editar Alerta' : 'Novo Alerta'}
          />
        )}

        <ConfirmDelete
          open={!!deletingId}
          onCancel={onCancelDelete}
          onConfirm={onConfirmDelete}
          message="Deseja realmente excluir este alerta?"
        />

        <TipoAlertaModal
          open={showTipoAlertaModal}
          onClose={onCloseTipoAlertaModal}
          onSave={() => {
            // Hook will automatically reload
          }}
        />
        <AlertDetailModal open={showDetailModal} alert={detailAlert} onClose={onCloseDetails} />
      </main>
    </div>
  );
};
