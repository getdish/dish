import { ensureHasLense } from './ensureHasLense'
import { getTagId } from './getTagId'
import { shouldBeOnHome } from './home-helpers'
import {
  HomeStateNav,
  cleanTagName,
  ensureUniqueActiveTagIds,
} from './home-tag-helpers'
import { HomeActiveTagsRecord } from './home-types'
import { omStatic } from './useOvermind'

export const getNextState = (navState?: HomeStateNav) => {
  console.log('get for', navState)
  const {
    state = omStatic.state.home.currentState,
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
    const foundTagId = omStatic.state.home.allTagsNameToID[cleanTagName(word)]
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
      ensureUniqueActiveTagIds(activeTagIds, tag)
    }
  }

  ensureHasLense(activeTagIds)

  const nextState = {
    id: state.id,
    searchQuery,
    activeTagIds,
    type: state.type,
  }
  nextState.type = shouldBeOnHome(nextState) ? 'home' : 'search'
  return nextState
}
