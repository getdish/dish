import { isPresent } from '@dish/helpers'

import { allTags } from './allTags'
import { HomeStateItem } from './home-types'
import { isValidTag } from './isValidTag'
import { NavigableTag } from './NavigableTag'

export const getActiveTags = (state: Partial<HomeStateItem>) => {
  state = state ?? window['om']?.state.home.currentState
  if ('activeTags' in state) {
    const { activeTags } = state
    const tagIds = Object.keys(activeTags)
      .filter((x) => !!activeTags[x])
      .filter(isValidTag)
    const tags: NavigableTag[] = tagIds.map((x) => allTags[x]).filter(isPresent)
    return tags
  }
  return []
}
