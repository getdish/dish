import { IConfig } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as dishes from './dishes/overmind-dishes'
import * as map from './map/overmind-map'

export const config = merge(
  {
    onInitialize: function() {},
    // state,
    // actions,
    // effects,
  },
  namespaced({
    map,
    dishes,
  })
)

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()
