import { Tag } from '@dish/graph'

export type NavigableTag = Partial<Tag> &
  (Required<Pick<Tag, 'name' | 'type'>> | Required<Pick<Tag, 'slug'>>)

export function tagsToNavigableTags(tags: Partial<Tag>[]) {
  return tags.filter(isNavigableTag)
}

export function isNavigableTag(tag: Partial<Tag>): tag is NavigableTag {
  return Boolean(tag && (tag.slug || (tag.name && tag.type)))
}
