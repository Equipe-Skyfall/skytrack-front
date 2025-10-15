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