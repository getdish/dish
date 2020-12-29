import { isValidTag } from '../../helpers/isValidTag'
import { allTags } from './allTags'
import { HomeStateItem } from './home-types'
import { NavigableTag } from './NavigableTag'

export const getActiveTags = (state: Partial<HomeStateItem>) => {
  state = state ?? window['om']?.state.home.currentState
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
