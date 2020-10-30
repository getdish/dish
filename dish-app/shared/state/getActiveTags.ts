import { Tag, slugify } from '@dish/graph'

import { allTags } from './allTags'
import { HomeStateItem } from './home-types'
import { isValidTag } from './isValidTag'

export const getActiveTags = (state: Partial<HomeStateItem>) => {
  state = state ?? window['om']?.state.home.currentState
  if ('activeTags' in state) {
    const { activeTags } = state
    const tagIds = Object.keys(activeTags)
      .filter((x) => !!activeTags[x])
      .filter(isValidTag)
    const tags: Tag[] = tagIds.map(
      (x) =>
        allTags[x] ?? {
          id: slugify(x),
          name: x,
          type: 'dish',
        }
    )
    return tags
  }
  return []
}
