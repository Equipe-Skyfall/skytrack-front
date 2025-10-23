// Interfaces específicas para o dashboard
export interface DashboardProps {
  stationId?: string;
}

export interface DashboardStats {
  averageTemperature: number;
  averageHumidity: number;
  averagePressure: number;
  totalReadings: number;
  activeStations: number;
  totalAlerts: number;
}

export interface StationSelectorProps {
  selectedStationId?: string;
  onStationChange: (stationId: string | undefined) => void;
}