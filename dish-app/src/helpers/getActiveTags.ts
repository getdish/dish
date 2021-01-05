import { homeStore } from '../app/homeStore'
import { HomeStateItem } from '../types/homeTypes'
import { NavigableTag } from '../types/tagTypes'
import { allTags } from './allTags'
import { isValidTag } from './isValidTag'

export const getActiveTags = (state: Partial<HomeStateItem>) => {
  state = state ?? homeStore.currentState
  if ('activeTags' in state) {
    const { activeTags } = state
    if (!activeTags) {
      return []
    }
    const tagIds = Object.keys(activeTags)
      .filter((x) => !!activeTags[x])
      .filter(isValidTag)
    const tags: NavigableTag[] = []
    for (const slug of tagIds) {
      if (!allTags[slug]) {
        debugger
      }
      tags.push(allTags[slug])
    }
    return tags
  }
  return []
}
