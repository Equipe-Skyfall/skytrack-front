import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { 
  DashboardStats, 
  RecentActivity, 
  ChartData, 
  UseDashboardPageResult 
} from '../../interfaces/dashboard';

export const useDashboardPage = (): UseDashboardPageResult => {
  const { user } = useAuth();
  
  // Estado dos dados
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado da UI
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [refreshing, setRefreshing] = useState(false);

  // Simulação de carregamento dos dados do dashboard
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados das estatísticas
      const mockStats: DashboardStats = {
        totalStations: 15,
        activeStations: 12,
        totalAlerts: 45,
        criticalAlerts: 3,
        totalParameters: 120,
        totalUsers: 8,
      };
      
      // Dados mockados de atividade recente
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'alert',
          message: 'Alerta crítico de temperatura na Estação Central',
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 min atrás
          severity: 'critical',
        },
        {
          id: '2',
          type: 'station',
          message: 'Estação Norte voltou ao funcionamento normal',
          timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 min atrás
          severity: 'low',
        },
        {
          id: '3',
          type: 'parameter',
          message: 'Parâmetro de umidade atualizado na Estação Sul',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1h atrás
          severity: 'medium',
        },
        {
          id: '4',
          type: 'user',
          message: 'Novo usuário cadastrado no sistema',
          timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2h atrás
          severity: 'low',
        },
      ];
      
      // Dados mockados para o gráfico
      const mockChartData: ChartData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Alertas',
            data: [12, 19, 15, 25, 22, 30],
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: 'rgba(239, 68, 68, 1)',
          },
          {
            label: 'Estações Ativas',
            data: [10, 12, 11, 14, 13, 15],
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderColor: 'rgba(34, 197, 94, 1)',
          },
        ],
      };
      
      setStats(mockStats);
      setRecentActivities(mockActivities);
      setChartData(mockChartData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  // Handlers da página
  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const onTimeRangeChange = (range: '24h' | '7d' | '30d') => {
    setSelectedTimeRange(range);
  };

  const onClearActivity = (activityId: string) => {
    setRecentActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  // Computed values
  const activeStationsPercentage = stats 
    ? Math.round((stats.activeStations / stats.totalStations) * 100) 
    : 0;

  const criticalAlertsPercentage = stats && stats.totalAlerts > 0
    ? Math.round((stats.criticalAlerts / stats.totalAlerts) * 100) 
    : 0;

  const isAdmin = user?.role === 'ADMIN';
  
  const recentCriticalActivities = recentActivities.filter(
    activity => activity.severity === 'critical'
  );

  const activitiesByType = {
    alerts: recentActivities.filter(a => a.type === 'alert').length,
    stations: recentActivities.filter(a => a.type === 'station').length,
    parameters: recentActivities.filter(a => a.type === 'parameter').length,
    users: recentActivities.filter(a => a.type === 'user').length,
  };

  return {
    // Estado dos dados
    user,
    stats,
    recentActivities,
    chartData,
    loading,
    error,
    
    // Estado da UI
    selectedTimeRange,
    refreshing,
    
    // Handlers
    onRefresh,
    onTimeRangeChange,
    onClearActivity,
    loadDashboardData,
    
    // Computed values
    activeStationsPercentage,
    criticalAlertsPercentage,
    isAdmin,
    recentCriticalActivities,
    activitiesByType,
  };
};