import { Tag } from '@dish/graph'

import { FullTag } from './FullTag'

export function getFullTag(tag: Tag): FullTag | null {
  if (!tag) {
    return null
  }
  return {
    id: tag.id,
    name: tag.name,
    type: tag.type,
    icon: tag.icon,
    slug: tag.slug,
    rgb: typeof tag.rgb === 'function' ? tag.rgb() : tag.rgb,
  }
}
