import { config } from '@tamagui/config-base'
import { createTamagui } from 'tamagui'

const tamaConf = createTamagui(config)

export type Conf = typeof tamaConf

declare module '@dish/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaConf
