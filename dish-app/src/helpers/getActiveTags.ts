import { HomeStateItem } from '../types/homeTypes'
import { NavigableTag } from '../types/tagTypes'
import { allTags } from './allTags'
import { memoize } from './memoizeWeak'

export const getActiveTags = memoize((state: HomeStateItem): NavigableTag[] => {
  if (!('activeTags' in state)) return []
  const { activeTags } = state
  if (!activeTags) return []
  let res: NavigableTag[] = []
  for (const slug in activeTags) {
    if (allTags[slug]) {
      res.push(allTags[slug])
    } else {
      console.groupCollapsed('no alltag...', slug)
      console.trace(state)
      console.groupEnd()
      // debugger
      res.push({ slug })
    }
  }
  return res
})
