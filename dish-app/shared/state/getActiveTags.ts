import { Tag, slugify } from '@dish/graph'

import { allTags } from './allTags'
import { HomeStateItem } from './home-types'
import { isValidTag } from './isValidTag'

export const getActiveTags = (state: Partial<HomeStateItem>) => {
  state = state ?? window['om']?.state.home.currentState
  if ('activeTagIds' in state) {
    const { activeTagIds } = state
    const tagIds = Object.keys(activeTagIds)
      .filter((x) => !!activeTagIds[x])
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
