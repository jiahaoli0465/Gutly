import { Platform } from 'react-native';

const baseFontSize = 16;

export const typography = {
  fontFamily: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },

  fontSize: {
    xs: baseFontSize * 0.75, // 12px
    sm: baseFontSize * 0.875, // 14px
    base: baseFontSize, // 16px
    lg: baseFontSize * 1.125, // 18px
    xl: baseFontSize * 1.25, // 20px
    '2xl': baseFontSize * 1.5, // 24px
    '3xl': baseFontSize * 1.875, // 30px
    '4xl': baseFontSize * 2.25, // 36px
    '5xl': baseFontSize * 3, // 48px
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
  },
} as const;

export type Typography = typeof typography;
