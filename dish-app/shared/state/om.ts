import { IConfig, createOvermind } from 'overmind'
import { merge, namespaced } from 'overmind/config'

import * as home from './home'
import { onInitialize } from './onInitialize'

export const config = merge(
  namespaced({
    home,
  }),
  {
    onInitialize,
  }
)

export const om = createOvermind(config, {
  devtools: false, // '192.168.7.166:3031',
  logProxies: true,
  hotReloading: process.env.NODE_ENV !== 'production',
})

if (process.env.NODE_ENV === 'development') {
  if (window['STARTED']) {
    console.log('reconfiguring overmind...')
    om.reconfigure(config)
  }
}

window['om'] = om

type OmState = IConfig<typeof config>

declare module 'overmind' {
  interface Config extends OmState {}
}
