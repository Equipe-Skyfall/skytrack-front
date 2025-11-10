// components/modals/ModalHistoricoEstacao.tsx

import React, { useState, useEffect } from 'react';
import { X, Calendar, Thermometer, Droplets, Gauge, AlertTriangle, RefreshCw, CloudRain, Wifi } from 'lucide-react';
import { getSensorReadings } from '../../services/api/sensorReadings';
import type { SensorReading, SensorReadingsResponse } from '../../interfaces/sensor-readings';
import Pagination from '../pagination/pagination';

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
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-zinc-700" />
            <div>
              <h2 className="text-xl font-bold text-zinc-800">
                Histórico de Dados
              </h2>
              <p className="text-sm text-zinc-600">
                Estação: {stationName}
              </p>
              <div className="text-xs text-zinc-500 space-y-1 mt-1">
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
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors duration-300 disabled:opacity-50"
              title="Recarregar dados"
            >
              <RefreshCw className={`h-5 w-5 text-zinc-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors duration-300"
            >
              <X className="h-5 w-5 text-zinc-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 text-zinc-400 animate-spin mx-auto mb-4" />
              <div className="text-lg text-zinc-600">Carregando dados históricos...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <div className="text-red-500 text-lg mb-4">Erro ao carregar dados</div>
              <div className="text-zinc-600 text-sm mb-4 max-w-md mx-auto">
                {error}
              </div>
              <button
                onClick={handleRetry}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors duration-300"
              >
                Tentar Novamente
              </button>
            </div>
          ) : readings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
              <div className="text-zinc-600 mb-2">Nenhum dado histórico encontrado para esta estação.</div>
              <div className="text-zinc-500 text-sm mb-4 max-w-md mx-auto">
                <p className="mb-2">Possíveis causas:</p>
                <ul className="text-left space-y-1">
                  <li>• A estação ainda não enviou dados</li>
                  <li>• Os identificadores (ID/MAC) podem estar diferentes</li>
                  <li>• Os dados podem estar em outra estação</li>
                </ul>
              </div>
              <div className="mt-4 text-xs text-zinc-400">
                IDs buscados: {stationId} {stationMac && `| MAC: ${stationMac}`}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase border-b">
                      Data/Hora
                    </th>
                    {availableSensors.includes('temperatura') && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase border-b">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4" />
                          Temperatura
                        </div>
                      </th>
                    )}
                    {availableSensors.includes('umidade') && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase border-b">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4" />
                          Umidade
                        </div>
                      </th>
                    )}
                    {availableSensors.includes('chuva') && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase border-b">
                        <div className="flex items-center gap-2">
                          <CloudRain className="h-4 w-4" />
                          Chuva
                        </div>
                      </th>
                    )}
                    {availableSensors.includes('pressure') && (
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase border-b">
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4" />
                          Pressão
                        </div>
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase border-b">
                      Alertas
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {readings.map((reading) => (
                    <tr key={reading.id} className="hover:bg-zinc-50 transition-colors duration-200">
                      <td className="px-4 py-3 text-sm text-zinc-600">
                        {formatDate(reading.timestamp)}
                      </td>
                      {availableSensors.includes('temperatura') && (
                        <td className="px-4 py-3 text-sm text-zinc-800">
                          {getSensorValue(reading, 'temperatura')} °C
                        </td>
                      )}
                      {availableSensors.includes('umidade') && (
                        <td className="px-4 py-3 text-sm text-zinc-800">
                          {getSensorValue(reading, 'umidade')}%
                        </td>
                      )}
                      {availableSensors.includes('chuva') && (
                        <td className="px-4 py-3 text-sm text-zinc-800">
                          {getSensorValue(reading, 'chuva')} mm
                        </td>
                      )}
                      {availableSensors.includes('pressure') && (
                        <td className="px-4 py-3 text-sm text-zinc-800">
                          {getSensorValue(reading, 'pressure')} hPa
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm">
                        {reading.alerts.length > 0 ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            {reading.alerts.length} alerta(s)
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
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
        <div className="border-t border-zinc-200 p-4">
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