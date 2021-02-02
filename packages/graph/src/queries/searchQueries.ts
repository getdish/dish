import { SEARCH_DOMAIN } from '../constants'
import {
  HomeMeta,
  RestaurantOnlyIds,
  RestaurantSearchArgs,
  TopCuisine,
} from '../typesExtra'

export type RestaurantItemMeta = {
  effective_score: number
  main_tag_normalised_score: number
  main_tag_rank: number
  main_tag_votes_ratio_normalised_score: number
  main_tag_votes_ratio_rank: number
  restaurant_base_normalised_score: number
  restaurant_base_votes_ratio_normalised_score: number
  restaurant_base_votes_ratio_rank: number
  restaurant_rank: number
  rish_rank: number
  rishes_normalised_score: number
  rishes_votes_ratio_normalised_score: number
  rishes_votes_ratio_rank: number
}

export type RestaurantSearchItem = RestaurantOnlyIds & {
  meta: RestaurantItemMeta
  isPlaceholder?: boolean
}

export type SearchResults = {
  restaurants: RestaurantSearchItem[]
  meta: HomeMeta
  name_matches: null | RestaurantOnlyIds[]
  tags: null | string[]
  text_matches: null | RestaurantOnlyIds[]
}

export async function search({
  center: { lat, lng },
  span,
  query,
  tags = [],
  limit = 50,
  main_tag = '',
}: RestaurantSearchArgs): Promise<SearchResults> {
  const params = [
    'query=' + query,
    'lon=' + lng,
    'lat=' + lat,
    'span_lon=' + span.lng * 2,
    'span_lat=' + span.lat * 2,
    `limit=${limit}`,
    'tags=' + tags.map((t) => t.toLowerCase().trim()).join(','),
    'main_tag=' + main_tag,
  ]
  const url = SEARCH_DOMAIN + '/search?' + params.join('&')
  const result = await fetch(url).then((res) => res.json())
  // console.log('search', Date.now() - x + 'ms', url, result)
  return result
}
