// Tipos e interfaces relacionados às estações

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StationsListResponse {
  data: StationDto[];
  pagination: PaginationData;
}

export interface StationDto {
  id: string;
  name: string;
  macAddress: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  description: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface Station extends StationDto {
  statusColor: string;
}

export interface StationFormData {
  name: string;
  address: string;
  macAddress: string;
  latitude: string;
  longitude: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface EstacaoCardProps {
  station: Station;
  onConfigurarClick: () => void;
  onDeleteClick: () => void;
  isUserLoggedIn: boolean;
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
  valor: {
    temperature: number;
    humidity: number;
    pressure: number;
  };
  alerts: Alert[];
  parameters: Parameter[];
}

export interface Alert {
  id: string;
  data: string;
  stationId: string;
  parameterId: string;
  tipoAlertaId: string;
  medidasId: string;
  createdAt: string;
}

export interface Parameter {
  id: string;
  jsonId: string;
  nome: string;
  metrica: string;
  polinomio: string;
  coeficiente: number[];
  leitura: {
    temperatura: {
      offset: number;
      factor: number;
    };
  };
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
