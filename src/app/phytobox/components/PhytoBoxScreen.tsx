'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  analyzePalmHealth,
  simulateSensorReading,
  PHYTOBOX_STATIONS,
  type SensorReading,
  type DiseaseAnalysis,
} from '@/lib/phytoboxEngine';

interface StationState {
  data: SensorReading;
  analysis: DiseaseAnalysis;
  lastUpdate: Date;
}

function SensorGauge({
  label,
  value,
  max,
  unit,
  color,
  icon: Icon,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  icon: React.ElementType;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="glass-card rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon size={13} style={{ color }} />
          <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold font-tabular" style={{ color }}>
          {typeof value === 'number' ? value.toFixed(1) : '—'}
          <span className="text-[10px] font-normal ml-0.5">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-1 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}

function AnalysisBadge({ analysis }: { analysis: DiseaseAnalysis }) {
  const urgencyColor: Record<string, string> = {
    normal: '#22c55e',
    modéré: '#06b6d4',
    élevé: '#F59820',
    critique: '#F04444',
  };
  const col = urgencyColor[analysis.niveauUrgence] || '#22c55e';

  return (
    <div className="glass-card rounded-xl p-4 mt-3">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
          style={{ background: `${col}15`, border: `1px solid ${col}30` }}
        >
          {analysis.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-sm font-bold text-foreground truncate">{analysis.maladie}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: `${col}15`, color: col, border: `1px solid ${col}30` }}
            >
              {analysis.niveauUrgence.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-surface-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${analysis.scoreGlobal}%`,
                  background: `linear-gradient(90deg, ${col}60, ${col})`,
                }}
              />
            </div>
            <span className="text-[11px] font-bold font-tabular" style={{ color: col }}>
              {analysis.scoreGlobal}%
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
            {analysis.ecologique ? '🌱 ' : '⚗️ '}
            {analysis.traitement}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PhytoBoxScreen() {
  const [selectedStation, setSelectedStation] = useState(PHYTOBOX_STATIONS[0].id);
  const [stations, setStations] = useState<Record<string, StationState>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refreshStation = useCallback((stationId: string) => {
    const station = PHYTOBOX_STATIONS.find((s) => s.id === stationId);
    if (!station || !station.online) return;
    const data = simulateSensorReading();
    const analysis = analyzePalmHealth(data);
    setStations((prev) => ({ ...prev, [stationId]: { data, analysis, lastUpdate: new Date() } }));
  }, []);

  const refreshAll = useCallback(() => {
    setIsRefreshing(true);
    PHYTOBOX_STATIONS.forEach((s) => refreshStation(s.id));
    setTimeout(() => setIsRefreshing(false), 800);
  }, [refreshStation]);

  useEffect(() => {
    refreshAll();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => refreshStation(selectedStation), 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, selectedStation, refreshStation]);

  const currentStation = PHYTOBOX_STATIONS.find((s) => s.id === selectedStation);
  const currentState = stations[selectedStation];
  const onlineCount = PHYTOBOX_STATIONS.filter((s) => s.online).length;

  return (
    <div className="flex flex-col h-full bg-palm-950">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(10,15,12,0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(34,197,94,0.1)',
        }}
      >
        <div>
          <h1 className="font-bold text-foreground">PhytoBox IoT</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] text-muted-foreground">
              {onlineCount}/{PHYTOBOX_STATIONS.length} stations en ligne
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            className="text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-all"
            style={{
              background: autoRefresh ? 'rgba(34,197,94,0.1)' : 'var(--surface-1)',
              border: `1px solid ${autoRefresh ? 'rgba(34,197,94,0.25)' : 'var(--border)'}`,
              color: autoRefresh ? 'var(--primary)' : 'var(--muted-foreground)',
            }}
          >
            {autoRefresh ? '⏱ Auto' : '⏸ Pause'}
          </button>
          <button
            onClick={refreshAll}
            className="p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors"
            style={{ background: 'var(--surface-1)' }}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Station selector */}
      <div
        className="flex-shrink-0 px-4 py-2 overflow-x-auto flex gap-2 scrollbar-dark"
        style={{ borderBottom: '1px solid rgba(34,197,94,0.06)' }}
      >
        {PHYTOBOX_STATIONS.map((station) => {
          const state = stations[station.id];
          const urgency = state?.analysis?.niveauUrgence;
          const active = selectedStation === station.id;
          const urgencyColor =
            urgency === 'critique'
              ? '#F04444'
              : urgency === 'élevé'
                ? '#F59820'
                : urgency === 'modéré'
                  ? '#06b6d4'
                  : '#22c55e';

          return (
            <button
              key={station.id}
              onClick={() => {
                setSelectedStation(station.id);
                refreshStation(station.id);
              }}
              className="flex-shrink-0 px-3 py-2 rounded-xl text-left transition-all"
              style={{
                background: active ? `${urgencyColor}12` : 'var(--surface-0)',
                border: `1px solid ${active ? `${urgencyColor}35` : 'var(--border)'}`,
                minWidth: '80px',
              }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${station.online ? 'bg-primary' : 'bg-muted-foreground'} ${station.online && active ? 'animate-pulse' : ''}`}
                />
                <span
                  className="text-[10px] font-bold font-mono"
                  style={{ color: active ? urgencyColor : 'var(--muted-foreground)' }}
                >
                  {station.id}
                </span>
              </div>
              <div className="text-[9px] text-muted-foreground">{station.parcel}</div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-dark">
        {!currentStation?.online ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <WifiOff size={32} className="text-muted-foreground" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Station hors ligne</p>
              <p className="text-sm text-muted-foreground mt-1">Dernière sync: 01/05/2026 18:42</p>
            </div>
          </div>
        ) : !currentState ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {/* Station info */}
            <div className="glass-card rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-foreground">{selectedStation}</div>
                <div className="text-[10px] text-muted-foreground">
                  Parcelle {currentStation.parcel}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <Wifi size={11} className="text-primary" />
                  <span className="text-[10px] text-primary font-medium">En ligne</span>
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">
                  MàJ{' '}
                  {currentState.lastUpdate.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
              </div>
            </div>

            {/* Sensors grid */}
            <div className="grid grid-cols-2 gap-2">
              <SensorGauge
                label="Température air"
                value={currentState.data.temperature_air}
                max={45}
                unit="°C"
                color="#E8B82A"
                icon={Thermometer}
              />
              <SensorGauge
                label="Humidité air"
                value={currentState.data.humidite_air}
                max={100}
                unit="%"
                color="#06b6d4"
                icon={Droplets}
              />
              <SensorGauge
                label="Humidité sol"
                value={currentState.data.humidite_sol}
                max={100}
                unit="%"
                color="#3D9456"
                icon={Droplets}
              />
              <SensorGauge
                label="COV"
                value={currentState.data.cov}
                max={600}
                unit="ppm"
                color="#8B5CF6"
                icon={Wind}
              />
              <SensorGauge
                label="Vibration"
                value={currentState.data.vibration}
                max={1}
                unit="g"
                color="#F59820"
                icon={Activity}
              />
              <SensorGauge
                label="Batterie"
                value={currentState.data.batterie || 85}
                max={100}
                unit="%"
                color="#22c55e"
                icon={Zap}
              />
            </div>

            {/* IA Analysis */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Analyse IA PhytoBox
                </span>
              </div>
              <AnalysisBadge analysis={currentState.analysis} />
            </div>

            {/* Feature bars */}
            <div className="glass-card rounded-xl p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Indicateurs calculés
              </div>
              <div className="space-y-2">
                {Object.entries(currentState.analysis.features).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[11px] text-palm-300">{key.replace(/_/g, ' ')}</span>
                      <span className="text-[11px] font-bold font-tabular text-foreground">
                        {Math.round(value * 100)}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-surface-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${value * 100}%`,
                          background: value > 0.7 ? '#F04444' : value > 0.4 ? '#F59820' : '#22c55e',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
