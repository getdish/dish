import { OnInitialize, rehydrate } from 'overmind'

import { isWeb } from '../../constants/constants'
import { OVERMIND_MUTATIONS } from '../../constants/overmindMutations'
import { addTagsToCache } from './allTags'
import { tagDefaultAutocomplete, tagFilters, tagLenses } from '../../constants/localTags'
import { router } from '../../router'
import { userStore } from './userStore'

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
      const name = `🕉 om.${execution.actionName}`
      if (typeof execution.value !== 'undefined') {
        console.groupCollapsed(name)
        console.log(JSON.stringify(execution.value, null, 2))
        console.groupEnd()
      } else {
        console.log(name)
      }
    })
  }

  addTagsToCache([...tagDefaultAutocomplete, ...tagFilters, ...tagLenses])

  router.onRouteChange((item) => {
    actions.home.handleRouteChange(item)
  })

  userStore.checkForExistingLogin()
}

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  module.hot?.accept()
}
