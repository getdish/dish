import DishAuth from '@dish/auth'
import { getGraphEndpoint } from '@dish/common-web'
import { OnInitialize, rehydrate } from 'overmind'

import { OVERMIND_MUTATIONS } from '../constants'

export const onInitialize: OnInitialize = async ({
  state,
  actions,
  effects,
}) => {
  if (OVERMIND_MUTATIONS) {
    console.log('hydating from server...')
    rehydrate(state, OVERMIND_MUTATIONS)
  }

  await effects.gql.initialize(
    {
      // query and mutation options
      endpoint: getGraphEndpoint(),
      headers: () => DishAuth.getHeaders(),
      // The options are the options passed to GRAPHQL-REQUEST
      options: {
        credentials: 'include',
        mode: 'cors',
      },
    }
    // {
    //   // subscription options
    //   endpoint: 'ws://some-endpoint.dev',
    // }
  )

  await actions.home.startBeforeRouting()

  await Promise.all([
    actions.user.checkForExistingLogin(),
    // start router
    actions.router.start({
      onRouteChange: actions.home.handleRouteChange,
    }),
  ])

  // start all pages (after router starts)
  await actions.home.start()
}
