import { animations } from './constants/animations'
import { media } from './constants/media'
import { createTamagui, createTokens } from '@dish/ui'
import { createInterFont } from '@tamagui/font-inter'
import { shorthands } from '@tamagui/shorthands'
import { color, radius, size, space, themes, zIndex } from '@tamagui/theme-base'

const interFont = createInterFont({
  weight: {
    1: '500',
    7: '700',
  },
})

const config = createTamagui({
  fonts: {
    heading: interFont,
    body: interFont,
  },
  animations,
  defaultTheme: 'light',
  disableRootThemeClass: true,
  shorthands,
  themes,
  media,
  tokens: createTokens({
    size,
    space,
    zIndex,
    color,
    radius,
  }),
})

export type Conf = typeof config

declare module '@dish/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
