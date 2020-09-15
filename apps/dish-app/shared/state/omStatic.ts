import { Config, IContext } from 'overmind'

let OMS = null

export function setOmStatic(om: any) {
  OMS = om
}

export const omStatic = new Proxy(
  {},
  {
    get(_, key) {
      return (OMS ?? window['om'])[key]
    },
  }
  // this type fixes omStatic.reaction(, not sure waht iContext fixed if any
) as IContext<Config> & {
  reaction: any // TODO
}

//Overmind<typeof config> //
