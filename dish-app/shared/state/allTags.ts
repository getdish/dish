import { Tag, slugify } from '@dish/graph'

import { getFullTags } from './getFullTags'
import { getTagId } from './getTagId'

// cache for lookups in various places

export const allTags: { [keyPath: string]: Tag } = {}
export const allTagsNameToID: { [name: string]: string } = {}

window['allTags'] = allTags
window['allTagsNameToID'] = allTagsNameToID

// adds to allTags + allTagsNameToID
export async function addTagsToCache(ogTags: Tag[]) {
  const tags = await getFullTags(ogTags)

  for (const tag of tags ?? []) {
    if (tag.name) {
      const id = getTagId(tag)
      const existing = allTags[id]
      // sanity check bad ids
      if (!tag.id) {
        console.log('no id', tag)
        continue
      }
      if (tag.id[8] !== '-') {
        debugger
      }
      allTags[id] = { ...existing, ...tag }
      allTagsNameToID[tagNameKey(tag.name)] = id
    }
  }

  return tags
}

export function tagNameKey(name: string) {
  return slugify(name.toLowerCase(), ' ').replace(/\./g, '-')
}
