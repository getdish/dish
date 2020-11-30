import { slugify } from '@dish/graph'

import { NavigableTag } from './NavigableTag'
import { TagWithNameAndType } from './TagWithNameAndType'

export const getTagSlug = (tag: { slug?: string }) => {
  if (!tag || tag.slug === null) {
    console.warn('no tag, or tag slug', tag)
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
