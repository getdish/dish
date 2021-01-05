import { Tag } from '@dish/graph'

import { NavigableTag } from '../types/tagTypes'

export function tagsToNavigableTags(tags: Partial<Tag>[]) {
  return tags.filter(isNavigableTag)
}

export function isNavigableTag(tag: Partial<Tag>): tag is NavigableTag {
  return Boolean(tag && (tag.slug || (tag.name && tag.type)))
}
