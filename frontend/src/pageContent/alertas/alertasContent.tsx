import { AlertTriangle, Settings, Check, MapPin, Clock } from 'lucide-react';
import AlertForm from '../../components/alerts/AlertForm';
import ConfirmDelete from '../../components/alerts/ConfirmDelete';
import TipoAlertaModal from '../../components/modals/TipoAlertaModal';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlertasPage } from '../../hooks/pages/useAlertasPage';

export default function AlertasContent() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const {
    activeAlerts,
    historyAlerts,
    loading,
    error,
    
    editing,
    form,
    showForm,
    submitting,
    
    showTipoAlertaModal,
    deletingId,
    
  onResolve,
    onSubmit,
    onConfirmDelete,
    onCancelForm,
    onCancelDelete,
    onFormChange,
    onOpenTipoAlertaModal,
    onCloseTipoAlertaModal
  } = useAlertasPage(); 

  return (
    <div className="min-h-screen font-poppins flex">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <h1 className={`text-3xl font-bold font-poppins ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
              Alertas Meteorológicos
            </h1>
            <p className={`text-base sm:text-lg font-poppins ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
              Monitore condições adversas e gerencie notificações
            </p>
          </div>
          {user && (
            <button
              onClick={onOpenTipoAlertaModal}
              className={`rounded-lg py-3 px-8 flex items-center gap-2 text-base font-semibold font-poppins transition-colors duration-300 shadow-sm cursor-pointer ${
                isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="h-5 w-5" />
              Gerenciar Tipos
            </button>
          )}
        </div>

        <div className="space-y-6">
          <h2 className={`text-xl font-bold font-poppins flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-zinc-800'
          }`}>
            <AlertTriangle className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-zinc-700'}`} />
            Alertas Ativos
          </h2>
          {loading ? (
            <div className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-zinc-600'}`}>Carregando...</div>
          ) : error ? (
            <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
          ) : activeAlerts.length === 0 ? (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-zinc-600'}`}>Nenhum alerta ativo.</p>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {activeAlerts.map(a => (
                <div
                  key={a.id}
                  className={`rounded-xl border p-6 space-y-4 shadow-md hover:shadow-lg transition-shadow duration-300 w-full ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-white border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-2 ${isDarkMode ? 'bg-slate-700' : 'bg-zinc-100'}`}>
                      <AlertTriangle className={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-zinc-700'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                        {(a as any).alert_name || (a as any).tipoAlerta?.tipo || `Alerta ${a.tipoAlertaId}`}
                      </h3>
                      <p className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                        {(a as any).station?.name || a.stationId}
                      </p>
                    </div>
                    <div className="bg-slate-900 text-white rounded-full px-3 py-1 text-xs font-semibold">
                      Ativo
                    </div>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                    <strong>Data:</strong> {new Date(a.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {user && (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => onResolve(a.id)}
                        className={`rounded-lg py-2 px-8 flex items-center gap-2 text-base font-semibold transition-colors duration-300 shadow-sm cursor-pointer w-44 justify-center ${
                          isDarkMode
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                        aria-label={`Resolver alerta ${a.id}`}
                      >
                        <Check className="h-5 w-5" />
                        Resolver
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
            <AlertTriangle className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-zinc-700'}`} />
            Histórico de Alertas
          </h2>
          {historyAlerts.length === 0 ? (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-zinc-600'}`}>Sem histórico de alertas.</p>
          ) : (
            <div className="space-y-4">
              {historyAlerts.map(h => (
                <div
                  key={h.id}
                  className={`rounded-xl border p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200 w-full ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-white border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`border rounded-lg p-3 flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600' 
                        : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <AlertTriangle className={`h-6 w-6 ${isDarkMode ? 'text-gray-400' : 'text-zinc-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className={`text-base font-semibold truncate ${
                          isDarkMode ? 'text-white' : 'text-zinc-800'
                        }`}>
                          {(h as any).alert_name || (h as any).tipoAlerta?.tipo || `Alerta ${h.tipoAlertaId}`}
                        </h4>
                        { /* <span className="bg-zinc-100 text-zinc-700 rounded-full px-2 py-1 text-xs font-semibold">
                          Resolvido
                        </span>   */}
                      </div>
                      <div className={`flex items-center gap-3 mt-2 text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-zinc-500'
                      }`}>
                        <span className="flex items-center gap-1 min-w-0 truncate">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{(h as any).station?.name || h.stationId}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(h.createdAt).toLocaleDateString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit',
                            year: 'numeric'
                          })} às {new Date(h.createdAt).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {user && (
                    <button
                      onClick={() => onResolve(h.id)}
                      className={`rounded-lg py-2 px-4 text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                        isDarkMode
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      }`}
                      title="Reativar alerta"
                    >
                      <Check className="h-4 w-4" />
                      Reativar
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
          }}
        />
      </main>
    </div>
  );
};
