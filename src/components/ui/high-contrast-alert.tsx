'use client';

import React from 'react';
import { HIGH_CONTRAST_COLORS } from '@/styles/high-contrast-theme';
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  AlertOctagon,
  Bell
} from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'critical';
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantConfig = {
  info: {
    icon: <Info className="w-6 h-6" />,
    bg: HIGH_CONTRAST_COLORS.infoBg,
    border: HIGH_CONTRAST_COLORS.info,
    text: HIGH_CONTRAST_COLORS.infoDark,
    titleBg: HIGH_CONTRAST_COLORS.info,
  },
  success: {
    icon: <CheckCircle className="w-6 h-6" />,
    bg: HIGH_CONTRAST_COLORS.successBg,
    border: HIGH_CONTRAST_COLORS.success,
    text: HIGH_CONTRAST_COLORS.successDark,
    titleBg: HIGH_CONTRAST_COLORS.success,
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6" />,
    bg: HIGH_CONTRAST_COLORS.warningBg,
    border: HIGH_CONTRAST_COLORS.warning,
    text: HIGH_CONTRAST_COLORS.warningDark,
    titleBg: HIGH_CONTRAST_COLORS.warning,
  },
  danger: {
    icon: <XCircle className="w-6 h-6" />,
    bg: HIGH_CONTRAST_COLORS.dangerBg,
    border: HIGH_CONTRAST_COLORS.danger,
    text: HIGH_CONTRAST_COLORS.dangerDark,
    titleBg: HIGH_CONTRAST_COLORS.danger,
  },
  critical: {
    icon: <AlertOctagon className="w-8 h-8" />,
    bg: HIGH_CONTRAST_COLORS.dangerBg,
    border: HIGH_CONTRAST_COLORS.danger,
    text: HIGH_CONTRAST_COLORS.dangerDark,
    titleBg: HIGH_CONTRAST_COLORS.danger,
  },
};

export function HighContrastAlert({
  children,
  variant = 'info',
  title,
  icon,
  action,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  const config = variantConfig[variant];

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: config.bg,
        border: `3px solid ${config.border}`,
        boxShadow: variant === 'critical' 
          ? `0 0 0 4px ${config.bg}, 0 20px 25px -5px rgba(220, 38, 38, 0.4)`
          : `0 0 0 2px ${config.bg}, ${HIGH_CONTRAST_COLORS.shadowLg}`,
      }}
    >
      {/* Header avec titre */}
      {title && (
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{
            backgroundColor: config.titleBg,
            borderBottom: `2px solid ${config.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-white">
              {icon || config.icon}
            </div>
            <span
              className="font-bold text-lg text-white"
            >
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {variant === 'critical' && (
              <span
                className="px-3 py-1 rounded-full text-xs font-black bg-white text-red-600 animate-pulse"
              >
                ACTION REQUISE
              </span>
            )}
            {dismissible && (
              <button
                onClick={onDismiss}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Corps de l'alerte */}
      <div className="p-5">
        {!title && (
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: config.border,
                color: '#FFFFFF',
              }}
            >
              {icon || config.icon}
            </div>
            <div className="flex-1">
              <div
                className="text-base font-semibold leading-relaxed"
                style={{ color: config.text }}
              >
                {children}
              </div>
            </div>
            {dismissible && (
              <button
                onClick={onDismiss}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
                style={{ color: config.text }}
              >
                <span className="text-2xl">×</span>
              </button>
            )}
          </div>
        )}
        
        {title && (
          <div
            className="text-base font-medium leading-relaxed"
            style={{ color: HIGH_CONTRAST_COLORS.textSecondary }}
          >
            {children}
          </div>
        )}
        
        {/* Action button */}
        {action && (
          <div className="mt-4 flex justify-end">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

// Alerte critique spéciale - très visible
interface CriticalAlertProps {
  count: number;
  locations: string[];
  onViewDetails?: () => void;
  onTakeAction?: () => void;
}

export function CriticalAlertBanner({
  count,
  locations,
  onViewDetails,
  onTakeAction,
}: CriticalAlertProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${HIGH_CONTRAST_COLORS.danger} 0%, ${HIGH_CONTRAST_COLORS.dangerDark} 100%)`,
        border: `4px solid ${HIGH_CONTRAST_COLORS.dangerDark}`,
        boxShadow: `0 0 0 6px ${HIGH_CONTRAST_COLORS.dangerBg}, 0 25px 50px -12px rgba(220, 38, 38, 0.5)`,
      }}
    >
      {/* Header avec animation pulse */}
      <div className="px-6 py-4 flex items-center justify-between border-b-2 border-white/20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center">
              <AlertOctagon className="w-8 h-8 text-red-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-white font-black text-2xl">
              {count} ALERTE{count > 1 ? 'S' : ''} CRITIQUE{count > 1 ? 'S' : ''}
            </div>
            <div className="text-red-100 font-medium">
              Intervention immédiate requise
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewDetails}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors border-2 border-white/40"
          >
            Voir détails
          </button>
          <button
            onClick={onTakeAction}
            className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-red-600 font-bold transition-colors border-2 border-white"
          >
            Agir maintenant
          </button>
        </div>
      </div>
      
      {/* Liste des emplacements */}
      <div className="px-6 py-4 bg-black/20">
        <div className="text-white/80 font-semibold mb-2 text-sm uppercase tracking-wide">
          Localisations concernées :
        </div>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-white/20 text-white font-bold text-sm border border-white/30"
            >
              📍 {loc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Alerte flottante pour notification en temps réel
interface FloatingAlertProps {
  message: string;
  variant?: 'success' | 'warning' | 'danger';
  onClose?: () => void;
}

export function FloatingAlert({ message, variant = 'warning', onClose }: FloatingAlertProps) {
  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bg: HIGH_CONTRAST_COLORS.success,
      border: HIGH_CONTRAST_COLORS.successDark,
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bg: HIGH_CONTRAST_COLORS.warning,
      border: HIGH_CONTRAST_COLORS.warningDark,
    },
    danger: {
      icon: <Bell className="w-5 h-5" />,
      bg: HIGH_CONTRAST_COLORS.danger,
      border: HIGH_CONTRAST_COLORS.dangerDark,
    },
  };

  const style = config[variant];

  return (
    <div
      className="fixed top-4 right-4 z-[9999] rounded-xl overflow-hidden animate-in slide-in-from-top-2 fade-in"
      style={{
        backgroundColor: style.bg,
        border: `3px solid ${style.border}`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        minWidth: '320px',
      }}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="text-white">{style.icon}</div>
        <span className="text-white font-bold flex-1">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors text-white"
          >
            ×
          </button>
        )}
      </div>
      {/* Barre de progression */}
      <div className="h-1 bg-white/30">
        <div className="h-full bg-white animate-[shrink_5s_linear_forwards]" />
      </div>
    </div>
  );
}
