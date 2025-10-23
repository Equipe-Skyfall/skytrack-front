// services/api/sensorReadings.ts

// URL fixa como fallback
const SENSOR_READINGS_URL = import.meta.env.VITE_SENSOR_READINGS_URL || 'https://sky-track-backend-7v0vxhv9c-fabios-projects-ee9987e5.vercel.app';

export interface SensorReadingsParams {
  page?: number;
  limit?: number;
  stationId?: string;
  macEstacao?: string;
}

export async function getSensorReadings(params: SensorReadingsParams = {}) {
  try {
    const { page = 1, limit = 10, stationId, macEstacao } = params;
    
    // URL base fixa para debug
    const baseUrl = SENSOR_READINGS_URL;
    console.log('🔧 URL base configurada:', baseUrl);
    
    let url = `${baseUrl}/api/sensor-readings?page=${page}&limit=${limit}`;
    
    // Adiciona parâmetros de filtro
    const searchParams = new URLSearchParams();
    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());
    
    if (stationId) {
      searchParams.append('stationId', stationId);
    }
    if (macEstacao) {
      searchParams.append('macEstacao', macEstacao);
    }
    
    url = `${baseUrl}/api/sensor-readings?${searchParams.toString()}`;
    
    console.log('📊 URL completa da requisição:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('📡 Status da resposta:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro da API:', errorText);
      throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Dados recebidos com sucesso');
    console.log('📊 Quantidade de registros:', data.data?.length || 0);
    
    return data;
  } catch (error) {
    console.error('❌ Erro completo na requisição:', error);
    throw error;
  }
}

// Função específica para buscar por MAC address
export async function getSensorReadingsByMac(macAddress: string, page: number = 1, limit: number = 10) {
  const baseUrl = SENSOR_READINGS_URL;
  const url = `${baseUrl}/api/sensor-readings?macEstacao=${macAddress}&page=${page}&limit=${limit}`;
  
  console.log('📊 Buscando por MAC:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ${response.status}: ${errorText}`);
  }

  return await response.json();
}

// Função para testar a conexão com a API
export async function testSensorReadingsConnection() {
  const baseUrl = SENSOR_READINGS_URL;
  const testUrl = `${baseUrl}/api/sensor-readings?limit=1`;
  
  console.log('🧪 Testando conexão com:', testUrl);

  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('🧪 Status do teste:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('🧪 Teste bem-sucedido:', data);
      return true;
    } else {
      console.error('🧪 Teste falhou:', response.status);
      return false;
    }
  } catch (error) {
    console.error('🧪 Erro no teste:', error);
    return false;
  }
}

// Adicione esta função ao sensorReadings.ts
export async function getAllSensorReadings(page: number = 1, limit: number = 50) {
  const baseUrl = SENSOR_READINGS_URL;
  const url = `${baseUrl}/api/sensor-readings?page=${page}&limit=${limit}`;
  
  console.log('📊 Buscando todos os dados:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ${response.status}: ${errorText}`);
  }

  return await response.json();
}
