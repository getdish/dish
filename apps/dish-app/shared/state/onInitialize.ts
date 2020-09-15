import { OnInitialize, rehydrate } from 'overmind'

import { OVERMIND_MUTATIONS } from '../constants'
import { addTagsToCache } from './allTags'
import { tagFilters } from './tagFilters'
import { tagLenses } from './tagLenses'

const LOG_OVERMIND =
  typeof document !== 'undefined' && window.location?.search === '?verbose'

export const onInitialize: OnInitialize = async (
  { state, actions, effects },
  overmind
) => {
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

  addTagsToCache([...tagFilters, ...tagLenses])

  actions.user.checkForExistingLogin()
  actions.router.start()
  await actions.home.updateCurrentMapAreaInformation()
}

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  module.hot.accept()
}
