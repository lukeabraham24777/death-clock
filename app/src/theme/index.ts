// Death Clock theme - dark mode with neon blue accent
export const theme = {
  colors: {
    background: '#000000',
    surface: '#0A0A0F',
    surfaceLight: '#141420',
    card: '#1A1A2E',
    primary: '#00D4FF',       // Neon blue accent
    primaryDim: '#0099CC',
    secondary: '#7B2FBE',
    text: '#FFFFFF',
    textSecondary: '#8888AA',
    textDim: '#555577',
    success: '#00FF88',
    warning: '#FFD700',
    danger: '#FF4444',
    border: '#2A2A3E',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 36,
    hero: 56,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
} as const;

export type Theme = typeof theme;
