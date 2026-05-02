'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  User,
  Bot,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Leaf,
  Camera,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import type { Alert, AlertStatus } from './AlertsScreen';
import AppImage from '@/components/ui/AppImage';
import { toast } from 'sonner';

interface AlertDetailDrawerProps {
  alert: Alert;
  onClose: () => void;
  onStatusChange: (id: string, status: AlertStatus) => void;
}

const STATUS_FLOW: Record<AlertStatus, AlertStatus | null> = {
  nouveau: 'assigné',
  assigné: 'en_cours',
  en_cours: 'résolu',
  résolu: null,
};

const STATUS_LABELS: Record<AlertStatus, string> = {
  nouveau: 'Nouveau',
  assigné: 'Assigné',
  en_cours: 'En cours',
  résolu: 'Résolu',
};

const STATUS_COLORS: Record<AlertStatus, string> = {
  nouveau: '#F04444',
  assigné: '#F59820',
  en_cours: '#06b6d4',
  résolu: '#22c55e',
};

export default function AlertDetailDrawer({
  alert,
  onClose,
  onStatusChange,
}: AlertDetailDrawerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'recommendation' | 'history'>('details');

  const nextStatus = STATUS_FLOW[alert.status];

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(alert.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleStatusAdvance = () => {
    if (nextStatus) {
      onStatusChange(alert.id, nextStatus);
      toast.success(`Statut mis à jour: ${STATUS_LABELS[nextStatus]}`, {
        description: `Alerte ${alert.id}`,
      });
    }
  };

  const levelColor =
    alert.level === 'critique'
      ? '#F04444'
      : alert.level === 'élevé'
        ? '#F59820'
        : alert.level === 'modéré'
          ? '#06b6d4'
          : '#22c55e';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[450] bg-black/60 backdrop-blur-sm fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[500] slide-in-bottom overflow-hidden"
        style={{
          maxHeight: '90vh',
          background: 'rgba(10, 15, 12, 0.99)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `2px solid ${levelColor}`,
          borderRadius: '20px 20px 0 0',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-start justify-between px-5 py-3"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${levelColor}15`,
                  color: levelColor,
                  border: `1px solid ${levelColor}30`,
                }}
              >
                {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
              </span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `${STATUS_COLORS[alert.status]}12`,
                  color: STATUS_COLORS[alert.status],
                  border: `1px solid ${STATUS_COLORS[alert.status]}25`,
                }}
              >
                {STATUS_LABELS[alert.status]}
              </span>
              <button
                onClick={handleCopyId}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors font-mono"
              >
                {alert.id}
                {copied ? <Check size={9} className="text-primary" /> : <Copy size={9} />}
              </button>
            </div>
            <h2 className="text-base font-bold text-foreground italic">{alert.disease}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin size={11} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">{alert.parcelName}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{alert.bloc}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{alert.site}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-1 transition-all flex-shrink-0"
            aria-label="Fermer le panneau de détail"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex px-5 pt-3 gap-1"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          {(['details', 'recommendation', 'history'] as const).map((tab) => {
            const labels = {
              details: 'Détails',
              recommendation: 'Recommandation IA',
              history: 'Historique',
            };
            return (
              <button
                key={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-b-2
                  ${
                    activeTab === tab
                      ? 'text-primary border-primary'
                      : 'text-muted-foreground border-transparent hover:text-palm-300'
                  }
                `}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto scrollbar-dark px-5 py-4" style={{ maxHeight: '55vh' }}>
          {/* DETAILS TAB */}
          {activeTab === 'details' && (
            <div className="space-y-4 fade-in">
              {/* Risk gauge */}
              <div
                className="rounded-xl p-4"
                style={{ background: `${levelColor}08`, border: `1px solid ${levelColor}20` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    Indice de risque kriging
                  </span>
                  <span className="text-2xl font-bold font-tabular" style={{ color: levelColor }}>
                    {alert.riskIndex}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-surface-1">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${alert.riskIndex}%`,
                      background: `linear-gradient(90deg, #2ECC71 0%, #F59820 50%, #F04444 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  Description
                </h4>
                <p className="text-sm text-palm-200 leading-relaxed">{alert.description}</p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: <Calendar size={13} className="text-muted-foreground" />,
                    label: 'Signalé le',
                    value: alert.reportedAt,
                  },
                  {
                    icon:
                      alert.source === 'ia' ? (
                        <Bot size={13} className="text-primary" />
                      ) : alert.source === 'capteur' ? (
                        <Activity size={13} className="text-secondary" />
                      ) : (
                        <User size={13} className="text-gold-400" />
                      ),
                    label: 'Source',
                    value: alert.reportedBy,
                  },
                  {
                    icon: <MapPin size={13} className="text-muted-foreground" />,
                    label: 'Coordonnées GPS',
                    value: `${alert.gps.lat.toFixed(4)}°N, ${alert.gps.lng.toFixed(4)}°E`,
                  },
                  {
                    icon: <User size={13} className="text-muted-foreground" />,
                    label: 'Assigné à',
                    value: alert.assignedTo || 'Non assigné',
                  },
                ].map((item) => (
                  <div
                    key={`meta-${item.label}`}
                    className="rounded-xl p-3"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.icon}
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-xs text-foreground font-medium leading-tight">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Photo evidence */}
              {alert.photoUrl && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Camera size={12} />
                    Photo terrain
                  </h4>
                  <div className="relative rounded-xl overflow-hidden aspect-video">
                    <AppImage
                      src={alert.photoUrl}
                      alt={`Photo de terrain pour l'alerte ${alert.id} — ${alert.disease} sur ${alert.parcelName}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div
                      className="absolute inset-0 flex items-end p-2"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(10,15,12,0.7) 0%, transparent 60%)',
                      }}
                    >
                      <button className="flex items-center gap-1 text-[10px] text-white/80 hover:text-white transition-colors">
                        <ExternalLink size={10} />
                        Voir en plein écran
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* GPS mini-map placeholder */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MapPin size={12} />
                  Localisation
                </h4>
                <div
                  className="rounded-xl h-28 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #0A1F10 0%, #0D2E16 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.15)',
                  }}
                >
                  <svg
                    className="absolute inset-0 w-full h-full opacity-20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern
                        id="mini-grid"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 20 0 L 0 0 0 20"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="0.3"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mini-grid)" />
                  </svg>
                  <div className="relative flex flex-col items-center gap-1">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center pulse-red"
                      style={{ background: `${levelColor}30`, border: `2px solid ${levelColor}` }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ background: levelColor }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {alert.gps.lat.toFixed(4)}°N · {alert.gps.lng.toFixed(4)}°E
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {alert.parcelName} · {alert.bloc}
                    </span>
                  </div>
                  <button
                    className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-secondary hover:text-primary transition-colors"
                    onClick={() => window.open(`/risk-map?parcel=${alert.parcelId}`, '_blank')}
                  >
                    <ExternalLink size={10} />
                    Voir sur la carte
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RECOMMENDATION TAB */}
          {activeTab === 'recommendation' && (
            <div className="space-y-4 fade-in">
              {alert.aiRecommendation ? (
                <>
                  {/* AI recommendation */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(34, 197, 94, 0.06)',
                      border: '1px solid rgba(34, 197, 94, 0.15)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(34, 197, 94, 0.15)' }}
                      >
                        <Bot size={14} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-primary">
                          PALM&apos;AI — Recommandation
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Basée sur données kriging + PhytoBox
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-palm-200 leading-relaxed">
                      {alert.aiRecommendation}
                    </p>
                  </div>

                  {/* Product info */}
                  {alert.product && (
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Leaf size={12} className="text-primary" />
                        Traitement recommandé
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-1">Produit</div>
                          <div className="text-sm font-semibold text-foreground">
                            {alert.product}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground mb-1">Dose</div>
                          <div className="text-sm font-bold text-primary font-tabular">
                            {alert.dose}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span
                          className="text-[10px] px-2 py-1 rounded-full font-semibold"
                          style={{
                            background: 'rgba(34, 197, 94, 0.12)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                          }}
                        >
                          ✓ Approuvé RSPO
                        </span>
                        <span
                          className="text-[10px] px-2 py-1 rounded-full font-semibold"
                          style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            color: '#06b6d4',
                            border: '1px solid rgba(6, 182, 212, 0.2)',
                          }}
                        >
                          Biocontrôle
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dose calculator */}
                  <DoseCalculatorMini product={alert.product} dose={alert.dose} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bot size={32} className="text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Aucune recommandation IA disponible pour cette alerte.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Consultez PALM&apos;AI pour une analyse personnalisée.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="space-y-3 fade-in">
              {[
                {
                  date: alert.reportedAt,
                  action: 'Alerte créée',
                  actor: alert.reportedBy,
                  color: levelColor,
                  icon: <AlertTriangle size={11} />,
                },
                ...(alert.status !== 'nouveau'
                  ? [
                      {
                        date: alert.reportedAt,
                        action: 'Alerte assignée',
                        actor: alert.assignedTo || 'Système',
                        color: '#F59820',
                        icon: <Clock size={11} />,
                      },
                    ]
                  : []),
                ...(alert.status === 'en_cours' || alert.status === 'résolu'
                  ? [
                      {
                        date: alert.reportedAt,
                        action: 'Intervention démarrée',
                        actor: alert.teamName || 'Équipe terrain',
                        color: '#06b6d4',
                        icon: <Activity size={11} />,
                      },
                    ]
                  : []),
                ...(alert.status === 'résolu'
                  ? [
                      {
                        date: alert.reportedAt,
                        action: 'Alerte résolue',
                        actor: alert.assignedTo || 'Chef de bloc',
                        color: '#22c55e',
                        icon: <CheckCircle2 size={11} />,
                      },
                    ]
                  : []),
              ].map((event, idx) => (
                <div key={`history-${idx}`} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${event.color}15`,
                        border: `1px solid ${event.color}30`,
                        color: event.color,
                      }}
                    >
                      {event.icon}
                    </div>
                    {idx < 3 && (
                      <div
                        className="w-px h-6 mt-1"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="text-sm font-medium text-foreground">{event.action}</div>
                    <div className="text-xs text-muted-foreground">{event.actor}</div>
                    <div className="text-[10px] text-muted-foreground font-tabular mt-0.5">
                      {event.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action footer */}
        <div
          className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {nextStatus ? (
            <button
              onClick={handleStatusAdvance}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${STATUS_COLORS[nextStatus]}cc 0%, ${STATUS_COLORS[nextStatus]} 100%)`,
                color: nextStatus === 'résolu' ? '#0A1F10' : '#fff',
                boxShadow: `0 4px 12px ${STATUS_COLORS[nextStatus]}30`,
              }}
            >
              → {STATUS_LABELS[nextStatus]}
            </button>
          ) : (
            <div
              className="flex-1 py-3 rounded-xl font-semibold text-sm text-center"
              style={{
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
              }}
            >
              <CheckCircle2 size={14} className="inline mr-2" />
              Alerte résolue
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-surface-1"
            style={{ color: '#6b9b74', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            Fermer
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Dose Calculator Mini ────────────────────────────────────────────────────

function DoseCalculatorMini({ product, dose }: { product: string | null; dose: string | null }) {
  const [area, setArea] = useState('');

  if (!product || !dose) return null;

  const doseValue = parseFloat(dose.split(' ')[0]) || 0;
  const doseUnit = dose.includes('kg/ha') ? 'kg/ha' : dose.includes('L/ha') ? 'L/ha' : 'unité';
  const isPerPalm = dose.includes('/palmier') || dose.includes('individus');

  const areaNum = parseFloat(area) || 0;
  const calculatedQty = isPerPalm
    ? doseValue
    : areaNum > 0
      ? Math.ceil(areaNum * doseValue * 10) / 10
      : null;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.15)' }}
    >
      <h4 className="text-xs font-semibold text-secondary uppercase tracking-widest mb-3">
        Calculateur de dose
      </h4>
      {!isPerPalm && (
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="Surface (ha)"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            min="0"
            step="0.1"
            className="flex-1 px-3 py-2 rounded-xl text-sm bg-input border border-border focus:outline-none focus:border-secondary transition-colors"
          />
          <span className="text-xs text-muted-foreground">ha</span>
        </div>
      )}
      {calculatedQty !== null && (
        <div
          className="flex items-center justify-between p-3 rounded-xl"
          style={{ background: 'rgba(6, 182, 212, 0.1)' }}
        >
          <span className="text-xs text-muted-foreground">Quantité totale</span>
          <span className="text-lg font-bold text-secondary font-tabular">
            {calculatedQty} {doseUnit.replace('/ha', '').replace('/palmier', '')}
          </span>
        </div>
      )}
      <p className="text-[10px] text-muted-foreground mt-2">
        Dose standard PALMCI/RSPO: <span className="text-secondary font-tabular">{dose}</span>
      </p>
    </div>
  );
}
