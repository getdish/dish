import { Action, IConfig, Overmind } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/es/config'

import * as dishes from './dishes'
import { gql } from './effects'
import * as home from './home'
import { onInitialize } from './onInitialize'
import * as router from './router'
import * as user from './user'

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
    effects: {
      gql,
    },
    onInitialize,
  },
  namespaced({
    home,
    dishes,
    user,
    router,
  })
)

type OmState = IConfig<typeof config>

declare module 'overmind' {
  interface Config extends OmState {}
}

export const useOvermind = createHook<typeof config>()
export const useOvermindStatic = () => window['om'] as Overmind<typeof config>
export const om = new Proxy(
  {},
  {
    get(target, key) {
      return (window['om'] ?? config)[key]
    },
  }
) as Overmind<typeof config>

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  module?.hot.accept(() => {
    console.warn('Reload, changed onInitialize')
    debugger
  })
}
