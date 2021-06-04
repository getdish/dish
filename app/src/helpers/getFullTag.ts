import { tag } from '@dish/graph'

import { FullTag } from '../types/tagTypes'

export function getFullTag(tag: tag): FullTag | null {
  if (!tag) {
    return null
  }
  return {
    id: tag.id,
    name: tag.name,
    type: tag.type || '',
    icon: tag.icon || '',
    slug: tag.slug || '',
    rgb: tag.rgb,
  }
}
