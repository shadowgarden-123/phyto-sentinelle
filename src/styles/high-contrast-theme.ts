// ─────────────────────────────────────────────────────────────────────────────
// Thème Haut Contraste - Noir sur Blanc PALMCI
// Visibilité maximale, accessibilité WCAG AAA
// ─────────────────────────────────────────────────────────────────────────────

export const HIGH_CONTRAST_COLORS = {
  // Fonds
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFB',
  backgroundTertiary: '#F1F5F9',
  
  // Texte - Noir pur et nuances pour hiérarchie
  textPrimary: '#000000',
  textSecondary: '#1A1A1A',
  textTertiary: '#334155',
  textMuted: '#64748B',
  textDisabled: '#94A3B8',
  
  // Couleurs PALMCI avec contraste élevé
  palmciGreen: '#006B3F',      // Vert foncé pour meilleur contraste
  palmciGreenLight: '#009E60', // Vert standard
  palmciGreenDark: '#004D2C',  // Vert très foncé
  
  palmciOrange: '#CC5200',     // Orange foncé
  palmciOrangeLight: '#F77F00',
  palmciOrangeDark: '#8B3A00',
  
  // Alertes - Très visibles
  danger: '#DC2626',           // Rouge vif
  dangerDark: '#991B1B',
  dangerBg: '#FEF2F2',
  
  warning: '#D97706',          // Jaune/Orange alerte
  warningDark: '#92400E',
  warningBg: '#FFFBEB',
  
  success: '#059669',
  successDark: '#065F46',
  successBg: '#ECFDF5',
  
  info: '#0369A1',
  infoDark: '#075985',
  infoBg: '#F0F9FF',
  
  // Bordures
  border: '#E2E8F0',
  borderStrong: '#94A3B8',
  borderFocus: '#000000',
  
  // Ombres subtiles
  shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.1)',
  shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.15)',
  shadowLg: '0 10px 15px -3px rgb(0 0 0 / 0.15)',
  shadowXl: '0 20px 25px -5px rgb(0 0 0 / 0.15)',
} as const;

// Configuration Material UI
export const muiThemeConfig = {
  palette: {
    mode: 'light',
    primary: {
      main: HIGH_CONTRAST_COLORS.palmciGreen,
      light: HIGH_CONTRAST_COLORS.palmciGreenLight,
      dark: HIGH_CONTRAST_COLORS.palmciGreenDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: HIGH_CONTRAST_COLORS.palmciOrange,
      light: HIGH_CONTRAST_COLORS.palmciOrangeLight,
      dark: HIGH_CONTRAST_COLORS.palmciOrangeDark,
      contrastText: '#FFFFFF',
    },
    error: {
      main: HIGH_CONTRAST_COLORS.danger,
      dark: HIGH_CONTRAST_COLORS.dangerDark,
      light: '#FCA5A5',
    },
    warning: {
      main: HIGH_CONTRAST_COLORS.warning,
      dark: HIGH_CONTRAST_COLORS.warningDark,
    },
    success: {
      main: HIGH_CONTRAST_COLORS.success,
      dark: HIGH_CONTRAST_COLORS.successDark,
    },
    background: {
      default: HIGH_CONTRAST_COLORS.background,
      paper: HIGH_CONTRAST_COLORS.background,
    },
    text: {
      primary: HIGH_CONTRAST_COLORS.textPrimary,
      secondary: HIGH_CONTRAST_COLORS.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none' as const },
  },
  shape: {
    borderRadius: 8,
  },
};

// Styles communs réutilisables
export const commonStyles = {
  // Cartes haute visibilité
  card: {
    backgroundColor: HIGH_CONTRAST_COLORS.background,
    border: `2px solid ${HIGH_CONTRAST_COLORS.border}`,
    borderRadius: '12px',
    boxShadow: HIGH_CONTRAST_COLORS.shadowMd,
    padding: '24px',
  },
  
  // Alertes très visibles
  alertCritical: {
    backgroundColor: HIGH_CONTRAST_COLORS.dangerBg,
    border: `3px solid ${HIGH_CONTRAST_COLORS.danger}`,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: `0 0 0 4px ${HIGH_CONTRAST_COLORS.dangerBg}, ${HIGH_CONTRAST_COLORS.shadowLg}`,
  },
  
  alertWarning: {
    backgroundColor: HIGH_CONTRAST_COLORS.warningBg,
    border: `3px solid ${HIGH_CONTRAST_COLORS.warning}`,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: `0 0 0 4px ${HIGH_CONTRAST_COLORS.warningBg}, ${HIGH_CONTRAST_COLORS.shadowLg}`,
  },
  
  // Boutons haut contraste
  buttonPrimary: {
    backgroundColor: HIGH_CONTRAST_COLORS.palmciGreen,
    color: '#FFFFFF',
    border: `2px solid ${HIGH_CONTRAST_COLORS.palmciGreenDark}`,
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 600,
    boxShadow: HIGH_CONTRAST_COLORS.shadowSm,
  },
  
  buttonDanger: {
    backgroundColor: HIGH_CONTRAST_COLORS.danger,
    color: '#FFFFFF',
    border: `2px solid ${HIGH_CONTRAST_COLORS.dangerDark}`,
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 600,
    boxShadow: HIGH_CONTRAST_COLORS.shadowSm,
  },
  
  // Textes très lisibles
  heading: {
    color: HIGH_CONTRAST_COLORS.textPrimary,
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  
  body: {
    color: HIGH_CONTRAST_COLORS.textSecondary,
    fontSize: '14px',
    lineHeight: 1.6,
  },
  
  // Inputs clairs
  input: {
    backgroundColor: HIGH_CONTRAST_COLORS.background,
    border: `2px solid ${HIGH_CONTRAST_COLORS.borderStrong}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: HIGH_CONTRAST_COLORS.textPrimary,
    fontSize: '16px', // Empêche zoom mobile
  },
};

// Configuration Tailwind custom
export const tailwindConfig = {
  extend: {
    colors: {
      'hc-bg': HIGH_CONTRAST_COLORS.background,
      'hc-bg-secondary': HIGH_CONTRAST_COLORS.backgroundSecondary,
      'hc-text': HIGH_CONTRAST_COLORS.textPrimary,
      'hc-text-secondary': HIGH_CONTRAST_COLORS.textSecondary,
      'hc-green': HIGH_CONTRAST_COLORS.palmciGreen,
      'hc-green-light': HIGH_CONTRAST_COLORS.palmciGreenLight,
      'hc-orange': HIGH_CONTRAST_COLORS.palmciOrange,
      'hc-danger': HIGH_CONTRAST_COLORS.danger,
      'hc-warning': HIGH_CONTRAST_COLORS.warning,
      'hc-border': HIGH_CONTRAST_COLORS.border,
    },
    boxShadow: {
      'hc': HIGH_CONTRAST_COLORS.shadowMd,
      'hc-lg': HIGH_CONTRAST_COLORS.shadowLg,
    },
  },
};
