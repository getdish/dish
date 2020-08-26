import { TagWithParent, tagSlug, tagSlugDisambiguated } from '@dish/graph'

import { NavigableTag } from './NavigableTag'

export const getTagId = (tag: NavigableTag) => {
  if (!tag?.name) {
    return 'no-slug'
  }
  let slug: string
  if (tag.parent) {
    slug = tagSlugDisambiguated(tag as TagWithParent)
  } else {
    slug = tagSlug(tag)
  }
  return slug
}
