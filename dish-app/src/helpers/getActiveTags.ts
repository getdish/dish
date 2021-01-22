import { HomeStateItem } from '../types/homeTypes'
import { NavigableTag } from '../types/tagTypes'
import { allTags } from './allTags'
import { memoize } from './memoizeWeak'

export const getActiveTags = memoize(
  (state: Partial<HomeStateItem>): NavigableTag[] => {
    if (!('activeTags' in state)) return []
    const { activeTags } = state
    if (!activeTags) return []
    let res: NavigableTag[] = []
    for (const slug in activeTags) {
      if (allTags[slug]) {
        res.push(allTags[slug])
      } else {
        console.warn('no alltag...')
        // debugger
        res.push({ slug })
      }
    }
    return res
  }
)
