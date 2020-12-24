import { SEARCH_DOMAIN } from '../constants'
import {
  HomeMeta,
  RestaurantOnlyIds,
  RestaurantSearchArgs,
  TopCuisine,
} from '../types-extra'

// See https://wiki.openstreetmap.org/wiki/Zoom_levels
const TILE_BASED_CACHE_ZOOM = 11
const TILE_WIDTH = 0.176

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
  // console.log(40, tags)
  const params = [
    'query=' + query,
    'lon=' + lng,
    'lat=' + lat,
    'span_lon=' + span.lng,
    'span_lat=' + span.lat,
    `limit=${limit}`,
    'tags=' + tags.map((t) => t.toLowerCase().trim()).join(','),
    'main_tag=' + main_tag,
  ]
  const url = SEARCH_DOMAIN + '/search?' + params.join('&')
  const x = Date.now()
  const result = await fetch(url).then((res) => res.json())
  // console.log('search', Date.now() - x + 'ms', url, result)
  return result
}

export async function getHomeDishes(
  lng: number,
  lat: number
): Promise<TopCuisine[]> {
  const snapped = snapCoordsToTileCentre(lng, lat)
  lng = snapped[0]
  lat = snapped[1]
  const params = ['lon=' + lng, 'lat=' + lat, 'distance=' + TILE_WIDTH]
  const url = SEARCH_DOMAIN + '/top_cuisines?' + params.join('&')
  const response = await fetch(url).then((res) => res.json())
  return response
}

export function snapCoordsToTileCentre(lon: number, lat: number) {
  const n = Math.pow(2, TILE_BASED_CACHE_ZOOM)
  const in_lat_rad = lat * (Math.PI / 180)
  const x_coord = n * ((lon + 180) / 360)
  const magic =
    1 - Math.log(Math.tan(in_lat_rad) + 1 / Math.cos(in_lat_rad)) / Math.PI
  const y_coord = 0.5 * n * magic
  const xtile = Math.floor(x_coord)
  const ytile = Math.floor(y_coord)
  const out_lat_rad = Math.atan(Math.sinh(Math.PI * (1 - (2 * ytile) / n)))

  lon = (xtile / n) * 360.0 - 180.0
  lat = (out_lat_rad * 180.0) / Math.PI
  return [lon, lat]
}
