// 🚨
// technically this should all use TagQuery but it breaks ts (slow)

import { globalTagId } from '../constants'
import { Tag } from '../types'
import { slugify } from './slugify'

export type TagWithParent = Tag & { parent: Tag }

export const tagSlug = (tag: Tag) => {
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
  let parentage = [tagSlugWithoutParent(tag)]
  parentage.push()
  if (!tagIsOrphan(tag)) {
    parentage = [
      ...parentage,
      tagSlug(tag),
      tagSlugWithoutParent(tag.parent as Tag),
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
