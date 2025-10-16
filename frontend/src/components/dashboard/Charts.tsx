import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

import { chuvaPorDia, temperaturaMediaPorDia, ventoPorDia } from './mockChartData';
import type { ChuvaDia, TemperaturaDia, VentoDia } from './mockChartData';
import './charts-neon.css';

const numberFormat = (value: number, suffix = '') => `${value.toFixed(1)}${suffix}`;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-2 rounded shadow text-sm border border-gray-200">
        <div className="font-medium text-gray-700">{label}</div>
        <div className="text-gray-600">{data.name || data.dataKey}: <span className="font-semibold text-gray-900">{data.value}</span></div>
      </div>
    );
  }
  return null;
};


const Charts: React.FC = () => {
  const totalChuva = chuvaPorDia.reduce((s: number, c: ChuvaDia) => s + c.mm, 0);
  const mediaTemp = temperaturaMediaPorDia.reduce((s: number, t: TemperaturaDia) => s + t.media, 0) / temperaturaMediaPorDia.length;
  const mediaVento = ventoPorDia.reduce((s: number, v: VentoDia) => s + v.velocidadeMedia, 0) / ventoPorDia.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="neon-card neon-sky bg-gradient-to-br from-white to-sky-50 p-6 rounded-lg shadow-lg border border-gray-100">
        <div className="chart-overlay-line overlay-sky" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Velocidade média do vento (km/h)</h3>
            <p className="text-sm text-gray-500">Média últimos 7 dias</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Média</div>
            <div className="text-xl font-bold text-sky-600">{numberFormat(mediaVento, ' km/h')}</div>
          </div>
        </div>
        <div style={{ width: '100%', height: 420 }}>
          <ResponsiveContainer>
            <AreaChart data={ventoPorDia} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVento" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bfdbfe" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8f1fb" />
              <XAxis dataKey="dia" tick={{ fill: '#6b7280' }} />
              <YAxis tickFormatter={(v) => numberFormat(v)} tick={{ fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="velocidadeMedia" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorVento)" animationDuration={900} className="neon-glow-sky pulse wave" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="neon-card neon-blue bg-gradient-to-br from-white to-slate-50 p-6 rounded-lg shadow-lg border border-gray-100">
        <div className="chart-overlay-line overlay-blue" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Chuva (mm) por dia</h3>
            <p className="text-sm text-gray-500">Total últimos 7 dias</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-bold text-blue-600">{numberFormat(totalChuva, ' mm')}</div>
          </div>
        </div>
        <div style={{ width: '100%', height: 420 }}>
          <ResponsiveContainer>
            <BarChart data={chuvaPorDia} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorChu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6edf6" />
              <XAxis dataKey="dia" tick={{ fill: '#6b7280' }} />
              <YAxis tickFormatter={(v) => numberFormat(v)} tick={{ fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="mm" fill="url(#colorChu)" radius={[6, 6, 0, 0]} animationDuration={800} className="neon-glow-blue pulse" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="neon-card neon-red bg-gradient-to-br from-white to-rose-50 p-6 rounded-lg shadow-lg border border-gray-100">
        <div className="chart-overlay-line overlay-red" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Temperatura média (ºC)</h3>
            <p className="text-sm text-gray-500">Média últimos 7 dias</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Média</div>
            <div className="text-xl font-bold text-red-500">{numberFormat(mediaTemp, ' ºC')}</div>
          </div>
        </div>
        <div style={{ width: '100%', height: 420 }}>
          <ResponsiveContainer>
            <LineChart data={temperaturaMediaPorDia} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fecaca" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#fbeaea" />
              <XAxis dataKey="dia" tick={{ fill: '#6b7280' }} />
              <YAxis tickFormatter={(v) => numberFormat(v)} tick={{ fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="media" stroke="url(#colorTemp)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} animationDuration={1000} className="neon-glow-red pulse-slow" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
