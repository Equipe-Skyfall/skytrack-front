// Dashboard interfaces - centralized and standardized
export type StatusEstacao = 'online' | 'offline';
export type NivelAlerta = 'baixo' | 'medio' | 'alto';

export interface EstacaoStatus {
  id: number;
  nome: string;
  status: StatusEstacao;
  ultimaAtualizacao: string;
}

export interface Alerta {
  id: number;
  tipo: string;
  nivel: NivelAlerta;
  regiao: string;
  horario: string;
}

export interface StatusEstacoesProps {
  estacoes: EstacaoStatus[];
}

export interface AlertasRecentesProps {
  alertas: Alerta[];
}

// Dashboard statistics and data interfaces
export interface DashboardStats {
  totalStations: number;
  activeStations: number;
  totalAlerts: number;
  criticalAlerts: number;
  totalParameters: number;
  totalUsers: number;
}

export interface RecentActivity {
  id: string;
  type: 'alert' | 'station' | 'parameter' | 'user';
  message: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// Dashboard page hook return interface
export interface UseDashboardPageResult {
  // Data state
  user: any; // TODO: Replace with proper User type from auth interfaces
  stats: DashboardStats | null;
  recentActivities: RecentActivity[];
  chartData: ChartData | null;
  loading: boolean;
  error: string | null;
  
  // UI state
  selectedTimeRange: '24h' | '7d' | '30d';
  refreshing: boolean;
  
  // Handlers
  onRefresh: () => Promise<void>;
  onTimeRangeChange: (range: '24h' | '7d' | '30d') => void;
  onClearActivity: (activityId: string) => void;
  loadDashboardData: () => Promise<void>;
  
  // Computed values
  activeStationsPercentage: number;
  criticalAlertsPercentage: number;
  isAdmin: boolean;
  recentCriticalActivities: RecentActivity[];
  activitiesByType: {
    alerts: number;
    stations: number;
    parameters: number;
    users: number;
  };
}