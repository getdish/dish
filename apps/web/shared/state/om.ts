import { IConfig, createOvermind } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as dishes from './dishes'
import * as map from './map'
import * as auth from './auth'

export const config = merge(
  {
    // state,
    // actions,
    // effects,
  },
  namespaced({
    map,
    dishes,
    auth,
  })
)

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()

export const om = createOvermind(config)
