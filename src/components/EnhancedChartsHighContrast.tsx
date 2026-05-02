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
  ReferenceLine,
  LabelList,
} from 'recharts';
import { HIGH_CONTRAST_COLORS } from '@/styles/high-contrast-theme';
import { AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';

// Couleurs haut contraste pour les graphiques
const CHART_COLORS = {
  primary: HIGH_CONTRAST_COLORS.palmciGreen,
  primaryDark: HIGH_CONTRAST_COLORS.palmciGreenDark,
  danger: HIGH_CONTRAST_COLORS.danger,
  dangerDark: HIGH_CONTRAST_COLORS.dangerDark,
  warning: HIGH_CONTRAST_COLORS.warning,
  warningDark: HIGH_CONTRAST_COLORS.warningDark,
  success: HIGH_CONTRAST_COLORS.success,
  text: HIGH_CONTRAST_COLORS.textPrimary,
  textSecondary: HIGH_CONTRAST_COLORS.textSecondary,
  grid: HIGH_CONTRAST_COLORS.border,
  background: HIGH_CONTRAST_COLORS.background,
};

// Style de carte haut contraste
const CARD_STYLE = {
  backgroundColor: HIGH_CONTRAST_COLORS.background,
  border: `2px solid ${HIGH_CONTRAST_COLORS.border}`,
  borderRadius: '12px',
  boxShadow: HIGH_CONTRAST_COLORS.shadowMd,
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
  threshold?: number;
}

interface RadarData {
  subject: string;
  value: number;
  fullMark: number;
}

// Tooltip personnalisé haut contraste
const HighContrastTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-lg p-4 text-sm border-2"
        style={{
          backgroundColor: HIGH_CONTRAST_COLORS.background,
          borderColor: HIGH_CONTRAST_COLORS.borderStrong,
          boxShadow: HIGH_CONTRAST_COLORS.shadowLg,
        }}
      >
        <p className="font-bold mb-2 text-base" style={{ color: HIGH_CONTRAST_COLORS.textPrimary }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="flex items-center gap-2 font-semibold"
            style={{ color: entry.color }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: entry.color }} />
            {entry.name}:<span className="font-black text-base">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Graphique circulaire - Distribution des maladies
export function DiseaseDistributionChart({ data }: { data: DiseaseData[] }) {
  const chartData = data.map((d) => ({
    name: d.name,
    value: d.count,
    pct: d.pct,
    color: d.color,
  }));

  return (
    <div className="p-5" style={CARD_STYLE}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5" style={{ color: CHART_COLORS.primary }} />
        <h3 className="font-bold text-lg" style={{ color: CHART_COLORS.text }}>
          Répartition des maladies
        </h3>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-36 h-36 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={HIGH_CONTRAST_COLORS.background}
                    strokeWidth={3}
                  />
                ))}
              </Pie>
              <Tooltip content={<HighContrastTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Centre avec total */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-black" style={{ color: CHART_COLORS.text }}>
                {chartData.reduce((a, b) => a + b.value, 0)}
              </span>
              <span
                className="block text-xs font-bold"
                style={{ color: CHART_COLORS.textSecondary }}
              >
                Total
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          {data.map((d, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-bold flex items-center gap-2"
                  style={{ color: CHART_COLORS.text }}
                >
                  <span className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="text-sm font-black" style={{ color: d.color }}>
                  {d.count}{' '}
                  <span
                    className="text-xs font-semibold"
                    style={{ color: CHART_COLORS.textSecondary }}
                  >
                    ({d.pct}%)
                  </span>
                </span>
              </div>
              <div
                className="h-2.5 rounded-full overflow-hidden"
                style={{ background: HIGH_CONTRAST_COLORS.backgroundSecondary }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${d.pct}%`,
                    background: d.color,
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

// Graphique en barres - Alertes hebdomadaires
export function WeeklyAlertsChart({ data }: { data: AlertData[] }) {
  return (
    <div className="p-5" style={CARD_STYLE}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" style={{ color: CHART_COLORS.danger }} />
          <h3 className="font-bold text-lg" style={{ color: CHART_COLORS.text }}>
            Alertes — 7 derniers jours
          </h3>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: CHART_COLORS.danger }} />
            <span style={{ color: CHART_COLORS.danger }}>Nouvelles</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: CHART_COLORS.success }} />
            <span style={{ color: CHART_COLORS.success }}>Résolues</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: CHART_COLORS.warning }} />
            <span style={{ color: CHART_COLORS.warning }}>Critiques</span>
          </span>
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
              strokeWidth={2}
            />
            <XAxis
              dataKey="day"
              axisLine={{ stroke: CHART_COLORS.grid, strokeWidth: 2 }}
              tickLine={{ stroke: CHART_COLORS.grid, strokeWidth: 2 }}
              tick={{
                fill: CHART_COLORS.textSecondary,
                fontSize: 12,
                fontWeight: 600,
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: CHART_COLORS.textSecondary,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <Tooltip content={<HighContrastTooltip />} />
            <Bar
              dataKey="total"
              name="Nouvelles"
              fill={CHART_COLORS.danger}
              radius={[4, 4, 0, 0]}
              stroke={CHART_COLORS.dangerDark}
              strokeWidth={2}
            />
            <Bar
              dataKey="resolved"
              name="Résolues"
              fill={CHART_COLORS.success}
              radius={[4, 4, 0, 0]}
              stroke={HIGH_CONTRAST_COLORS.successDark}
              strokeWidth={2}
            />
            <Bar
              dataKey="critical"
              name="Critiques"
              fill={CHART_COLORS.warning}
              radius={[4, 4, 0, 0]}
              stroke={CHART_COLORS.warningDark}
              strokeWidth={2}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Graphique horizontal - Risque par site
export function SiteRiskChart({ data }: { data: SiteRiskData[] }) {
  const sortedData = [...data].sort((a, b) => b.risk - a.risk);

  return (
    <div className="p-5" style={CARD_STYLE}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5" style={{ color: CHART_COLORS.warning }} />
        <h3 className="font-bold text-lg" style={{ color: CHART_COLORS.text }}>
          Risque par site
        </h3>
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 0, right: 50, bottom: 0, left: 80 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              horizontal={false}
              strokeWidth={2}
            />
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="site"
              axisLine={{ stroke: CHART_COLORS.grid, strokeWidth: 2 }}
              tickLine={{ stroke: CHART_COLORS.grid, strokeWidth: 2 }}
              tick={{
                fill: CHART_COLORS.text,
                fontSize: 12,
                fontWeight: 700,
              }}
              width={75}
            />
            <Tooltip content={<HighContrastTooltip />} />
            <Bar dataKey="risk" name="Risque %" radius={[0, 6, 6, 0]} strokeWidth={2}>
              {sortedData.map((entry, index) => {
                const color =
                  entry.risk >= 70
                    ? CHART_COLORS.danger
                    : entry.risk >= 40
                      ? CHART_COLORS.warning
                      : CHART_COLORS.primary;
                const strokeColor =
                  entry.risk >= 70
                    ? CHART_COLORS.dangerDark
                    : entry.risk >= 40
                      ? CHART_COLORS.warningDark
                      : CHART_COLORS.primaryDark;
                return <Cell key={`cell-${index}`} fill={color} stroke={strokeColor} />;
              })}
              <LabelList
                dataKey="risk"
                position="right"
                formatter={(value: number) => `${value}%`}
                style={{
                  fill: CHART_COLORS.text,
                  fontWeight: 'bold',
                  fontSize: 12,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Graphique en aire - Tendance du risque
export function RiskTrendChart({ data }: { data: TrendData[] }) {
  const maxRisk = Math.max(...data.map((d) => d.risk));
  const minRisk = Math.min(...data.map((d) => d.risk));

  return (
    <div className="p-5" style={CARD_STYLE}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" style={{ color: CHART_COLORS.primary }} />
          <div>
            <h3 className="font-bold text-lg" style={{ color: CHART_COLORS.text }}>
              Tendance du risque
            </h3>
            <p className="text-xs font-semibold" style={{ color: CHART_COLORS.textSecondary }}>
              Indice moyen toutes parcelles · Aujourd'hui
            </p>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-sm font-black border-2"
          style={{
            backgroundColor:
              maxRisk > 70 ? HIGH_CONTRAST_COLORS.dangerBg : HIGH_CONTRAST_COLORS.warningBg,
            color: maxRisk > 70 ? CHART_COLORS.danger : CHART_COLORS.warning,
            borderColor: maxRisk > 70 ? CHART_COLORS.danger : CHART_COLORS.warning,
          }}
        >
          ↗ {maxRisk}% max
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.3} />
                <stop offset="50%" stopColor={CHART_COLORS.warning} stopOpacity={0.2} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              vertical={false}
              strokeWidth={2}
            />
            <XAxis
              dataKey="time"
              axisLine={{ stroke: CHART_COLORS.grid, strokeWidth: 2 }}
              tickLine={{ stroke: CHART_COLORS.grid, strokeWidth: 2 }}
              tick={{
                fill: CHART_COLORS.textSecondary,
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <YAxis hide domain={[0, 100]} />
            <ReferenceLine
              y={70}
              stroke={CHART_COLORS.danger}
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{
                value: 'Critique',
                position: 'right',
                fill: CHART_COLORS.danger,
                fontSize: 10,
                fontWeight: 'bold',
              }}
            />
            <Tooltip content={<HighContrastTooltip />} />
            <Area
              type="monotone"
              dataKey="risk"
              name="Risque"
              stroke={CHART_COLORS.warning}
              strokeWidth={3}
              strokeLinecap="round"
              fill="url(#riskGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Graphique radar - Capacité de surveillance
export function SensorRadarChart({ data }: { data: RadarData[] }) {
  return (
    <div className="p-5" style={CARD_STYLE}>
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="w-5 h-5" style={{ color: CHART_COLORS.success }} />
        <div>
          <h3 className="font-bold text-lg" style={{ color: CHART_COLORS.text }}>
            Capacité de surveillance
          </h3>
          <p className="text-xs font-semibold" style={{ color: CHART_COLORS.textSecondary }}>
            Couverture par capteur
          </p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke={CHART_COLORS.grid} strokeWidth={2} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: CHART_COLORS.text,
                fontSize: 11,
                fontWeight: 700,
              }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Couverture"
              dataKey="value"
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              fill={CHART_COLORS.primary}
              fillOpacity={0.25}
            />
            <Tooltip content={<HighContrastTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Mini sparkline pour KPI
export function MiniSparkline({
  data,
  color = CHART_COLORS.primary,
  height = 40,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div style={{ width: '80px', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
