import { getTagId } from './getTagId'
import {
  HomeStateNav,
  cleanTagName,
  ensureUniqueActiveTagIds,
} from './home-tag-helpers'
import { HomeActiveTagsRecord } from './home-types'
import { omStatic } from './om'
import { shouldBeOnSearch } from './shouldBeOnSearch'
import { tagLenses } from './tagLenses'

const navStateCache = {}

const nextStateKey = (navState: HomeStateNav) => {
  const tagIds = navState.state?.activeTagIds
  const tagsKey = tagIds ? Object.entries(tagIds).join(',') : '-'
  const tagsKey2 = navState.tags?.map((x) => `${x.name}${x.type}`)
  const disallowKey = navState.disallowDisableWhenActive ?? ''
  const replaceKey = navState.replaceSearch ?? '-'
  const searchKey = navState.state?.searchQuery ?? ''
  const key = `${replaceKey}${tagsKey}${tagsKey2}${disallowKey}${searchKey}`
  return key
}

export const getNextState = (navState: HomeStateNav) => {
  const key = nextStateKey(navState)
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
  let words = searchQuery.toLowerCase().trim().split(' ').filter(Boolean)
  while (words.length) {
    const [word, ...rest] = words
    const foundTagId = omStatic.state.home.allTagsNameToID[cleanTagName(word)]
    if (foundTagId === 'no-slug') {
      debugger
    }
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

  for (const tag of allTags) {
    const key = getTagId(tag)
    if (key.includes('no-slug')) {
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
  nextState.type = shouldBeOnSearch(nextState) ? 'search' : 'home'

  navStateCache[key] = nextState
  return nextState
}
