import { Action, IConfig } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

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

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const useOvermind = createHook<typeof config>()
