'use client';

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Layers,
  Bell,
  Wifi,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  TreePine,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import SiteSelector from './SiteSelector';
import MapLegend from './MapLegend';
import BlockListPanel from './BlockListPanel';
import MapControls from './MapControls';
import { createMockPhytoBoxSensorsFromParcels, MOCK_PARCELS_GEOJSON } from '../lib/mockData';

// Dynamically import map to avoid SSR issues with Leaflet
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#FAFBFC]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-[#009E60] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[#5a6b5f]">Chargement de la carte…</span>
      </div>
    </div>
  ),
});

export default function RiskMapScreen() {
  const [selectedSite, setSelectedSite] = useState('ehania');
  const [showKriging, setShowKriging] = useState(true);
  const [showVariance, setShowVariance] = useState(false);
  const [showPhytoBox, setShowPhytoBox] = useState(true);
  const [showBlockPanel, setShowBlockPanel] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null);
  const [lastUpdated] = useState('02/05/2026 02:31');

  const sensors = useMemo(() => createMockPhytoBoxSensorsFromParcels(MOCK_PARCELS_GEOJSON), []);
  const phytoboxTotal = sensors.length;
  const phytoboxOnline = sensors.filter((s) => s.online).length;
  const unreadAlerts = 7;

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-[400] flex items-center gap-2 px-3 py-2.5"
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
      >
        {/* Site selector */}
        <SiteSelector selectedSite={selectedSite} onSiteChange={setSelectedSite} />

        <div className="flex-1" />

        {/* PhytoBox status */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
          style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            boxShadow: 'inset 0 0 10px rgba(0,229,255,0.1)',
          }}
        >
          <Activity size={12} style={{ color: '#00e5ff' }} />
          <span
            className="font-tabular"
            style={{ color: '#00e5ff', textShadow: '0 0 8px rgba(0,229,255,0.5)' }}
          >
            {phytoboxOnline}/{phytoboxTotal}
          </span>
          <span className="text-[#00e5ff] hidden sm:inline opacity-80">PhytoBox</span>
        </div>

        {/* Alerts badge */}
        <Link
          href="/alerts-management"
          className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-red-500/10"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: 'inset 0 0 10px rgba(239,68,68,0.1)',
          }}
        >
          <Bell size={12} style={{ color: '#ef4444' }} />
          <span
            className="font-tabular"
            style={{ color: '#ef4444', textShadow: '0 0 8px rgba(239,68,68,0.5)' }}
          >
            {unreadAlerts}
          </span>
          <span className="text-[#ef4444] hidden sm:inline opacity-80">Alertes</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
        </Link>

        {/* Block list toggle */}
        <button
          onClick={() => setShowBlockPanel(!showBlockPanel)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          style={{
            background: showBlockPanel ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${showBlockPanel ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
            color: showBlockPanel ? '#00e5ff' : '#94a3b8',
            boxShadow: showBlockPanel ? 'inset 0 0 10px rgba(0,229,255,0.1)' : 'none',
          }}
          aria-label="Afficher la liste des blocs"
        >
          <Layers size={12} />
          <span className="hidden sm:inline">Blocs</span>
          <ChevronDown
            size={10}
            className={`transition-transform duration-200 ${showBlockPanel ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Refresh */}
        <button
          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#00e5ff] transition-all hover:bg-white/5 hover:scale-110 active:scale-95"
          aria-label="Rafraîchir les données"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Map container */}
      <div className="flex-1 w-full" style={{ paddingTop: '52px', paddingBottom: '56px' }}>
        <LeafletMap
          selectedSite={selectedSite}
          showKriging={showKriging}
          showVariance={showVariance}
          showPhytoBox={showPhytoBox}
          selectedParcel={selectedParcel}
          onParcelSelect={setSelectedParcel}
        />
      </div>

      {/* Block list panel */}
      {showBlockPanel && (
        <div
          className="absolute top-[52px] left-0 bottom-[56px] w-72 z-[300] overflow-y-auto scrollbar-dark slide-in-bottom sm:translate-y-0 sm:animate-none"
          style={{
            background: '#ffffff',
            borderRight: '1px solid #d4e0d8',
            boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
          }}
        >
          <BlockListPanel
            siteId={selectedSite}
            selectedParcel={selectedParcel}
            onParcelSelect={(id) => {
              setSelectedParcel(id);
              setShowBlockPanel(false);
            }}
          />
        </div>
      )}

      {/* Map controls */}
      <div className="absolute right-3 z-[300]" style={{ top: '70px' }}>
        <MapControls
          showKriging={showKriging}
          showVariance={showVariance}
          showPhytoBox={showPhytoBox}
          onToggleKriging={() => setShowKriging(!showKriging)}
          onToggleVariance={() => setShowVariance(!showVariance)}
          onTogglePhytoBox={() => setShowPhytoBox(!showPhytoBox)}
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-[68px] right-3 z-[300]">
        <MapLegend />
      </div>

      {/* Last updated */}
      <div
        className="absolute bottom-[68px] left-3 z-[300] flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest"
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(0, 229, 255, 0.15)',
          color: '#94a3b8',
        }}
      >
        <Wifi size={10} style={{ color: '#00e5ff' }} />
        <span>SYNC: {lastUpdated}</span>
      </div>

      {/* Risk summary bar — shown when a parcel is selected */}
      {selectedParcel && (
        <ParcelDrawer parcelId={selectedParcel} onClose={() => setSelectedParcel(null)} />
      )}
    </div>
  );
}

// ─── Parcel Drawer ───────────────────────────────────────────────────────────

interface ParcelDrawerProps {
  parcelId: string;
  onClose: () => void;
}

const PARCEL_MOCK: Record<
  string,
  {
    name: string;
    bloc: string;
    risk: number;
    palms: number;
    affectedPalms: number;
    disease: string;
    phytobox: string;
    humidity: number;
    temp: number;
    ph: number;
    lastInspection: string;
  }
> = {
  'P-B4-012': {
    name: 'Parcelle B4-012',
    bloc: 'Bloc B4',
    risk: 78,
    palms: 156,
    affectedPalms: 23,
    disease: 'Ganoderma boninense',
    phytobox: 'PB-047',
    humidity: 82,
    temp: 29.4,
    ph: 5.8,
    lastInspection: '01/05/2026',
  },
  'P-B4-015': {
    name: 'Parcelle B4-015',
    bloc: 'Bloc B4',
    risk: 45,
    palms: 142,
    affectedPalms: 8,
    disease: 'Coelaenomenodera',
    phytobox: 'PB-048',
    humidity: 74,
    temp: 28.1,
    ph: 6.1,
    lastInspection: '28/04/2026',
  },
};

function ParcelDrawer({ parcelId, onClose }: ParcelDrawerProps) {
  const data = PARCEL_MOCK[parcelId] || {
    name: `Parcelle ${parcelId}`,
    bloc: 'Bloc inconnu',
    risk: 35,
    palms: 130,
    affectedPalms: 5,
    disease: 'Surveillance normale',
    phytobox: 'PB-000',
    humidity: 70,
    temp: 27.5,
    ph: 6.0,
    lastInspection: '30/04/2026',
  };

  const riskColor = data.risk >= 60 ? '#ff4444' : data.risk >= 30 ? '#F77F00' : '#009E60';
  const riskLabel = data.risk >= 60 ? 'Élevé' : data.risk >= 30 ? 'Modéré' : 'Faible';

  return (
    <div
      className="absolute bottom-[56px] left-0 right-0 z-[400] slide-in-bottom"
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: `2px solid ${riskColor}`,
        boxShadow: `0 -8px 32px rgba(0,0,0,0.5), inset 0 2px 15px ${riskColor}20`,
        maxHeight: '55vh',
        overflowY: 'auto',
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TreePine
                size={16}
                style={{ color: '#00e5ff', filter: 'drop-shadow(0 0 4px #00e5ff)' }}
              />
              <h3
                className="text-base font-bold uppercase tracking-wider"
                style={{ color: '#e2e8f0', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}
              >
                {data.name}
              </h3>
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                style={{
                  background: `${riskColor}15`,
                  color: riskColor,
                  border: `1px solid ${riskColor}40`,
                  boxShadow: `inset 0 0 8px ${riskColor}20`,
                }}
              >
                {riskLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400 tracking-wide">
              {data.bloc} · Site Ehania-Toumaguié
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-[#00e5ff] hover:bg-white/5 transition-all p-1.5 rounded"
            aria-label="Fermer le panneau"
          >
            ✕
          </button>
        </div>

        {/* Risk gauge */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
              Niveau de Menace
            </span>
            <span
              className="text-lg font-bold font-tabular"
              style={{ color: riskColor, textShadow: `0 0 10px ${riskColor}80` }}
            >
              {data.risk}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${data.risk}%`,
                background: `linear-gradient(90deg, #009E60 0%, #F77F00 50%, #ff4444 100%)`,
              }}
            />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            {
              label: 'Palmiers',
              value: data.palms.toString(),
              unit: 'total',
              color: '#e2e8f0',
            },
            {
              label: 'Affectés',
              value: data.affectedPalms.toString(),
              unit: `${Math.round((data.affectedPalms / data.palms) * 100)}%`,
              color: '#ef4444',
            },
            { label: 'H2O Sol', value: `${data.humidity}%`, unit: 'hum', color: '#00e5ff' },
            {
              label: 'Temp. Ext',
              value: `${data.temp}°C`,
              unit: 'therm',
              color: '#F59820',
            },
          ].map((stat) => (
            <div
              key={`stat-${stat.label}`}
              className="rounded-lg p-3 text-center border"
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderColor: 'rgba(255,255,255,0.05)',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)',
              }}
            >
              <div
                className="text-lg font-bold font-tabular"
                style={{ color: stat.color, textShadow: `0 0 8px ${stat.color}60` }}
              >
                {stat.value}
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">
                {stat.unit}
              </div>
              <div className="text-[10px] text-slate-400 font-bold tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Disease + PhytoBox */}
        <div
          className="flex items-center justify-between mb-4 p-3 rounded-lg"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: 'inset 0 0 15px rgba(239,68,68,0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle
              size={16}
              style={{ color: '#ef4444', filter: 'drop-shadow(0 0 4px #ef4444)' }}
            />
            <div>
              <div
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: '#ef4444', textShadow: '0 0 8px rgba(239,68,68,0.5)' }}
              >
                {data.disease}
              </div>
              <div className="text-[9px] text-red-200/60 uppercase tracking-widest mt-0.5">
                Scan: {data.lastInspection}
              </div>
            </div>
          </div>
          <div className="text-right border-l border-red-500/20 pl-3">
            <div className="text-[9px] text-red-200/60 uppercase tracking-widest">pH Sol</div>
            <div
              className="text-sm font-bold font-tabular"
              style={{ color: '#F59820', textShadow: '0 0 8px rgba(245,152,32,0.5)' }}
            >
              {data.ph}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href="/alerts-management"
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-center transition-all hover:bg-red-500/20 active:scale-[0.97]"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              boxShadow: 'inset 0 0 10px rgba(239,68,68,0.1)',
            }}
          >
            Déclencher Alerte
          </Link>
          <button
            className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:brightness-125 active:scale-[0.97]"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,229,255,0.8) 0%, rgba(0,158,96,0.8) 100%)',
              border: '1px solid rgba(0,229,255,0.4)',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(0,229,255,0.3)',
            }}
          >
            Scan Détaillé
          </button>
        </div>
      </div>
    </div>
  );
}
