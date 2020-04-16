import DishAuth from '@dish/auth'
import { getGraphEndpoint } from '@dish/common-web'
import { OnInitialize, rehydrate } from 'overmind'

import { OVERMIND_MUTATIONS } from '../constants'

const LOG_OVERMIND = window.location.search === '?verbose'

export const onInitialize: OnInitialize = async (
  { state, actions, effects },
  overmind
) => {
  if (OVERMIND_MUTATIONS) {
    console.log('hydating from server...')
    rehydrate(state, OVERMIND_MUTATIONS)
  }

  if (process.env.NODE_ENV == 'development') {
    overmind.eventHub.on('action:start' as any, (execution) => {
      const name = execution.actionName
      const logType = name.indexOf('.get') > 0 ? 'debug' : 'warn'
      if (typeof execution.value !== 'undefined') {
        console[logType](name, execution.value)
      } else {
        console[logType](name)
      }
    })
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

  await actions.home.start()

  await Promise.all([
    actions.user.checkForExistingLogin(),
    // start router
    actions.router.start({
      onRouteChange: actions.home.handleRouteChange,
    }),
  ])
}
