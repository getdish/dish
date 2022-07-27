import { config } from '@tamagui/config-base'
import { createTamagui } from 'tamagui'

const tamaConf = createTamagui({
  ...config,
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
