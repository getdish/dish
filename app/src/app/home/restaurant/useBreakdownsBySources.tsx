import { restaurant_tag } from '@dish/graph'
import { isPresent } from '@dish/helpers'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { NavigableTag } from '../../../types/tagTypes'

export const useBreakdownsBySources = (restaurantSlug: string, reviewTags: NavigableTag[]) => {
  let total = 0
  const [restaurant] = queryRestaurant(restaurantSlug)
  const sources = restaurant?.sources?.() ?? {}
  if (!restaurant) {
    return null
  }
  const rtags = restaurant.tags()
  let scoreContributingTags: restaurant_tag[] = []
  if (reviewTags.length) {
    scoreContributingTags = reviewTags
      .map((t) => rtags.find((rt) => rt.tag.name == t.name))
      .filter(isPresent)
  } else {
    scoreContributingTags = rtags
  }
  const source_keys = Object.keys(sources)
  let rtag_breakdowns_by_source = {}
  for (const source of source_keys) {
    rtag_breakdowns_by_source[source] = {}
    let source_total = 0
    for (const rtag of scoreContributingTags) {
      if (!rtag) continue
      const breakdown = rtag.score_breakdown
      if (!breakdown) continue
      const score = breakdown[source].score ?? 0
      rtag_breakdowns_by_source[source][rtag.tag.name] = score
      source_total += score
    }
    total += source_total
    rtag_breakdowns_by_source[source]['total'] = source_total
  }
  rtag_breakdowns_by_source['total_score'] = total
  return rtag_breakdowns_by_source
}
