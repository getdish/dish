// 🚨
// technically this should all use TagQuery but it breaks ts (slow)

import { Tag } from '../types'
import { slugify } from './slugify'

export type TagWithParent = Tag & { parent: Tag }

export const tagSlug = (tag: Tag) => {
  if (!tag.name) {
    throw new Error(`No tag name on tag: ${JSON.stringify(tag)}`)
  }
  return slugify(tag.name)
}

export const tagSlugDisambiguated = (tag: TagWithParent) => {
  if (!tag.parent?.name) {
    throw new Error(`Tag needs parent with name`)
  }
  return `${slugify(tagSlug(tag.parent))}__${tagSlug(tag)}`
}

export const tagSlugs = (tag: Tag) => {
  let parentage: string[] = []
  if (!tagIsOrphan(tag)) {
    const tag_with_parent = tag as TagWithParent
    parentage = [
      tagSlug(tag_with_parent.parent),
      tagSlugDisambiguated(tag_with_parent),
    ]
  }
  const category_names = (tag.categories || []).map((cat) => {
    if (typeof cat.category?.name !== 'string') {
      throw new Error(`tag.categoriy.name must exist as string`)
    }
    return slugify(cat.category.name)
  })
  const all = [tagSlug(tag), ...parentage, ...category_names].flat()
  return [...new Set(all)]
}

export const tagIsOrphan = (tag: Tag) => {
  if (!tag.parent) return true
  return tag.parent?.id == '00000000-0000-0000-0000-000000000000'
}

export function getTagNameWithIcon(tag: Tag) {
  let name = tag.name
  if (tag.icon) {
    name = tag.icon + name
  }
  return name
}
