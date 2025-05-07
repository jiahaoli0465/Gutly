export const colors = {
  // Primary colors
  primary: {
    main: '#1B4332', // Deep forest green
    light: '#2D6A4F', // Lighter forest green
    dark: '#081C15', // Darkest forest green
    contrast: '#FFFFFF',
  },

  // Secondary colors
  secondary: {
    main: '#40916C', // Medium green
    light: '#74C69D', // Light sage
    dark: '#2D6A4F', // Dark sage
    contrast: '#FFFFFF',
  },

  // Accent colors
  accent: {
    main: '#95D5B2', // Mint green
    light: '#B7E4C7', // Light mint
    dark: '#74C69D', // Dark mint
    contrast: '#081C15',
  },

  // Neutral colors
  neutral: {
    100: '#FFFFFF',
    200: '#F8F9FA',
    300: '#E9ECEF',
    400: '#DEE2E6',
    500: '#CED4DA',
    600: '#ADB5BD',
    700: '#6C757D',
    800: '#495057',
    900: '#343A40',
    1000: '#212529',
  },

  // Semantic colors
  semantic: {
    success: '#2D6A4F',
    warning: '#FCC419',
    error: '#E03131',
    info: '#1971C2',
  },

  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#F8F9FA',
    dark: '#081C15',
  },

  // Text colors
  text: {
    primary: '#081C15',
    secondary: '#2D6A4F',
    disabled: '#6C757D',
    hint: '#ADB5BD',
  },
} as const;

export type ColorPalette = typeof colors;
