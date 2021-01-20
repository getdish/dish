import { homeStore } from '../app/homeStore'
import { HomeStateItem } from '../types/homeTypes'
import { NavigableTag } from '../types/tagTypes'
import { allTags } from './allTags'
import { isValidTag } from './isValidTag'
import { memoize } from './memoizeWeak'

export const getActiveTags = memoize((state: Partial<HomeStateItem>) => {
  state = state ?? homeStore.currentState
  if ('activeTags' in state) {
    const { activeTags } = state
    if (!activeTags) {
      return []
    }
    const tags: NavigableTag[] = []
    for (const key in activeTags) {
      if (activeTags[key] && isValidTag(key)) {
        tags.push(allTags[key])
      }
    }
    return tags
  }
  return []
})
