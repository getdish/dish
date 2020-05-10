import { IConfig, Overmind } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/es/config'

import * as home from './home'
import { onInitialize } from './onInitialize'
import * as router from './router'
import * as user from './user'

export const config = merge(
  {
    onInitialize,
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

export const useOvermind = createHook<typeof config>()
export const useOvermindStatic = () => window['om'] as Overmind<typeof config>

export const omStatic = new Proxy(
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
    console.warn('paused overmind for now')
  })
}
