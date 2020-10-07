import { RestaurantQuery } from '@dish/graph'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'

export const useBreakdownsBySources = (
  restaurantSlug: string,
  reviewTags: Tag[]
) => {
  let total = 0
  const restaurant = useRestaurantQuery(restaurantSlug)
  const sources = restaurant?.sources?.() ?? {}
  const rtags = restaurant?.tags
  let scoreContributingTags: RestaurantTag = []
  if (reviewTags.length) {
    scoreContributingTags = reviewTags.map((t) =>
      rtags.find((rt) => rt.tag.name == t.name)
    )
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
      if (!rtag.score_breakdown()) continue
      const score = rtag.score_breakdown()[source].score ?? 0
      rtag_breakdowns_by_source[source][rtag.tag.name] = score
      source_total += score
    }
    total += source_total
    rtag_breakdowns_by_source[source]['total'] = source_total
  }
  rtag_breakdowns_by_source['total_score'] = total
  return rtag_breakdowns_by_source
}
