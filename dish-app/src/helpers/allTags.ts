import { Tag, slugify } from '@dish/graph'

import { FullTag, NavigableTag, TagWithNameAndType } from '../types/tagTypes'
import { getTagSlug } from './getTagSlug'

// cache for lookups in various places
// not the happiest with this

export const allTags: { [slug: string]: FullTag } = {}
export const allTagsNameToSlug: { [name: string]: string } = {}

export async function addTagsToCache(tags: (FullTag | NavigableTag)[]) {
  let added = false
  for (const tag of tags ?? []) {
    if (addTagToCache(tag)) {
      added = true
    }
  }
  return added
}

export function addTagToCache(tag: FullTag | NavigableTag) {
  const slug = tag.slug
  if (!tag.name || !slug) {
    // could warn
    return false
  }
  const existing = allTags[slug]
  if (existing || !slug) {
    return false
  }
  allTags[slug] = tag as any
  allTagsNameToSlug[tagNameKey(tag.name)] = slug
  return true
}

export function tagNameKey(name: string) {
  return slugify(name, ' ').replace(/\./g, '-')
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

window['allTags'] = allTags
window['allTagsNameToSlug'] = allTagsNameToSlug
