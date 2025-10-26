// Sensor readings interfaces and types

export interface SensorValue {
  temperatura?: number;
  umidade?: number;
  chuva?: number;
  pressure?: number; // keep for backwards compatibility
  temperature?: number; // keep for backwards compatibility
  humidity?: number; // keep for backwards compatibility
  [key: string]: number | undefined; // Allow for additional sensor types
}

export interface ReadingAlert {
  id: string;
  data: string;
  stationId: string;
  parameterId: string;
  tipoAlertaId: string;
  medidasId: string;
  createdAt: string;
}

export interface ReadingParameter {
  id: string;
  jsonId: string;
  nome: string;
  metrica: string;
  polinomio?: string;
  coeficiente: number[];
  leitura: {
    [key: string]: {
      offset: number;
      factor: number;
    };
  };
}

export interface SensorReading {
  id: string;
  stationId: string;
  timestamp: string;
  mongoId: string;
  createdAt: string;
  updatedAt: string;
  macEstacao: string;
  uuidEstacao: string;
  valor: SensorValue;
  alerts: ReadingAlert[];
  parameters: ReadingParameter[];
}

export interface SensorReadingsResponse {
  data: SensorReading[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filtering and query types
export interface ReadingsFilters {
  stationId?: string;
  macEstacao?: string;
  startDate?: string;
  endDate?: string;
  parameterTypes?: string[]; // e.g., ['temperature', 'humidity']
  page?: number;
  limit?: number;
}

// Chart data types for visualization
export interface ChartDataPoint {
  timestamp: string;
  [parameter: string]: number | string; // temperature: 26.4, humidity: 58.7, etc.
}

export interface SensorChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    unit: string;
  }[];
}

// Available sensor types for selection
export interface SensorType {
  key: string;
  label: string;
  unit: string;
  color: string;
  enabled: boolean;
}