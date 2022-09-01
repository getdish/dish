import { isLngLatParam } from '../app/home/search/urlSerializers'
import { regionPositions } from '../app/home/search/useLocationFromRoute'
import { homeStore } from '../app/homeStore'
import { getInitialHomeState } from '../constants/initialHomeState'
import { HomeStateItem, HomeStateNav, HomeStateTagNavigable } from '../types/homeTypes'
import { allTags, allTagsNameToSlug, tagNameKey } from './allTags'
import { getActiveTagSlugs } from './getActiveTagSlugs'
import { shouldBeOnSearch } from './shouldBeOnSearch'
import { isEqual } from '@dish/fast-compare'

const ensureUnique = new Set(['lense', 'country', 'dish'])

const isOffRegion = (state: HomeStateTagNavigable) => {
  if (!state.region) {
    return true
  }
  if (isLngLatParam(state.region)) {
    console.warn('we put a geo into state, should be false instead')
    return true
  }
  const regionPosition = regionPositions[state.region]
  if (!regionPosition) {
    return false
  }
  return !isEqual(regionPosition, { center: state.center, span: state.span })
}

export const getNextHomeState = async (navState: HomeStateNav): Promise<HomeStateItem> => {
  const { tags = [], disallowDisableWhenActive = false, replaceSearch = false } = navState
  let { state } = navState
  if (!state) {
    const res = await getInitialHomeState()
    state = res.initialHomeState
  }
  const curActive = 'activeTags' in state ? state.activeTags ?? {} : {}
  const existing = new Set(
    replaceSearch
      ? []
      : getActiveTagSlugs(curActive).filter((a) => {
          // if type is being added, dont use it here
          const type = allTags[a]?.type
          if (type && ensureUnique.has(type) && tags.some((b) => type === b.type)) {
            return false
          }
          return true
        })
  )
  for (const { slug } of tags) {
    if (!slug) continue
    if (curActive[slug] && !disallowDisableWhenActive) {
      existing.delete(slug)
      continue
    }
    existing.add(slug)
  }

  // SEARCH => TAG AUTOCOMATICALLY
  let searchQuery = state.searchQuery ?? ''
  let words = searchQuery.toLowerCase().trim().split(' ').filter(Boolean)
  while (words.length) {
    const [word, ...rest] = words
    const foundTagSlug = allTagsNameToSlug[tagNameKey(word)]
    if (foundTagSlug) {
      // remove from words
      words = rest
      // add to active tags
      existing.add(foundTagSlug)
    } else {
      break
    }
  }
  // update query
  searchQuery = words.join(' ').trim()

  const activeTags = Object.fromEntries([...existing].map((slug) => [slug, true]))

  const regionState = homeStore.lastHomeOrSearchState
  let region = state.region || regionState.region

  if (state.type === 'search') {
    if (isOffRegion(regionState)) {
      // if they've moved off the region, set it to geo-coordinates, why false here though?
      region = false
    }
  }

  const nextState = {
    id: state.id,
    searchQuery,
    activeTags,
    region,
    type: state.type,
    center: state.center,
    span: state.span,
  }

  nextState.type = shouldBeOnSearch(nextState) ? 'search' : 'home'
  return nextState as any
}

// // mutating
// const ensureUniqueTagOfType = new Set(['lense', 'country', 'dish'])
// function ensureUniqueActiveTags(
//   activeTags: HomeActiveTagsRecord,
//   nextActiveTag: NavigableTag
// ) {
//   if (!nextActiveTag) {
//     throw new Error(`Missing tag...`)
//   }
//   for (const key in activeTags) {
//     if (key === nextActiveTag.slug) {
//       continue
//     }
//     const type = allTags[key]?.type
//     if (
//       type &&
//       ensureUniqueTagOfType.has(type) &&
//       type === nextActiveTag.type
//     ) {
//       delete activeTags[key]
//     }
//   }
// }
