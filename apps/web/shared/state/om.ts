import { IConfig, createOvermind, Action } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as dishes from './dishes'
import * as home from './home'
import * as auth from './auth'
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

export const om = createOvermind(config)

export type Om = typeof om

window['om'] = om
