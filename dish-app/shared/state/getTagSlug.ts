import { NavigableTag } from './NavigableTag'

export const getTagSlug = (tag: NavigableTag) => {
  if (!tag.slug) {
    throw new Error('No tag slug')
  }
  return tag.slug
}
