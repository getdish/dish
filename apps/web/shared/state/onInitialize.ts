import { OnInitialize, rehydrate } from 'overmind'

import { OVERMIND_MUTATIONS } from '../constants'

const LOG_OVERMIND = window.location.search === '?verbose'

const TIME_ID = 'load'
const tlog = (...args: any[]) => console.timeLog(TIME_ID, ...args)
console.time(TIME_ID)

export const onInitialize: OnInitialize = async (
  { state, actions, effects },
  overmind
) => {
  console.log('initializing...')
  if (OVERMIND_MUTATIONS) {
    console.log('hydating from server...')
    rehydrate(state, OVERMIND_MUTATIONS)
  }
  if (LOG_OVERMIND) {
    overmind.eventHub.on('component:update' as any, (all) => {
      console.log('component:update', all)
    })
    overmind.eventHub.on('action:start' as any, (execution) => {
      const name = execution.actionName
      const logType = name.indexOf('.get') > 0 ? 'info' : 'warn'
      if (typeof execution.value !== 'undefined') {
        console[logType](name, execution.value)
      } else {
        console[logType](name)
      }
    })
  }

  const initAuth = async () => {
    console.time('initAuth')
    await actions.user.checkForExistingLogin()
    console.timeEnd('initAuth')
  }

  await Promise.all([initAuth()])
  tlog(`inits`)

  await actions.home.start()
  tlog('home.start()')
  await actions.router.start({
    onRouteChange: actions.home.handleRouteChange,
  })
  tlog('router.start()')
}

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  module.hot.accept()
}
