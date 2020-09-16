import { Tag, slugify } from '@dish/graph'

import { getTagId } from './getTagId'

// cache for lookups in various places

export const allTags: { [keyPath: string]: Tag } = {}
export const allTagsNameToID: { [name: string]: string } = {}

// adds to allTags + allTagsNameToID
export function addTagsToCache(tags: Tag[]) {
  for (const tag of tags ?? []) {
    if (tag.name) {
      const id = getTagId(tag)
      const existing = allTags[id]
      allTags[id] = { ...existing, ...tag }
      allTagsNameToID[tagNameKey(tag.name)] = id
    }
  }
}

export function tagNameKey(name: string) {
  return slugify(name.toLowerCase(), ' ').replace(/\./g, '-')
}
