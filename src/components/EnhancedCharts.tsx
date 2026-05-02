'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  CartesianGrid,
  Legend,
} from 'recharts';

// Couleurs PALMCI - Vert Orange Blanc (Côte d'Ivoire)
const COLORS = {
  primary: '#009E60',      // Vert PALMCI
  primaryLight: '#00B86E', // Vert clair
  danger: '#ff4444',       // Rouge vif
  dangerDark: '#CC0000',   // Rouge sombre
  warning: '#F77F00',      // Orange PALMCI
  warningLight: '#FF9500', // Orange clair
  info: '#FFD700',         // Or/Doré
  white: '#FFFFFF',        // Blanc
  surface: '#dcfce7',
  surfaceOrange: '#fef3c7',
  grid: '#d4e0d8',
  gridOrange: '#fcd34d',
};

const GLASS_STYLE = {
  background: '#ffffff',
  border: '1px solid #d4e0d8',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

interface DiseaseData {
  name: string;
  count: number;
  pct: number;
  color: string;
}

interface AlertData {
  day: string;
  total: number;
  resolved: number;
  critical: number;
}

interface SiteRiskData {
  site: string;
  risk: number;
  parcels: number;
  alerts: number;
}

interface TrendData {
  time: string;
  risk: number;
}

interface RadarData {
  subject: string;
  value: number;
  fullMark: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-3 text-xs"
        style={{
          ...GLASS_STYLE,
          background: 'linear-gradient(135deg, rgba(0,158,96,0.15) 0%, rgba(5,20,8,0.98) 100%)',
        }}
      >
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="rounded-lg p-3 text-xs"
        style={{
          ...GLASS_STYLE,
          background: 'linear-gradient(135deg, rgba(0,158,96,0.15) 0%, rgba(5,20,8,0.98) 100%)',
        }}
      >
        <p className="font-medium text-foreground">{data.name}</p>
        <p className="text-muted-foreground">
          {data.count} cas ({data.pct}%)
        </p>
      </div>
    );
  }
  return null;
};

export function DiseaseDistributionChart({ data }: { data: DiseaseData[] }) {
  const chartData = data.map((d) => ({
    name: d.name,
    value: d.count,
    pct: d.pct,
    color: d.color,
  }));

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Répartition des maladies</h3>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.color}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((d, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-palm-200 flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: d.color }}
                  />
                  {d.name}
                </span>
                <span className="text-[11px] font-bold font-tabular" style={{ color: d.color }}>
                  {d.count} <span className="text-muted-foreground">({d.pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${d.pct}%`,
                    background: `linear-gradient(90deg, ${d.color}70, ${d.color})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WeeklyAlertsChart({ data }: { data: AlertData[] }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Alertes — 7 derniers jours</h3>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: COLORS.danger, boxShadow: '0 0 4px rgba(255,68,68,0.5)' }} />
            <span className="text-red-400">Nouvelles</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: COLORS.primary, boxShadow: '0 0 4px rgba(0,158,96,0.5)' }} />
            <span className="text-green-400">Résolues</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm" style={{ background: COLORS.warning, boxShadow: '0 0 4px rgba(247,127,0,0.5)' }} />
            <span className="text-orange-400">Critiques</span>
          </span>
        </div>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COLORS.grid}
              vertical={false}
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#5a6b5f', fontSize: 9 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              name="Nouvelles"
              fill={COLORS.danger}
              radius={[3, 3, 0, 0]}
              animationDuration={1000}
            />
            <Bar
              dataKey="resolved"
              name="Résolues"
              fill={COLORS.primary}
              radius={[3, 3, 0, 0]}
              animationDuration={1200}
            />
            <Bar
              dataKey="critical"
              name="Critiques"
              fill={COLORS.warning}
              radius={[3, 3, 0, 0]}
              animationDuration={1400}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SiteRiskChart({ data }: { data: SiteRiskData[] }) {
  const sortedData = [...data].sort((a, b) => b.risk - a.risk);

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Risque par site</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 0, right: 40, bottom: 0, left: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COLORS.grid}
              horizontal={false}
            />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="site"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#009E60', fontSize: 10 }}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="risk"
              name="Risque"
              radius={[0, 4, 4, 0]}
              animationDuration={1000}
            >
              {sortedData.map((entry, index) => {
                const color = entry.risk >= 60 
                  ? COLORS.danger 
                  : entry.risk >= 40 
                    ? COLORS.warning 
                    : COLORS.primary;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function RiskTrendChart({ data }: { data: TrendData[] }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Tendance du risque</h3>
          <p className="text-[10px] text-muted-foreground">Indice moyen toutes parcelles · Aujourd'hui</p>
        </div>
        <div
          className="px-2 py-1 rounded-lg text-[10px] font-medium"
          style={{ 
            background: 'linear-gradient(135deg, rgba(255,68,68,0.2) 0%, rgba(247,127,0,0.15) 100%)', 
            color: COLORS.danger,
            border: '1px solid rgba(255,68,68,0.3)'
          }}
        >
          ↗ 72% peak
        </div>
      </div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.4} />
                <stop offset="50%" stopColor={COLORS.warning} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COLORS.grid}
              vertical={false}
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#5a6b5f', fontSize: 9 }}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="risk"
              name="Risque"
              stroke={COLORS.warning}
              strokeWidth={2.5}
              strokeLinecap="round"
              fill="url(#riskGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SensorRadarChart({ data }: { data: RadarData[] }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-foreground">Capacité de surveillance</h3>
        <p className="text-[10px] text-muted-foreground">Couverture par capteur</p>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke={COLORS.grid} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#5a6b5f', fontSize: 9 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Couverture"
              dataKey="value"
              stroke={COLORS.primary}
              strokeWidth={2.5}
              fill={COLORS.primary}
              fillOpacity={0.3}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function MiniSparkline({
  data,
  color = COLORS.primary,
  height = 30,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div style={{ width: '60px', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
