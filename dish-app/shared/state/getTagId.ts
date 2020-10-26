import { TagWithParent, tagSlug, tagSlugDisambiguated } from '@dish/graph'

import { NavigableTag } from './NavigableTag'

export const getTagId = (tag: NavigableTag) => {
  return tagSlug(tag)
}
