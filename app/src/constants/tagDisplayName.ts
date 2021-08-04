import { Tag } from '@dish/graph'

import { tagDisplayNames } from './tagMeta'

export const tagDisplayName = (tag: Partial<Tag> | string | undefined | null) => {
  if (!tag) {
    return ''
  }
  if (typeof tag === 'string') {
    return tagDisplayNames[tag] || tag
  }
  const name = tag.name || ''
  return tagDisplayNames[name] ?? tag.displayName ?? name
}
