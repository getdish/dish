import { config } from '@tamagui/config-base'
import { createTamagui } from 'tamagui'

const conf = createTamagui(config)

type CustomConf = typeof conf

declare module 'tamagui' {
  interface TamaguiCustomConfig extends CustomConf {}
}
