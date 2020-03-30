import { Action, IConfig, createOvermind } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as auth from './auth'
import * as dishes from './dishes'
import * as home from './home'
import { onInitialize } from './onInitialize'
import * as router from './router'

const setShowSidebar: Action<boolean> = (om, val) => {
  om.state.showSidebar = val
}

export const config = merge(
  {
    state: {
      showSidebar: false,
    },
    actions: {
      setShowSidebar,
    },
    onInitialize,
  },
  namespaced({
    home,
    dishes,
    auth,
    router,
  })
)

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()
export const om = createOvermind(config, {
  devtools: 'localhost:3031',
  logProxies: true,
  hotReloading: true,
})
export type Om = typeof om

window['om'] = om
