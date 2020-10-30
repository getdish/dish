import { slugify } from '@dish/graph/_'

import { TagWithNameAndType } from './getFullTags'
import { NavigableTag } from './NavigableTag'

export const getTagSlug = (tag: NavigableTag) => {
  if (!tag.slug) {
    throw new Error('No tag slug')
  }
  return tag.slug
}

export const guessTagSlug = (tag: TagWithNameAndType) => {
  return `${parentSlugsByType[tag.type] ?? 'global'}__${slugify(tag.name)}`
}

const parentSlugsByType = {
  lense: 'lenses',
  category: 'categories',
  dish: 'dish',
  filter: 'filters',
}
