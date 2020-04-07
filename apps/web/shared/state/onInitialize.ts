import { OnInitialize, rehydrate } from 'overmind'

import { OVERMIND_MUTATIONS } from '../constants'

export const onInitialize: OnInitialize = async ({ state, actions }) => {
  if (OVERMIND_MUTATIONS) {
    console.log('hydating from server...')
    rehydrate(state, OVERMIND_MUTATIONS)
  }

  actions.auth.checkForExistingLogin()

  await actions.router.start({
    onRouteChange: actions.home.handleRouteChange,
  })

  // start all pages
  await actions.home.start()
}
