// 🚨
// technically this should all use TagQuery but it breaks ts (slow)

import { Tag } from '../types'
import { slugify } from './slugify'

export type TagWithParent = Tag & {
  parent: { name: string }
}

export const tagSlug = (tag: Pick<Tag, 'name'>) => {
  if (!tag.name) {
    throw new Error(`No tag name on tag: ${JSON.stringify(tag)}`)
  }
  return slugify(tag.name)
}

export const tagSlugDisambiguated = (tag: TagWithParent) => {
  if (!tag.parent) {
    throw new Error(`Needs parent`)
  }
  return `${slugify(tagSlug(tag.parent))}__${tagSlug(tag)}`
}

export const tagSlugs = (tag: TagWithParent) => {
  let parentage: string[] = []
  if (!tagIsOrphan(tag)) {
    if (!tag.parent?.name) {
      throw new Error(`Needs parent with name`)
    }
    parentage = [tagSlug(tag.parent), tagSlugDisambiguated(tag)]
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

export const tagIsOrphan = (tag: TagWithParent) => {
  return tag.parent.id == '00000000-0000-0000-0000-000000000000'
}

export function getTagNameWithIcon(tag: Tag) {
  let name = tag.name
  if (tag.icon) {
    name = tag.icon + name
  }
  return name
}
