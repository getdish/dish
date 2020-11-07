import { OnInitialize, rehydrate } from 'overmind'

import { OVERMIND_MUTATIONS, isWeb } from '../constants'
import { addTagsToCache } from './allTags'
import { tagDefaultAutocomplete, tagFilters, tagLenses } from './localTags.json'

const LOG_OVERMIND = process.env.NODE_ENV === 'development' || !isWeb

export const onInitialize: OnInitialize = async (
  { state, actions, effects },
  overmind
) => {
  if (OVERMIND_MUTATIONS) {
    console.log('hydating from server...')
    rehydrate(state, OVERMIND_MUTATIONS)
  }
  if (LOG_OVERMIND) {
    // overmind.eventHub.on('component:update' as any, (all) => {
    //   console.debug('[om] component:update', all)
    // })
    overmind.eventHub.on('action:start' as any, (execution) => {
      const name = `[om] >> ${execution.actionName}`
      const logType = name.indexOf('.get') > 0 ? 'info' : 'warn'
      if (typeof execution.value !== 'undefined') {
        console[logType](name, execution.value)
      } else {
        console[logType](name)
      }
    })
  }

  addTagsToCache([...tagDefaultAutocomplete, ...tagFilters, ...tagLenses])

  actions.user.checkForExistingLogin()
  actions.router.start()
  await actions.home.updateCurrentMapAreaInformation()
}

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  module.hot?.accept()
}
