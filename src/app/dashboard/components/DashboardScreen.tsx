'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  TreePine,
  Activity,
  Calendar,
  MapPin
} from 'lucide-react';
import {
  DiseaseDistributionChart,
  WeeklyAlertsChart,
  SiteRiskChart,
  RiskTrendChart,
  SensorRadarChart,
} from '@/components/EnhancedCharts';

const WEEKLY_ALERTS = [
  { day: 'Lun', total: 10, resolved: 8, critical: 2 },
  { day: 'Mar', total: 12, resolved: 10, critical: 3 },
  { day: 'Mer', total: 7, resolved: 6, critical: 1 },
  { day: 'Jeu', total: 14, resolved: 9, critical: 4 },
  { day: 'Ven', total: 11, resolved: 9, critical: 2 },
  { day: 'Sam', total: 6, resolved: 4, critical: 1 },
  { day: 'Dim', total: 4, resolved: 3, critical: 1 },
];

const DISEASE_DISTRIBUTION = [
  { name: 'Ganoderma', count: 24, pct: 41, color: '#dc2626' }, // red-600
  { name: 'Phytophthora', count: 14, pct: 24, color: '#ea580c' }, // orange-600
  { name: 'Fusarium', count: 11, pct: 19, color: '#ca8a04' }, // yellow-600
  { name: 'Rhynchophorus', count: 9, pct: 16, color: '#0284c7' }, // sky-600
];

const RISK_TREND = [
  { time: '00h', risk: 38 },
  { time: '04h', risk: 42 },
  { time: '08h', risk: 56 },
  { time: '12h', risk: 72 },
  { time: '16h', risk: 78 },
  { time: '20h', risk: 62 },
];

const SITE_RISKS = [
  { site: 'Ehania', risk: 85, parcels: 12, alerts: 7 },
  { site: 'Toumaguié', risk: 78, parcels: 8, alerts: 4 },
  { site: 'Iboké', risk: 55, parcels: 15, alerts: 3 },
  { site: "N'eka", risk: 48, parcels: 10, alerts: 2 },
  { site: 'Abapet', risk: 32, parcels: 7, alerts: 1 },
];

const SENSOR_RADAR_DATA = [
  { subject: 'COV', value: 85, fullMark: 100 },
  { subject: 'Humidité', value: 78, fullMark: 100 },
  { subject: 'TinyML', value: 92, fullMark: 100 },
  { subject: 'Acoustique', value: 88, fullMark: 100 },
  { subject: 'Température', value: 95, fullMark: 100 },
  { subject: 'LoRaWAN', value: 90, fullMark: 100 },
];

function SiteCard({ name, risk, statusColor, alerts }: { name: string, risk: number, statusColor: string, alerts: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-8 rounded-full ${statusColor}`} />
        <div>
          <div className="text-sm font-bold text-gray-900">{name}</div>
          <div className="text-[10px] text-gray-500 font-medium">{alerts} alerte(s)</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-gray-900">{risk}%</div>
        <div className="text-[10px] text-gray-500">Risque</div>
      </div>
    </div>
  );
}

function KPICard({
  title,
  value,
  unit,
  trend,
  trendVal,
  color,
  icon: Icon,
  sub,
}: {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendVal?: string;
  color: string;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between mb-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon size={17} style={{ color }} />
        </div>
        {trend && trendVal && (
          <div
            className={`flex items-center gap-1 text-[10px] font-bold ${trend === 'up' ? 'text-red-600' : 'text-[#009E60]'}`}
          >
            {trend === 'up' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trendVal}
          </div>
        )}
      </div>
      <div className="font-extrabold text-2xl font-tabular text-gray-900">
        {value}
        {unit && <span className="text-sm font-semibold text-gray-400 ml-1">{unit}</span>}
      </div>
      <div className="text-[11px] font-semibold text-gray-500 mt-0.5 uppercase tracking-wide">{title}</div>
      {sub && (
        <div className="text-[10px] font-bold mt-1" style={{ color }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function DashboardScreen() {
  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-extrabold text-gray-900 text-lg">Tableau de bord</h1>
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mt-0.5">Vue globale · Mai 2026</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#009E60] bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 font-bold">
            <Calendar size={12} />
            <span>Aujourd'hui</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        
        {/* Sites Section */}
        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin size={14} className="text-gray-400" />
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sites PALMCI</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SiteCard name="Ehania" risk={85} alerts={7} statusColor="bg-red-500" />
            <SiteCard name="Toumaguié" risk={78} alerts={4} statusColor="bg-orange-500" />
            <SiteCard name="Iboké" risk={55} alerts={3} statusColor="bg-yellow-500" />
            <SiteCard name="N'eka" risk={48} alerts={2} statusColor="bg-[#009E60]" />
          </div>
        </section>

        {/* KPIs */}
        <section>
          <div className="flex items-center gap-1.5 mb-3">
            <Activity size={14} className="text-gray-400" />
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Performances</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <KPICard
              title="Alertes actives"
              value={7}
              color="#dc2626"
              icon={AlertTriangle}
              trend="up"
              trendVal="+2 vs hier"
              sub="3 critiques"
            />
            <KPICard
              title="Taux résolution"
              value={68}
              unit="%"
              color="#009E60"
              icon={CheckCircle2}
              trend="down"
              trendVal="-5%"
              sub="Cette semaine"
            />
            <KPICard
              title="Palmiers surveillés"
              value="1 847"
              color="#009E60"
              icon={TreePine}
              sub="12 parcelles actives"
            />
            <KPICard
              title="PhytoBox actifs"
              value="5/6"
              color="#ea580c"
              icon={Activity}
              sub="1 hors ligne (PB-050)"
            />
          </div>
        </section>

        {/* Charts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <DiseaseDistributionChart data={DISEASE_DISTRIBUTION} />
          </div>
          <SiteRiskChart data={SITE_RISKS} />
          <RiskTrendChart data={RISK_TREND} />
          <div className="md:col-span-2">
            <WeeklyAlertsChart data={WEEKLY_ALERTS} />
          </div>
          <div className="md:col-span-2">
            <SensorRadarChart data={SENSOR_RADAR_DATA} />
          </div>
        </section>
      </div>
    </div>
  );
}
