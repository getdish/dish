import { allTags } from './allTags'
import { getTagSlug } from '../../helpers/getTagSlug'
import { HomeActiveTagsRecord } from './home-types'
import { NavigableTag } from './NavigableTag'

// mutating

const ensureUniqueTagOfType = new Set(['lense', 'country', 'dish'])

export function ensureUniqueActiveTags(
  activeTags: HomeActiveTagsRecord,
  nextActiveTag: NavigableTag
) {
  if (!nextActiveTag) {
    throw new Error(`Missing tag...`)
  }
  for (const key in activeTags) {
    if (key === getTagSlug(nextActiveTag)) {
      continue
    }
    const type = allTags[key]?.type
    if (
      type &&
      ensureUniqueTagOfType.has(type) &&
      type === nextActiveTag.type
    ) {
      delete activeTags[key]
    }
  }
}
