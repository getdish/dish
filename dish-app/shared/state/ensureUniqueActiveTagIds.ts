import { allTags } from './allTags'
import { getTagId } from './getTagId'
import { HomeActiveTagsRecord } from './home-types'
import { NavigableTag } from './NavigableTag'

// mutating

const ensureUniqueTagOfType = new Set(['lense', 'country', 'dish'])

export function ensureUniqueActiveTagIds(
  activeTagIds: HomeActiveTagsRecord,
  nextActiveTag: NavigableTag
) {
  if (!nextActiveTag) {
    throw new Error(`Missing tag...`)
  }
  for (const key in activeTagIds) {
    if (key === getTagId(nextActiveTag)) {
      continue
    }
    const type = allTags[key]?.type
    if (
      type &&
      ensureUniqueTagOfType.has(type) &&
      type === nextActiveTag.type
    ) {
      delete activeTagIds[key]
    }
  }
}
