// components/modals/ModalHistoricoEstacao.tsx

import React, { useState, useEffect } from 'react';
import { X, Calendar, Thermometer, Droplets, Gauge, AlertTriangle, RefreshCw, CloudRain, Wifi } from 'lucide-react';
import { getSensorReadings } from '../../services/api/sensorReadings';
import type { SensorReading, SensorReadingsResponse } from '../../interfaces/sensor-readings';
import Pagination from '../pagination/pagination';
import { useTheme } from '../../contexts/ThemeContext';

interface ModalHistoricoEstacaoProps {
  isOpen: boolean;
  onClose: () => void;
  stationId: string;
  stationName: string;
  stationMac?: string;
}

const ModalHistoricoEstacao: React.FC<ModalHistoricoEstacaoProps> = ({
  isOpen,
  onClose,
  stationId,
  stationName,
  stationMac,
}) => {
  const { isDarkMode } = useTheme();
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [connectionTested, setConnectionTested] = useState(false);
  const [searchStrategy, setSearchStrategy] = useState<'all' | 'filtered'>('all');

  // Testa a conexão quando o modal abre
  useEffect(() => {
    if (isOpen && !connectionTested) {
      testConnection();
    }
  }, [isOpen]);

  const testConnection = async () => {
    console.log('🧪 Iniciando teste de conexão...');
    try {
      // Try a tiny fetch to validate the sensor-readings endpoint
      await getSensorReadings({ limit: 1 });
      setConnectionTested(true);
      console.log('🧪 Resultado do teste: CONECTADO');
    } catch (err) {
      setConnectionTested(false);
      console.log('🧪 Resultado do teste: FALHOU', err);
    }
  };

  const fetchReadings = async (page: number) => {
    if (!isOpen) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Buscando dados para:', { stationId, stationMac, page });
      
      let response: SensorReadingsResponse;
      let strategy: 'all' | 'filtered' = 'all';

      // Estratégia 1: Tenta buscar com filtros específicos
      try {
        console.log('🎯 Tentando busca filtrada...');
        response = await getSensorReadings({
          page,
          limit: 10,
          stationId,
          macEstacao: stationMac,
        });
        
        // Se retornou dados, usa essa estratégia
        if (response.data && response.data.length > 0) {
          strategy = 'filtered';
          console.log('✅ Busca filtrada retornou dados:', response.data.length);
        } else {
          // Se não retornou dados, busca um conjunto maior sem filtros
          console.log('🔍 Busca filtrada não retornou dados, buscando todos...');
          response = await getSensorReadings({ page, limit: 50 });
        }
      } catch (filterError) {
        console.log('❌ Busca filtrada falhou, buscando todos os dados...');
        response = await getSensorReadings({ page, limit: 50 });
      }

      // Filtra os dados no frontend para mostrar apenas os da estação atual
      const allReadings = response.data || [];
      console.log('📊 Total de registros recebidos:', allReadings.length);
      
      const filteredReadings = allReadings.filter(reading => {
        const matchesStationId = reading.stationId === stationId;
        const matchesUuid = reading.uuidEstacao === stationId;
        const matchesMac = stationMac && reading.macEstacao === stationMac;
        
        return matchesStationId || matchesUuid || matchesMac;
      });

      console.log('🎯 Registros filtrados para esta estação:', filteredReadings.length);

      setReadings(filteredReadings);
      setSearchStrategy(strategy);
      
      // Se estamos filtrando no frontend, ajustamos a paginação
      if (strategy === 'all') {
        setPagination({
          page: 1,
          limit: filteredReadings.length,
          total: filteredReadings.length,
          totalPages: 1,
        });
      } else {
        setPagination(response.pagination || {
          page: 1,
          limit: 10,
          total: filteredReadings.length,
          totalPages: Math.ceil(filteredReadings.length / 10),
        });
      }
      
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar dados históricos';
      setError(errorMessage);
      console.error('❌ Erro completo no fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      fetchReadings(1);
    }
  }, [isOpen, stationId]);

  useEffect(() => {
    if (isOpen && currentPage > 1) {
      fetchReadings(currentPage);
    }
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRetry = () => {
    fetchReadings(currentPage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Função para extrair os valores dos sensores de forma segura
  const getSensorValue = (reading: SensorReading, key: string): string => {
    const value = reading.valor[key as keyof typeof reading.valor];
    if (value === undefined || value === null) return 'N/A';
    return typeof value === 'number' ? value.toFixed(2) : String(value);
  };

  // Detecta quais sensores estão disponíveis nos dados
  const getAvailableSensors = (): string[] => {
    if (readings.length === 0) return [];
    
    const sensors = new Set<string>();
    readings.forEach(reading => {
      Object.keys(reading.valor).forEach(key => {
        sensors.add(key);
      });
    });
    
    return Array.from(sensors);
  };

  const availableSensors = getAvailableSensors();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-zinc-200'}`}>
          <div className="flex items-center gap-3">
            <Calendar className={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-zinc-700'}`} />
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                Histórico de Dados
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                Estação: {stationName}
              </p>
              <div className={`text-xs space-y-1 mt-1 ${isDarkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                <div>ID: {stationId}</div>
                {stationMac && <div>MAC: {stationMac}</div>}
                <div className="flex items-center gap-2">
                  {connectionTested && (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      <span>API Conectada</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRetry}
              disabled={loading}
              className={`p-2 rounded-lg transition-colors duration-300 disabled:opacity-50 ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-100'
              }`}
              title="Recarregar dados"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''} ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-100'
              }`}
            >
              <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className={`h-8 w-8 animate-spin mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
              <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>Carregando dados históricos...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-red-500 text-lg mb-4">Erro ao carregar dados</div>
              <div className={`text-sm mb-4 max-w-md mx-auto ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                {error}
              </div>
              <button
                onClick={handleRetry}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Tentar Novamente
              </button>
            </div>
          ) : readings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-zinc-400'}`} />
              <div className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>Nenhum dado histórico encontrado para esta estação.</div>
              <div className={`text-sm mb-4 max-w-md mx-auto ${isDarkMode ? 'text-gray-400' : 'text-zinc-500'}`}>
                <p className="mb-2">Possíveis causas:</p>
                <ul className="text-left space-y-1">
                  <li>• A estação ainda não enviou dados</li>
                  <li>• Os identificadores (ID/MAC) podem estar diferentes</li>
                  <li>• Os dados podem estar em outra estação</li>
                </ul>
              </div>
              <div className={`mt-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-zinc-400'}`}>
                IDs buscados: {stationId} {stationMac && `| MAC: ${stationMac}`}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={isDarkMode ? 'bg-slate-700' : 'bg-zinc-50'}>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase border-b ${
                      isDarkMode ? 'text-gray-300 border-slate-600' : 'text-zinc-600 border-zinc-200'
                    }`}>
                      Data/Hora
                    </th>
                    {availableSensors.includes('temperatura') && (
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase border-b ${
                        isDarkMode ? 'text-gray-300 border-slate-600' : 'text-zinc-600 border-zinc-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Temperatura
                        </div>
                      </th>
                    )}
                    {availableSensors.includes('umidade') && (
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase border-b ${
                        isDarkMode ? 'text-gray-300 border-slate-600' : 'text-zinc-600 border-zinc-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Umidade
                        </div>
                      </th>
                    )}
                    {availableSensors.includes('chuva') && (
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase border-b ${
                        isDarkMode ? 'text-gray-300 border-slate-600' : 'text-zinc-600 border-zinc-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <CloudRain className="h-4 w-4" />
                          Chuva
                        </div>
                      </th>
                    )}
                    {availableSensors.includes('pressure') && (
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase border-b ${
                        isDarkMode ? 'text-gray-300 border-slate-600' : 'text-zinc-600 border-zinc-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4" />
                          Pressão
                        </div>
                      </th>
                    )}
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase border-b ${
                      isDarkMode ? 'text-gray-300 border-slate-600' : 'text-zinc-600 border-zinc-200'
                    }`}>
                      Alertas
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-zinc-200'}`}>
                  {readings.map((reading) => (
                    <tr key={reading.id} className={`transition-colors duration-200 ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-zinc-50'
                    }`}>
                      <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-zinc-600'}`}>
                        {formatDate(reading.timestamp)}
                      </td>
                      {availableSensors.includes('temperatura') && (
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                          {getSensorValue(reading, 'temperatura')} °C
                        </td>
                      )}
                      {availableSensors.includes('umidade') && (
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                          {getSensorValue(reading, 'umidade')}%
                        </td>
                      )}
                      {availableSensors.includes('chuva') && (
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                          {getSensorValue(reading, 'chuva')} mm
                        </td>
                      )}
                      {availableSensors.includes('pressure') && (
                        <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                          {getSensorValue(reading, 'pressure')} hPa
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm">
                        {reading.alerts.length > 0 ? (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
                          }`}>
                            {reading.alerts.length} alerta(s)
                          </span>
                        ) : (
                          <span className={isDarkMode ? 'text-gray-500' : 'text-zinc-400'}>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`border-t p-4 ${isDarkMode ? 'border-slate-700' : 'border-zinc-200'}`}>
          {!loading && !error && readings.length > 0 && pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalHistoricoEstacao;