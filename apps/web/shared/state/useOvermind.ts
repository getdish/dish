import { Config, IContext, Overmind } from 'overmind'
import { createHook } from 'overmind-react'

import { config } from './om'

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
  // @ts-ignore
  module.hot.accept('./om', () => {})
}
