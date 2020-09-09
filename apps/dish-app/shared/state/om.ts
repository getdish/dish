import { IConfig, Overmind } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as home from './home'
import { onInitialize } from './onInitialize'
import * as router from './router'
import * as user from './user'

export const config = merge(
  {
    onInitialize,
    state: {},
  },
  namespaced({
    home,
    user,
    router,
  })
)

type OmState = IConfig<typeof config>

declare module 'overmind' {
  interface Config extends OmState {}
}

// helpers

export const useOvermind = createHook<typeof config>()
export const useOvermindStatic = () => window['om'] as Overmind<typeof config>

export const omStatic = new Proxy(
  {},
  {
    get(_, key) {
      return (window['om'] ?? config)[key]
    },
  }
  // this type fixes omStatic.reaction(, not sure waht iContext fixed if any
) as Overmind<typeof config> //IContext<Config>

if (process.env.NODE_ENV === 'development') {
  if (window['STARTED']) {
    console.log('reconfiguring overmind...')
    window['om'].reconfigure(config)
  }
}
