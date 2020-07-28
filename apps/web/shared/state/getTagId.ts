import { tagSlug } from '@dish/graph'

import { NavigableTag } from './NavigableTag'

export const getTagId = (tag: NavigableTag) => {
  if (!tag?.name) {
    return 'no-slug'
  }
  return tagSlug(tag)
}
