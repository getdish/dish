import { IConfig } from 'overmind'
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

if (process.env.NODE_ENV === 'development') {
  if (window['STARTED']) {
    console.log('reconfiguring overmind...')
    window['om'].reconfigure(config)
  }
}
