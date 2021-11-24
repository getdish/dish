import { createTamagui } from 'tamagui'

import { media } from './constants/media'
import { shorthands } from './constants/shorthands'
import { themes } from './constants/themes'
import { tokens } from './constants/tokens'

const config = createTamagui({
  defaultTheme: 'light',
  disableRootThemeClass: true,
  shorthands,
  themes,
  tokens,
  media,
})

type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
