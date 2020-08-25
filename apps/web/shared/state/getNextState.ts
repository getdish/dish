import { memoize } from '../helpers/memoizeWeak'
import { getTagId } from './getTagId'
import {
  HomeStateNav,
  cleanTagName,
  ensureUniqueActiveTagIds,
} from './home-tag-helpers'
import { HomeActiveTagsRecord } from './home-types'
import { omStatic } from './om'
import { shouldBeOnHome } from './shouldBeOnHome'
import { tagLenses } from './tagLenses'

const navStateCache = {}

const nextStateId = (navState: HomeStateNav) => {
  const tagIds = navState.state.activeTagIds
  const key = `${navState.replaceSearch ?? '-'}${navState.tags?.map(
    (x) => x.name + x.type
  )}${navState.disallowDisableWhenActive ?? ''}${navState.state.searchQuery}${
    tagIds ? Object.entries(tagIds).join(',') : '-'
  }`
  return key
}

export const getNextState = (navState: HomeStateNav) => {
  const key = nextStateId(navState)
  if (navStateCache[key]) {
    return navStateCache[key]
  }

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

  // ensure has a lense
  const allTags = [...tags]
  if (!allTags.some((x) => x.type === 'lense')) {
    allTags.push(tagLenses[0])
  }

  for (const tag of allTags) {
    const key = getTagId(tag)
    if (key === 'no-slug') {
      console.warn('unusable tag for next state:', tag)
      continue
    }
    if (activeTagIds[key] === true && !disallowDisableWhenActive) {
      activeTagIds[key] = false
    } else {
      activeTagIds[key] = true
      // disable others
      ensureUniqueActiveTagIds(activeTagIds, tag)
    }
  }

  const nextState = {
    id: state.id,
    searchQuery,
    activeTagIds,
    type: state.type,
  }
  nextState.type = shouldBeOnHome(nextState) ? 'home' : 'search'

  navStateCache[key] = nextState
  return nextState
}
