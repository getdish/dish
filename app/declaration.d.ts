/// <reference types="react-dom/experimental" />
/// <reference types="react/experimental" />

import { Conf } from './src/tamagui.config'

declare module '*.jpg' {
  export default string
}

declare module '*.svg' {
  export default string
}

declare module '@dish/ui' {
  interface TamaguiCustomConfig extends Conf {}
}

// declare module 'tamagui' {
//   interface TamaguiCustomConfig extends Conf {}
// }
