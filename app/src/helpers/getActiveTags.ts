import { HomeStateItem, HomeStateTagNavigable } from '../types/homeTypes'
import { NavigableTag } from '../types/tagTypes'
import { allTags } from './allTags'
import { memoize } from './memoizeWeak'

export const getActiveTags = memoize(
  (state: Partial<HomeStateItem | HomeStateTagNavigable>): NavigableTag[] => {
    if (!state || !('activeTags' in state) || !state.activeTags) {
      return []
    }
    const { activeTags } = state
    let res: NavigableTag[] = []
    for (const slug in activeTags) {
      if (allTags[slug]) {
        res.push(allTags[slug])
      } else {
        console.groupCollapsed('no alltag...', slug)
        console.trace(state)
        console.groupEnd()
        res.push({ slug })
      }
    }
    return res
  }
)
