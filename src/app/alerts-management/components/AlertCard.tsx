'use client';

import React from 'react';
import {
  Activity,
  User,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Leaf,
} from 'lucide-react';
import type { Alert, AlertLevel, AlertStatus } from './AlertsScreen';

interface AlertCardProps {
  alert: Alert;
  onClick: () => void;
  onStatusChange: (id: string, status: AlertStatus) => void;
}

const LEVEL_CONFIG: Record<
  AlertLevel,
  { color: string; bg: string; border: string; label: string }
> = {
  critique: {
    color: '#F04444',
    bg: 'rgba(240,68,68,0.1)',
    border: 'rgba(240,68,68,0.25)',
    label: 'Critique',
  },
  élevé: {
    color: '#F59820',
    bg: 'rgba(245,152,32,0.1)',
    border: 'rgba(245,152,32,0.25)',
    label: 'Élevé',
  },
  modéré: {
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.25)',
    label: 'Modéré',
  },
  faible: {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.25)',
    label: 'Faible',
  },
};

const STATUS_CONFIG: Record<AlertStatus, { color: string; label: string; icon: React.ReactNode }> =
  {
    nouveau: { color: '#F04444', label: 'Nouveau', icon: <AlertTriangle size={10} /> },
    assigné: { color: '#F59820', label: 'Assigné', icon: <Clock size={10} /> },
    en_cours: { color: '#06b6d4', label: 'En cours', icon: <Activity size={10} /> },
    résolu: { color: '#22c55e', label: 'Résolu', icon: <CheckCircle2 size={10} /> },
  };

const SOURCE_ICON: Record<string, React.ReactNode> = {
  capteur: <Activity size={11} className="text-secondary" />,
  manuel: <User size={11} className="text-gold-400" />,
  ia: <Bot size={11} className="text-primary" />,
};

const SOURCE_LABEL: Record<string, string> = {
  capteur: 'Capteur',
  manuel: 'Manuel',
  ia: 'IA',
};

export default function AlertCard({ alert, onClick, onStatusChange }: AlertCardProps) {
  const levelCfg = LEVEL_CONFIG[alert.level];
  const statusCfg = STATUS_CONFIG[alert.status];
  const ringVars = !alert.read
    ? ({
        ['--tw-ring-color' as unknown as keyof React.CSSProperties]: levelCfg.color,
      } as React.CSSProperties)
    : undefined;

  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl cursor-pointer transition-all duration-200
        hover:translate-y-[-1px] active:scale-[0.99]
        ${!alert.read ? 'ring-1 ring-inset' : ''}
      `}
      style={{
        background: !alert.read
          ? `linear-gradient(135deg, rgba(17,28,20,0.95) 0%, ${levelCfg.bg} 100%)`
          : 'rgba(17, 28, 20, 0.85)',
        border: `1px solid ${!alert.read ? levelCfg.border : 'rgba(255,255,255,0.06)'}`,
        boxShadow: !alert.read ? `0 4px 16px ${levelCfg.color}10` : 'none',
        ...ringVars,
      }}
    >
      {/* Unread indicator */}
      {!alert.read && (
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full"
          style={{ background: levelCfg.color }}
        />
      )}

      <div className="p-3 pl-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {/* Level badge */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: levelCfg.bg,
                color: levelCfg.color,
                border: `1px solid ${levelCfg.border}`,
              }}
            >
              {levelCfg.label}
            </span>

            {/* Source badge */}
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6b9b74',
              }}
            >
              {SOURCE_ICON[alert.source]}
              {SOURCE_LABEL[alert.source]}
            </span>

            {/* Status badge */}
            <span
              className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: `${statusCfg.color}12`,
                border: `1px solid ${statusCfg.color}30`,
                color: statusCfg.color,
              }}
            >
              {statusCfg.icon}
              {statusCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-[10px] text-muted-foreground font-tabular">
              {alert.reportedAt}
            </span>
            <ChevronRight size={13} className="text-muted-foreground" />
          </div>
        </div>

        {/* Disease + parcel */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Leaf size={12} className="text-primary flex-shrink-0" />
              <h3 className="text-sm font-semibold text-foreground truncate italic">
                {alert.disease}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={10} className="text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground font-mono">{alert.parcelName}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{alert.bloc}</span>
            </div>
          </div>

          {/* Risk index */}
          <div className="flex-shrink-0 text-right">
            <div className="text-lg font-bold font-tabular" style={{ color: levelCfg.color }}>
              {alert.riskIndex}%
            </div>
            <div className="text-[9px] text-muted-foreground">risque</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
          {alert.description}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {alert.assignedTo ? (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                  style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}
                >
                  {alert.assignedTo.charAt(0)}
                </div>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {alert.assignedTo}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground italic">Non assigné</span>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {alert.status === 'nouveau' && (
              <button
                onClick={() => onStatusChange(alert.id, 'assigné')}
                className="px-2 py-1 rounded-lg text-[10px] font-medium transition-all active:scale-95"
                style={{
                  background: 'rgba(245, 152, 32, 0.12)',
                  border: '1px solid rgba(245, 152, 32, 0.25)',
                  color: '#F59820',
                }}
              >
                Assigner
              </button>
            )}
            {alert.status === 'assigné' && (
              <button
                onClick={() => onStatusChange(alert.id, 'en_cours')}
                className="px-2 py-1 rounded-lg text-[10px] font-medium transition-all active:scale-95"
                style={{
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  color: '#06b6d4',
                }}
              >
                Démarrer
              </button>
            )}
            {alert.status === 'en_cours' && (
              <button
                onClick={() => onStatusChange(alert.id, 'résolu')}
                className="px-2 py-1 rounded-lg text-[10px] font-medium transition-all active:scale-95"
                style={{
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  color: '#22c55e',
                }}
              >
                Résoudre
              </button>
            )}
            {alert.status === 'résolu' && (
              <span className="flex items-center gap-1 text-[10px] text-primary">
                <CheckCircle2 size={11} />
                Résolu
              </span>
            )}
          </div>
        </div>

        {/* Product recommendation pill */}
        {alert.product && (
          <div
            className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg"
            style={{
              background: 'rgba(34, 197, 94, 0.06)',
              border: '1px solid rgba(34, 197, 94, 0.1)',
            }}
          >
            <Leaf size={10} className="text-primary flex-shrink-0" />
            <span className="text-[10px] text-primary font-medium">{alert.product}</span>
            {alert.dose && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-[10px] text-muted-foreground font-tabular">{alert.dose}</span>
              </>
            )}
            <span
              className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}
            >
              RSPO ✓
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
