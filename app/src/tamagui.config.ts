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

export type Conf = typeof config

export default config
