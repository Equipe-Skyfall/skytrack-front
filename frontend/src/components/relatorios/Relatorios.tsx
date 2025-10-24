// src/components/relatorios/Relatorios.tsx
import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    MapPin,
    AlertTriangle,
    Gauge,
    Download,
    RefreshCw,
    Activity,
    BarChart3
} from 'lucide-react';
import { getStations } from '../../services/api/stations';
import { getAlerts } from '../../services/api/alerts';
import { getAllSensorReadings } from '../../services/api/sensorReadings';
import { getParameters } from '../../services/api/parameters';
import type { StationDto } from '../../interfaces/stations';
import type { Alert } from '../../interfaces/alerts';
import type { SensorReading } from '../../interfaces/stations';

interface ReportData {
    totalStations: number;
    activeStations: number;
    inactiveStations: number;
    totalAlerts: number;
    totalReadings: number;
    stationsByStatus: { name: string; value: number }[];
    alertsByType: { name: string; value: number }[];
    readingsOverTime: { date: string; readings: number }[];
    sensorData: { name: string; temperatura: number; umidade: number; chuva: number }[];
}

const Relatorios: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

    // Cores para os gráficos
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    const fetchReportData = async () => {
        setLoading(true);
        try {
            // Buscar dados de todas as APIs
            const [stations, alerts, sensorReadings, parameters] = await Promise.all([
                getStations(),
                getAlerts(),
                getAllSensorReadings(1, 1000), // Buscar mais dados para análise
                getParameters(1, 100)
            ]);

            // Processar dados para relatórios
            const processedData: ReportData = {
                totalStations: stations.length,
                activeStations: stations.filter(s => s.status === 'ACTIVE').length,
                inactiveStations: stations.filter(s => s.status === 'INACTIVE').length,
                totalAlerts: alerts.length,
                totalReadings: sensorReadings.data?.length || 0,

                stationsByStatus: [
                    { name: 'Ativas', value: stations.filter(s => s.status === 'ACTIVE').length },
                    { name: 'Inativas', value: stations.filter(s => s.status === 'INACTIVE').length }
                ],

                alertsByType: processAlertsByType(alerts),

                readingsOverTime: processReadingsOverTime(sensorReadings.data || []),

                sensorData: processSensorData(sensorReadings.data || [])
            };

            setReportData(processedData);
        } catch (error) {
            console.error('Erro ao carregar dados de relatórios:', error);
        } finally {
            setLoading(false);
        }
    };

    const processAlertsByType = (alerts: Alert[]): { name: string; value: number }[] => {
        // Agrupar alertas por tipo (simulação - ajuste conforme sua estrutura real)
        const alertCounts: { [key: string]: number } = {};

        alerts.forEach(alert => {
            // Ajuste conforme a estrutura real dos seus alertas
            const tipo = alert.tipoAlertaId || 'Desconhecido';
            alertCounts[tipo] = (alertCounts[tipo] || 0) + 1;
        });

        return Object.entries(alertCounts).map(([name, value]) => ({ name, value }));
    };

    const processReadingsOverTime = (readings: SensorReading[]): { date: string; readings: number }[] => {
        // Agrupar leituras por data (simulação - ajuste conforme necessário)
        const dailyCounts: { [key: string]: number } = {};

        readings.forEach(reading => {
            const date = new Date(reading.timestamp).toLocaleDateString('pt-BR');
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });

        return Object.entries(dailyCounts)
            .map(([date, readings]) => ({ date, readings }))
            .slice(-10); // Últimos 10 dias
    };

    const exportToCSV = () => {
        try {
            const now = new Date();

            // Dados organizados por seções
            const sections = {
                'INFORMAÇÕES GERAIS': [
                    ['Data do Relatório', now.toLocaleDateString('pt-BR')],
                    ['Hora da Geração', now.toLocaleTimeString('pt-BR')],
                    ['Período Analisado', 'Últimos 7 dias']
                ],

                'ESTATÍSTICAS DO SISTEMA': [
                    ['Total de Estações', reportData?.totalStations],
                    ['Estações Ativas', reportData?.activeStations],
                    ['Estações Inativas', reportData?.inactiveStations],
                    ['Total de Alertas', reportData?.totalAlerts],
                    ['Total de Leituras', reportData?.totalReadings]
                ],

                'DISTRIBUIÇÃO DAS ESTAÇÕES':
                    reportData?.stationsByStatus?.map(status => [status.name, status.value]) || [],

                'LEITURAS MAIS RECENTES':
                    reportData?.sensorData?.map((sensor, index) => [
                        `Estação ${index + 1}`,
                        `${sensor.temperatura || 'N/A'}°C`,
                        `${sensor.umidade || 'N/A'}%`,
                        `${sensor.chuva || 'N/A'}mm`,
                        now.toLocaleString('pt-BR')
                    ]) || [],

                'ANÁLISE DE ALERTAS':
                    reportData?.alertsByType?.map(alert => [alert.name, alert.value]) || [],

                'HISTÓRICO DE LEITURAS':
                    reportData?.readingsOverTime?.map(item => [item.date, item.readings]) || []
            };

            // Construir CSV de forma organizada
            const csvData = [];

            // Cabeçalho
            csvData.push(['RELATÓRIO ANALÍTICO - SKYTRACK']);
            csvData.push(['']);

            // Adicionar cada seção
            Object.entries(sections).forEach(([sectionName, sectionData]) => {
                csvData.push([sectionName]);

                if (sectionName === 'LEITURAS MAIS RECENTES') {
                    csvData.push(['Estação', 'Temperatura', 'Umidade', 'Chuva', 'Data/Hora']);
                } else if (sectionName === 'ANÁLISE DE ALERTAS' || sectionName === 'DISTRIBUIÇÃO DAS ESTAÇÕES') {
                    csvData.push(['Descrição', 'Quantidade']);
                } else if (sectionName === 'HISTÓRICO DE LEITURAS') {
                    csvData.push(['Data', 'Leituras Realizadas']);
                } else {
                    csvData.push(['Item', 'Valor']);
                }

                sectionData.forEach(row => {
                    csvData.push(row.map(item => item?.toString() || ''));
                });

                csvData.push(['']); // Linha em branco entre seções
            });

            // Rodapé
            csvData.push(['---']);
            csvData.push(['Relatório gerado automaticamente pelo Sistema SkyTrack']);
            csvData.push(['Para mais informações, consulte o painel administrativo']);

            // Converter para CSV
            const csvString = csvData.map(row =>
                row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
            ).join('\n');

            // Download
            const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `relatorio_skytrack_${now.toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            toast.success('✅ Relatório exportado com sucesso!', {
                position: 'top-right',
                autoClose: 3000,
            });

        } catch (error) {
            console.error('Erro ao exportar CSV:', error);
            toast.error('❌ Erro ao exportar relatório', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };
    
    const processSensorData = (readings: SensorReading[]): { name: string; temperatura: number; umidade: number; chuva: number }[] => {
        // Pegar as últimas 5 leituras para o gráfico
        const recentReadings = readings.slice(-5);

        return recentReadings.map((reading, index) => ({
            name: `Leitura ${index + 1}`,
            temperatura: reading.valor.temperature || reading.valor.temperatura || 0,
            umidade: reading.valor.humidity || reading.valor.umidade || 0,
            chuva: reading.valor.chuva || 0
        }));
    };

    useEffect(() => {
        fetchReportData();
    }, [timeRange]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-12 w-12 text-slate-400 animate-spin mx-auto mb-4" />
                    <div className="text-lg text-slate-600">Carregando relatórios...</div>
                </div>
            </div>
        );
    }

    if (!reportData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <div className="text-lg text-slate-600">Erro ao carregar relatórios</div>
                    <button
                        onClick={fetchReportData}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <BarChart3 className="h-8 w-8" />
                            Relatórios e Analytics
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Dashboard completo com métricas e visualizações dos dados do sistema
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as any)}
                            className="border border-slate-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="24h">Últimas 24h</option>
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                        </select>
                        <button
                            onClick={fetchReportData}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Atualizar
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exportar CSV
                        </button>
                    </div>
                </div>

                {/* Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <MapPin className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600">Total de Estações</h3>
                                <p className="text-2xl font-bold text-slate-800">{reportData.totalStations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Activity className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600">Estações Ativas</h3>
                                <p className="text-2xl font-bold text-slate-800">{reportData.activeStations}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600">Total de Alertas</h3>
                                <p className="text-2xl font-bold text-slate-800">{reportData.totalAlerts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Gauge className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-600">Leituras de Sensores</h3>
                                <p className="text-2xl font-bold text-slate-800">{reportData.totalReadings}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Gráfico de Pizza - Status das Estações */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Status das Estações</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={reportData.stationsByStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {reportData.stationsByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico de Barras - Alertas por Tipo */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Alertas por Tipo</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={reportData.alertsByType}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico de Linha - Leituras ao Longo do Tempo */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Leituras ao Longo do Tempo</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={reportData.readingsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="readings" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gráfico de Barras - Dados dos Sensores */}
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Dados Recentes dos Sensores</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={reportData.sensorData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="temperatura" fill="#ff7300" />
                                <Bar dataKey="umidade" fill="#387908" />
                                <Bar dataKey="chuva" fill="#0088fe" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Relatorios;