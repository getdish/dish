import { slugify } from '@dish/graph'

import { ensureHasLense } from './ensureHasLense'
import { getTagId } from './getTagId'
import { shouldBeOnHome } from './home-helpers'
import { HomeStateNav, ensureUniqueActiveTagIds } from './home-tag-helpers'
import { HomeActiveTagsRecord, Om } from './home-types'

export const getNextState = (om: Om, navState?: HomeStateNav) => {
  const {
    state = om.state.home.currentState,
    tags = [],
    disallowDisableWhenActive = false,
    replaceSearch = false,
  } = navState ?? {}
  let searchQuery = state.searchQuery ?? ''
  let activeTagIds: HomeActiveTagsRecord = replaceSearch
    ? {}
    : 'activeTagIds' in state
    ? { ...state.activeTagIds }
    : {}

  // if they words match tag exactly, convert to tags
  let words = searchQuery.toLowerCase().split(' ')
  while (words.length) {
    const [word, ...rest] = words
    const foundTagId =
      om.state.home.allTagsNameToID[slugify(word, ' ').toLowerCase()]
    if (foundTagId) {
      // remove from words
      words = rest
      // add to active tags
      activeTagIds[foundTagId] = true
    } else {
      break
    }
  }

  // update query
  searchQuery = words.join(' ')

  for (const tag of tags) {
    const key = getTagId(tag)
    if (activeTagIds[key] === true && !disallowDisableWhenActive) {
      activeTagIds[key] = false
    } else {
      activeTagIds[key] = true
      // disable others
      ensureUniqueActiveTagIds(activeTagIds, om.state.home, tag)
    }
  }

  ensureHasLense(activeTagIds)

  const nextState = {
    id: state.id,
    searchQuery,
    activeTagIds,
    type: state.type as any,
  }
  nextState.type = shouldBeOnHome(om.state.home, nextState) ? 'home' : 'search'
  return nextState
}
