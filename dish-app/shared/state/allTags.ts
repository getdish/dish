import { Tag, slugify } from '@dish/graph'

import { getTagSlug } from './getTagSlug'

// cache for lookups in various places

export const allTags: { [keyPath: string]: Tag } = {}
export const allTagsNameToSlug: { [name: string]: string } = {}

window['allTags'] = allTags
window['allTagsNameToSlug'] = allTagsNameToSlug

// adds to allTags + allTagsNameToSlug
export async function addTagsToCache(tags: Tag[]) {
  for (const tag of tags ?? []) {
    if (tag.name) {
      const slug = getTagSlug(tag)
      const existing = allTags[slug]
      allTags[slug] = { ...existing, ...tag }
      allTagsNameToSlug[tagNameKey(tag.name)] = slug
    }
  }
  return tags
}

export function tagNameKey(name: string) {
  return slugify(name.toLowerCase(), ' ').replace(/\./g, '-')
}
