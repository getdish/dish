import { isPresent } from '@dish/helpers'

import {
  HomeActiveTagsRecord,
  HomeStateItem,
  HomeStateNav,
} from '../types/homeTypes'
import { NavigableTag } from '../types/tagTypes'
import { allTagsNameToSlug, tagNameKey } from './allTags'
import { allTags } from './allTags'
import { getTagSlug } from './getTagSlug'
import { shouldBeOnSearch } from './shouldBeOnSearch'

export const getNextState = (navState: HomeStateNav): HomeStateItem => {
  const {
    state,
    tags = [],
    disallowDisableWhenActive = false,
    replaceSearch = false,
  } = navState

  if (!state) {
    console.error('getNextState, no state', state)
    return null
  }

  let searchQuery = state.searchQuery ?? ''
  let activeTags: HomeActiveTagsRecord = replaceSearch
    ? {}
    : 'activeTags' in state
    ? { ...state.activeTags }
    : {}

  // if they words match tag exactly, convert to tags
  let words = searchQuery.toLowerCase().trim().split(' ').filter(Boolean)
  while (words.length) {
    const [word, ...rest] = words
    const foundTagSlug = allTagsNameToSlug[tagNameKey(word)]
    if (foundTagSlug) {
      // remove from words
      words = rest
      // add to active tags
      activeTags[foundTagSlug] = true
    } else {
      break
    }
  }

  // update query
  searchQuery = words.join(' ')

  // ensure has a lense
  const allTags = [...tags].filter(isPresent)

  for (const tag of allTags) {
    const key = getTagSlug(tag)
    if (key === 'no-slug') {
      console.warn('unusable tag for next state:', tag)
      continue
    }
    if (activeTags[key] === true && !disallowDisableWhenActive) {
      activeTags[key] = false
    } else {
      activeTags[key] = true
      // disable others
      ensureUniqueActiveTags(activeTags, tag)
    }
  }

  const nextState = {
    id: state.id,
    searchQuery,
    activeTags,
    region: state.region,
    type: state.type,
  }
  nextState.type = shouldBeOnSearch(nextState) ? 'search' : 'home'

  return nextState as any
}

// mutating

const ensureUniqueTagOfType = new Set(['lense', 'country', 'dish'])

export function ensureUniqueActiveTags(
  activeTags: HomeActiveTagsRecord,
  nextActiveTag: NavigableTag
) {
  if (!nextActiveTag) {
    throw new Error(`Missing tag...`)
  }
  for (const key in activeTags) {
    if (key === getTagSlug(nextActiveTag)) {
      continue
    }
    const type = allTags[key]?.type
    if (
      type &&
      ensureUniqueTagOfType.has(type) &&
      type === nextActiveTag.type
    ) {
      delete activeTags[key]
    }
  }
}
