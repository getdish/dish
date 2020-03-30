import { OnInitialize, rehydrate } from 'overmind'

import { OVERMIND_MUTATIONS } from '../constants'

export const onInitialize: OnInitialize = async ({ state, actions }) => {
  if (OVERMIND_MUTATIONS) {
    console.log('hydating from server...')
    rehydrate(state, OVERMIND_MUTATIONS)
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
