import { initialHomeState } from '../constants/initialHomeState'
import {
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemSearch,
  HomeStateNav,
} from '../types/homeTypes'
import { allTags, allTagsNameToSlug, tagNameKey } from './allTags'
import { getActiveTagSlugs } from './getActiveTagSlugs'
import { shouldBeOnSearch } from './shouldBeOnSearch'

const ensureUnique = new Set(['lense', 'country', 'dish'])

export const getNextState = (navState: HomeStateNav): HomeStateItem => {
  const { tags = [], disallowDisableWhenActive = false, replaceSearch = false } = navState
  let { state } = navState
  if (!state) {
    state = initialHomeState
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
  searchQuery = words.join(' ')

  const activeTags = Object.fromEntries([...existing].map((slug) => [slug, true]))

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
