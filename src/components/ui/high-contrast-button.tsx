'use client';

import React from 'react';
import { HIGH_CONTRAST_COLORS } from '@/styles/high-contrast-theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function HighContrastButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: {
      backgroundColor: HIGH_CONTRAST_COLORS.palmciGreen,
      color: '#FFFFFF',
      border: `3px solid ${HIGH_CONTRAST_COLORS.palmciGreenDark}`,
      hoverBg: HIGH_CONTRAST_COLORS.palmciGreenDark,
    },
    secondary: {
      backgroundColor: HIGH_CONTRAST_COLORS.background,
      color: HIGH_CONTRAST_COLORS.textPrimary,
      border: `3px solid ${HIGH_CONTRAST_COLORS.borderStrong}`,
      hoverBg: HIGH_CONTRAST_COLORS.backgroundSecondary,
    },
    danger: {
      backgroundColor: HIGH_CONTRAST_COLORS.danger,
      color: '#FFFFFF',
      border: `3px solid ${HIGH_CONTRAST_COLORS.dangerDark}`,
      hoverBg: HIGH_CONTRAST_COLORS.dangerDark,
    },
    warning: {
      backgroundColor: HIGH_CONTRAST_COLORS.warning,
      color: '#FFFFFF',
      border: `3px solid ${HIGH_CONTRAST_COLORS.warningDark}`,
      hoverBg: HIGH_CONTRAST_COLORS.warningDark,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: HIGH_CONTRAST_COLORS.textPrimary,
      border: `2px solid transparent`,
      hoverBg: HIGH_CONTRAST_COLORS.backgroundSecondary,
    },
    outline: {
      backgroundColor: 'transparent',
      color: HIGH_CONTRAST_COLORS.palmciGreen,
      border: `3px solid ${HIGH_CONTRAST_COLORS.palmciGreen}`,
      hoverBg: HIGH_CONTRAST_COLORS.palmciGreen + '10',
    },
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const style = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        font-bold rounded-lg
        transition-all duration-150
        focus:outline-none focus:ring-4 focus:ring-offset-2
        active:scale-[0.98]
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'}
        ${className}
      `}
      style={{
        backgroundColor: isDisabled ? style.backgroundColor : style.backgroundColor,
        color: style.color,
        border: style.border,
        boxShadow: isDisabled ? 'none' : HIGH_CONTRAST_COLORS.shadowSm,
        ...(isDisabled ? {} : {
          ':hover': {
            backgroundColor: style.hoverBg,
          },
        }),
      }}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

// Bouton d'action rapide avec icône
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export function IconButton({
  icon,
  label,
  variant = 'primary',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <HighContrastButton
      variant={variant}
      size="lg"
      leftIcon={icon}
      className={`flex-col gap-1 min-w-[100px] ${className}`}
      {...props}
    >
      <span className="text-xs font-medium opacity-80">{label}</span>
    </HighContrastButton>
  );
}

// Groupe de boutons
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className = '' }: ButtonGroupProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {children}
    </div>
  );
}
