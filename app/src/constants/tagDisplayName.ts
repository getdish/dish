import { Tag } from '@dish/graph'

import { tagDisplayNames } from './tagMeta'

export const tagDisplayName = (tag: Partial<Tag>) => {
  const name = tag.name || ''
  return tagDisplayNames[name] ?? tag.displayName ?? name
}
