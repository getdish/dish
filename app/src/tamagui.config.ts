import { media } from './constants/media'
import { shorthands } from './constants/shorthands'
import { themes } from './constants/themes'
import { tokens } from './constants/tokens'
import { createTamagui } from 'tamagui'

const config = createTamagui({
  defaultTheme: 'light',
  disableRootThemeClass: true,
  shorthands,
  themes,
  tokens,
  media,
})

export type Conf = typeof config

declare module '@dish/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
