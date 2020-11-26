import { slugify } from '@dish/graph'

import { TagWithNameAndType } from './getFullTags'
import { NavigableTag } from './NavigableTag'

export const getTagSlug = (tag: NavigableTag) => {
  if (!tag.slug) {
    console.warn('no tag slug')
    return ''
    // throw new Error('No tag slug')
  }
  return tag.slug
}

export const guessTagSlug = (
  tag: TagWithNameAndType | { slug: string; name?: string; type?: string }
) => {
  return (
    tag.slug ??
    // @ts-ignore
    `${parentSlugsByType[tag.type] ?? 'global'}__${slugify(tag.name)}`
  )
}

const parentSlugsByType = {
  lense: 'lenses',
  category: 'categories',
  dish: 'dish',
  filter: 'filters',
}
