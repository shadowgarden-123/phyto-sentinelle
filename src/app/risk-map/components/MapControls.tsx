'use client';

import React from 'react';
import { Layers, Eye, EyeOff, Activity } from 'lucide-react';

interface MapControlsProps {
  showKriging: boolean;
  showVariance: boolean;
  showPhytoBox: boolean;
  onToggleKriging: () => void;
  onToggleVariance: () => void;
  onTogglePhytoBox: () => void;
}

export default function MapControls({
  showKriging,
  showVariance,
  showPhytoBox,
  onToggleKriging,
  onToggleVariance,
  onTogglePhytoBox,
}: MapControlsProps) {
  const controls = [
    {
      id: 'kriging',
      label: 'Heatmap',
      active: showKriging,
      onToggle: onToggleKriging,
      icon: <Layers size={14} />,
      activeColor: '#10b981', // Emerald
      tooltip: 'Interpolation kriging — activer/désactiver la heatmap de risque',
    },
    {
      id: 'variance',
      label: 'Variance',
      active: showVariance,
      onToggle: onToggleVariance,
      icon: showVariance ? <Eye size={14} /> : <EyeOff size={14} />,
      activeColor: '#8b5cf6', // Violet
      tooltip: "Overlay de variance — zones d'incertitude élevée",
    },
    {
      id: 'phytobox',
      label: 'Sentinelles',
      active: showPhytoBox,
      onToggle: onTogglePhytoBox,
      icon: <Activity size={14} />,
      activeColor: '#00e5ff', // Cyan
      tooltip: 'Capteurs PhytoBox — afficher/masquer les marqueurs',
    },
  ];

  return (
    <div
      className="flex flex-col gap-2 p-2 rounded-xl"
      style={{
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 229, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 0 16px rgba(0,229,255,0.05)',
      }}
    >
      {controls.map((ctrl) => (
        <button
          key={`ctrl-${ctrl.id}`}
          onClick={ctrl.onToggle}
          title={ctrl.tooltip}
          aria-label={ctrl.tooltip}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 group"
          style={{
            background: ctrl.active ? `${ctrl.activeColor}15` : 'rgba(255,255,255,0.02)',
            border: `1px solid ${ctrl.active ? `${ctrl.activeColor}40` : 'rgba(255,255,255,0.05)'}`,
            color: ctrl.active ? ctrl.activeColor : '#94a3b8',
            minWidth: '110px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: ctrl.active
              ? `0 0 12px ${ctrl.activeColor}30, inset 0 0 8px ${ctrl.activeColor}20`
              : 'none',
          }}
        >
          {ctrl.icon}
          <span style={{ textShadow: ctrl.active ? `0 0 8px ${ctrl.activeColor}80` : 'none' }}>
            {ctrl.label}
          </span>
          <div
            className="ml-auto w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: ctrl.active ? ctrl.activeColor : 'rgba(255,255,255,0.1)',
              boxShadow: ctrl.active
                ? `0 0 8px ${ctrl.activeColor}, 0 0 12px ${ctrl.activeColor}`
                : 'none',
            }}
          />
        </button>
      ))}
    </div>
  );
}
