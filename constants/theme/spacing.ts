const baseSpacing = 4;

export const spacing = {
  // Base spacing units
  xs: baseSpacing, // 4px
  sm: baseSpacing * 2, // 8px
  md: baseSpacing * 4, // 16px
  lg: baseSpacing * 6, // 24px
  xl: baseSpacing * 8, // 32px
  '2xl': baseSpacing * 12, // 48px
  '3xl': baseSpacing * 16, // 64px
  '4xl': baseSpacing * 24, // 96px

  // Layout specific spacing
  layout: {
    screenPadding: baseSpacing * 4, // 16px
    sectionSpacing: baseSpacing * 8, // 32px
    cardPadding: baseSpacing * 4, // 16px
    inputPadding: baseSpacing * 3, // 12px
    buttonPadding: baseSpacing * 3, // 12px
  },

  // Border radius
  borderRadius: {
    none: 0,
    sm: baseSpacing, // 4px
    md: baseSpacing * 2, // 8px
    lg: baseSpacing * 3, // 12px
    xl: baseSpacing * 4, // 16px
    full: 9999,
  },

  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
} as const;

export type Spacing = typeof spacing;
