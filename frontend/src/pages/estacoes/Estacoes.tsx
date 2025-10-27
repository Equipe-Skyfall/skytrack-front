import React, { useState, useEffect } from 'react';

import type { Station } from '../../interfaces/stations';
import Estacao from '../../components/station/estacaoCard';

const Estacoes: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // TODO: Replace with real API call
        // const response = await getStations();
        // setStations(response.data);
        
        // For now, provide empty array to avoid mock data
        setStations([]);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar estações');
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg text-zinc-600">Carregando estações...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg text-red-600">Erro: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Estacao />
      {/* TODO: Pass stations data to component when API is connected */}
      {/* <EstacoesList stations={stations} /> */}
    </div>
  );
};

export default Estacoes;