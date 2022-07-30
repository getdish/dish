import { config } from '@tamagui/config-base'
import { createFont, createTamagui } from 'tamagui'

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
  family: `Garamond`,
  ...fontSizing({
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 20,
    7: 27,
    8: 33,
    9: 40,
    10: 56,
    11: 75,
    12: 92,
    13: 122,
    14: 92,
    15: 114,
    16: 134,
  }),
  letterSpacing: {
    1: 0,
  },
  weight: {},
})

const tamaConf = createTamagui({
  ...config,
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
