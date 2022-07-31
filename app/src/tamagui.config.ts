import { config } from '@tamagui/config-base'
import { createFont, createTamagui, isWeb } from 'tamagui'

function fontSizing<A extends Record<string, number>>(
  size: A,
  sizeLineHeight = (size) => Math.round(size * 1.4)
): {
  size: A
  lineHeight: A
} {
  return {
    size,
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [k, sizeLineHeight(v)])
    ) as any,
  }
}

const garamondFont = createFont({
  family: isWeb ? `"Cardinal"` : 'Inter',
  ...fontSizing(
    {
      1: 11,
      2: 12,
      3: 13,
      4: 14,
      5: 16,
      6: 20,
      7: 27,
      8: 33,
      9: 44,
      10: 56,
      11: 75,
      12: 92,
      13: 108,
      14: 92,
      15: 114,
      16: 134,
    },
    (size) => {
      return Math.round(size * 0.9)
    }
  ),
  letterSpacing: {
    1: 0,
    10: -1,
    13: -2,
  },
  weight: {
    1: '800',
  },
})

const tamaConf = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    dark: {
      ...config.themes.dark,
      backgroundDrawer: 'rgba(0,0,0,0.2)',
    },
    light: {
      ...config.themes.light,
      backgroundDrawer: 'rgba(255,255,255,0.2)',
    },
  },
  fonts: {
    ...config.fonts,
    stylish: garamondFont,
  },
  media: {
    ...config.media,
    pointerCoarse: { pointer: 'coarse' },
  },
})

export type Conf = typeof tamaConf

declare module '@dish/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
