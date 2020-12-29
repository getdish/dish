import { RestaurantTagQuery } from '@dish/graph'

export function selectTagButtonProps(tag: RestaurantTagQuery) {
  return {
    rank: tag.rank,
    rgb: tag.tag.rgb,
    name: tag.tag.name,
    icon: tag.tag.icon,
    slug: tag.tag.slug,
    type: tag.tag.type,
    score: tag.score,
  }
}
