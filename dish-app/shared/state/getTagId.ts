import { tagSlug } from '@dish/graph'

export const getTagId = (tag: { slug?: string }) => {
  return tagSlug(tag)
}
