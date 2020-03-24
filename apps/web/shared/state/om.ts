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

export async function startOm(om: Om) {
  om.actions.auth.checkForExistingLogin()

  om.actions.home.getTopDishes()

  await om.actions.router.start({
    onRouteChange: ({ type, name, item }) => {
      console.log('onRouteChange', type, name, item)
      switch (name) {
        case 'home':
        case 'search':
        case 'restaurant':
          if (type == 'replace') {
            return
          }
          if (type === 'push') {
            om.actions.home._pushHomeState(item)
          } else {
            om.actions.home._popHomeState(item)
          }
          return
      }
    },
  })
}

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()
export const om = createOvermind(config, {
  devtools: false,
})
export type Om = typeof om

window['om'] = om
