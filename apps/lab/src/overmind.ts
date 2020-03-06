import { IConfig } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as auth from './auth/overmind-auth'
import * as map from './map/overmind-map'

export const config = merge(
  {
    // state,
    // actions,
    // effects,
  },
  namespaced({
    auth,
    map,
  })
)

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()
