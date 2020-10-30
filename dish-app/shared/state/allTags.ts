import { Tag, slugify } from '@dish/graph'

import { FullTag } from './FullTag'
import { TagWithNameAndType } from './getFullTags'
import { getTagSlug } from './getTagSlug'

// cache for lookups in various places

export const allTags: { [keyPath: string]: FullTag } = {}
export const allTagsNameToSlug: { [name: string]: string } = {}

window['allTags'] = allTags
window['allTagsNameToSlug'] = allTagsNameToSlug

// adds to allTags + allTagsNameToSlug
export async function addTagsToCache(tags: FullTag[]) {
  for (const tag of tags ?? []) {
    if (!tag.name) {
      console.warn('no tag name')
    }
    const slug = getTagSlug(tag)
    const existing = allTags[slug]
    allTags[slug] = { ...existing, ...tag }
    allTagsNameToSlug[tagNameKey(tag.name)] = slug
  }
  return tags
}

export function tagNameKey(name: string) {
  return slugify(name.toLowerCase(), ' ').replace(/\./g, '-')
}

export function getFullTagFromNameAndType(tag: TagWithNameAndType): Tag {
  return (
    allTags[allTagsNameToSlug[tagNameKey(tag.name)]] ?? {
      slug: getTagSlug(tag),
      ...tag,
    }
  )
}
