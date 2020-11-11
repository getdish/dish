import { Tag, slugify } from '@dish/graph'

import { FullTag } from './FullTag'
import { TagWithNameAndType } from './getFullTags'
import { getTagSlug } from './getTagSlug'
import { NavigableTag } from './NavigableTag'

// cache for lookups in various places

export const allTags: { [keyPath: string]: FullTag } = {}
export const allTagsNameToSlug: { [name: string]: string } = {}

window['allTags'] = allTags
window['allTagsNameToSlug'] = allTagsNameToSlug

// adds to allTags + allTagsNameToSlug
export async function addTagsToCache(tags: (FullTag | NavigableTag)[]) {
  let added = false
  for (const tag of tags ?? []) {
    if (tag.name == null || tag.slug === null) {
      // could warn
      continue
    }
    const slug = getTagSlug(tag)
    const existing = allTags[slug]
    if (existing) {
      continue
    }
    added = true
    allTags[slug] = tag as any
    allTagsNameToSlug[tagNameKey(tag.name)] = slug
  }
  return added
}

export function tagNameKey(name: string) {
  if (typeof name !== 'string') {
    debugger
  }
  return slugify(name.toLowerCase(), ' ').replace(/\./g, '-')
}

export function getFullTagFromNameAndType(
  tag: TagWithNameAndType
): NavigableTag | null {
  const res = allTags[allTagsNameToSlug[tagNameKey(tag.name)]]
  if (res) return res
  if ('slug' in tag && 'type' in tag && 'name' in tag) {
    return tag as NavigableTag
  }
  return null
  // throw new Error('No slugifiable')
}
