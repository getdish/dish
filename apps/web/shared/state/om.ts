import {
  Action,
  IConfig,
  OnInitialize,
  createOvermind,
  rehydrate,
} from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as auth from './auth'
import * as dishes from './dishes'
import * as home from './home'
import * as router from './router'

const setShowSidebar: Action<boolean> = (om, val) => {
  om.state.showSidebar = val
}

const onInitialize: OnInitialize = async ({ state, actions }) => {
  if (window['__OVERMIND_MUTATIONS']) {
    console.log('hydating from server...')
    rehydrate(state, window['__OVERMIND_MUTATIONS'])
  }

  actions.auth.checkForExistingLogin()
  actions.home.loadHomeDishes()

  await actions.router.start({
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
            actions.home._pushHomeState(item)
          } else {
            actions.home._popHomeState(item)
          }
          return
      }
    },
  })
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
