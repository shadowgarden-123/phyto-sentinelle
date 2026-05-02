'use client';

import React from 'react';
import { HIGH_CONTRAST_COLORS, commonStyles } from '@/styles/high-contrast-theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated' | 'alert' | 'warning' | 'danger';
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function HighContrastCard({
  children,
  className = '',
  variant = 'default',
  title,
  subtitle,
  icon,
  action,
}: CardProps) {
  const variantStyles = {
    default: {
      backgroundColor: HIGH_CONTRAST_COLORS.background,
      border: `2px solid ${HIGH_CONTRAST_COLORS.border}`,
      boxShadow: HIGH_CONTRAST_COLORS.shadowMd,
    },
    outlined: {
      backgroundColor: HIGH_CONTRAST_COLORS.background,
      border: `3px solid ${HIGH_CONTRAST_COLORS.textPrimary}`,
      boxShadow: 'none',
    },
    elevated: {
      backgroundColor: HIGH_CONTRAST_COLORS.background,
      border: `2px solid ${HIGH_CONTRAST_COLORS.border}`,
      boxShadow: HIGH_CONTRAST_COLORS.shadowXl,
    },
    alert: {
      backgroundColor: HIGH_CONTRAST_COLORS.infoBg,
      border: `3px solid ${HIGH_CONTRAST_COLORS.info}`,
      boxShadow: HIGH_CONTRAST_COLORS.shadowLg,
    },
    warning: {
      backgroundColor: HIGH_CONTRAST_COLORS.warningBg,
      border: `3px solid ${HIGH_CONTRAST_COLORS.warning}`,
      boxShadow: HIGH_CONTRAST_COLORS.shadowLg,
    },
    danger: {
      backgroundColor: HIGH_CONTRAST_COLORS.dangerBg,
      border: `3px solid ${HIGH_CONTRAST_COLORS.danger}`,
      boxShadow: `0 0 0 4px ${HIGH_CONTRAST_COLORS.dangerBg}, ${HIGH_CONTRAST_COLORS.shadowLg}`,
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        backgroundColor: style.backgroundColor,
        border: style.border,
        boxShadow: style.boxShadow,
      }}
    >
      {(title || icon) && (
        <div
          className="px-5 py-4 border-b-2 flex items-center justify-between"
          style={{
            borderColor: variant === 'default' ? HIGH_CONTRAST_COLORS.border : 'transparent',
          }}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor:
                    variant === 'danger'
                      ? HIGH_CONTRAST_COLORS.danger
                      : variant === 'warning'
                        ? HIGH_CONTRAST_COLORS.warning
                        : variant === 'alert'
                          ? HIGH_CONTRAST_COLORS.info
                          : HIGH_CONTRAST_COLORS.palmciGreen,
                  color: '#FFFFFF',
                }}
              >
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3
                  className="font-bold text-lg"
                  style={{ color: HIGH_CONTRAST_COLORS.textPrimary }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm" style={{ color: HIGH_CONTRAST_COLORS.textMuted }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

// KPI Card spécifique avec haute visibilité
interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function HighContrastKPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  variant = 'default',
}: KPICardProps) {
  const variantColors = {
    default: {
      bg: HIGH_CONTRAST_COLORS.palmciGreen,
      border: HIGH_CONTRAST_COLORS.palmciGreenDark,
    },
    success: {
      bg: HIGH_CONTRAST_COLORS.success,
      border: HIGH_CONTRAST_COLORS.successDark,
    },
    warning: {
      bg: HIGH_CONTRAST_COLORS.warning,
      border: HIGH_CONTRAST_COLORS.warningDark,
    },
    danger: {
      bg: HIGH_CONTRAST_COLORS.danger,
      border: HIGH_CONTRAST_COLORS.dangerDark,
    },
  };

  const colors = variantColors[variant];

  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: HIGH_CONTRAST_COLORS.background,
        border: `2px solid ${colors.border}`,
        boxShadow: HIGH_CONTRAST_COLORS.shadowMd,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: colors.bg,
            color: '#FFFFFF',
            border: `2px solid ${colors.border}`,
          }}
        >
          {icon}
        </div>
        {trend && trendValue && (
          <div
            className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
            style={{
              backgroundColor:
                trend === 'up' ? HIGH_CONTRAST_COLORS.dangerBg : HIGH_CONTRAST_COLORS.successBg,
              color: trend === 'up' ? HIGH_CONTRAST_COLORS.danger : HIGH_CONTRAST_COLORS.success,
              border: `2px solid ${
                trend === 'up' ? HIGH_CONTRAST_COLORS.danger : HIGH_CONTRAST_COLORS.success
              }`,
            }}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </div>
        )}
      </div>
      <div
        className="text-3xl font-black tracking-tight"
        style={{ color: HIGH_CONTRAST_COLORS.textPrimary }}
      >
        {value}
        {unit && (
          <span
            className="text-lg font-semibold ml-1"
            style={{ color: HIGH_CONTRAST_COLORS.textMuted }}
          >
            {unit}
          </span>
        )}
      </div>
      <div
        className="text-sm font-semibold mt-1"
        style={{ color: HIGH_CONTRAST_COLORS.textTertiary }}
      >
        {title}
      </div>
    </div>
  );
}

// Badge haute visibilité
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function HighContrastBadge({ children, variant = 'default', size = 'md' }: BadgeProps) {
  const variantStyles = {
    default: {
      bg: HIGH_CONTRAST_COLORS.backgroundSecondary,
      border: HIGH_CONTRAST_COLORS.borderStrong,
      text: HIGH_CONTRAST_COLORS.textSecondary,
    },
    success: {
      bg: HIGH_CONTRAST_COLORS.successBg,
      border: HIGH_CONTRAST_COLORS.success,
      text: HIGH_CONTRAST_COLORS.successDark,
    },
    warning: {
      bg: HIGH_CONTRAST_COLORS.warningBg,
      border: HIGH_CONTRAST_COLORS.warning,
      text: HIGH_CONTRAST_COLORS.warningDark,
    },
    danger: {
      bg: HIGH_CONTRAST_COLORS.dangerBg,
      border: HIGH_CONTRAST_COLORS.danger,
      text: HIGH_CONTRAST_COLORS.dangerDark,
    },
    info: {
      bg: HIGH_CONTRAST_COLORS.infoBg,
      border: HIGH_CONTRAST_COLORS.info,
      text: HIGH_CONTRAST_COLORS.infoDark,
    },
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const style = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-lg ${sizeStyles[size]}`}
      style={{
        backgroundColor: style.bg,
        border: `2px solid ${style.border}`,
        color: style.text,
      }}
    >
      {variant === 'danger' && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
}
