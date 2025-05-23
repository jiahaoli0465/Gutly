export const theme = {
  colors: {
    primary: {
      main: '#2D6A4F',
      light: '#40916C',
      dark: '#1B4332',
      contrast: '#FFFFFF',
    },
    secondary: {
      main: '#40916C',
      light: '#74C69D',
      dark: '#2D6A4F',
      contrast: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
      elevated: '#F0F0F0',
    },
    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.4)',
    },
    divider: 'rgba(0, 0, 0, 0.1)',
    error: {
      main: '#FF5252',
      light: '#FF8A80',
      dark: '#D32F2F',
      contrast: '#FFFFFF',
    },
    success: {
      main: '#00E676',
      light: '#66FFA6',
      dark: '#00C853',
      contrast: '#000000',
    },
    warning: {
      main: '#FFD600',
      light: '#FFFF52',
      dark: '#C7A600',
      contrast: '#000000',
    },
    info: {
      main: '#00E5FF',
      light: '#6EFFFF',
      dark: '#00B2CC',
      contrast: '#000000',
    },
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semibold: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    layout: {
      screenPadding: 24,
      contentPadding: 16,
    },
  },
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeOut: 'ease-out',
      easeIn: 'ease-in',
    },
  },
} as const;

export type Theme = typeof theme;
