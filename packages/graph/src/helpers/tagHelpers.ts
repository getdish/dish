import { globalTagId } from '../constants'
import { Tag } from '../types'

export const tagHelpers = 0

export const tagSlug = (tag: Pick<Tag, 'slug'>) => {
  if (!tag.slug) return 'no-slug'
  return tag.slug
}

export const tagSlugWithoutParent = (tag: Tag) => {
  const parts = tagSlug(tag).split('__')
  if (!parts) return tagSlug(tag)
  return parts[1]
}

export const tagSlugWithAndWithoutParent = (tag: Tag) => {
  return [tag.slug, tagSlugWithoutParent(tag)]
}

export const tagSlugs = (tag: Tag) => {
  let parentage = [tagSlugWithoutParent(tag), tagSlug(tag)]
  if (!tagIsOrphan(tag)) {
    parentage = [
      ...parentage,
      //@ts-ignore
      tagSlugWithoutParent(tag.parent),
    ]
  }
  const category_names = (tag.categories || []).map((cat) => {
    return tagSlugWithoutParent(cat.category)
  })
  const all = [...parentage, ...category_names].flat()
  return [...new Set(all)]
}

export const tagIsOrphan = (tag: Tag) => {
  if (!tag.parent) return true
  return tag.parent?.id == globalTagId
}

export function getTagNameWithIcon(tag: Tag) {
  let name = tag.name
  if (tag.icon) {
    name = tag.icon + name
  }
  return name
}
