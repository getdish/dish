import { SEARCH_DOMAIN } from '../constants'
import { Restaurant } from '../types'
import { RestaurantSearchArgs, TopCuisine } from '../types-extra'

export async function search({
  center: { lat: lat, lng: lng },
  span,
  query,
  tags = [],
  limit = 25,
}: RestaurantSearchArgs): Promise<Restaurant[]> {
  const params = [
    'query=' + query,
    'lon=' + lng,
    'lat=' + lat,
    'span_lon=' + span.lng,
    'span_lat=' + span.lat,
    `limit=${limit}`,
    'tags=' + tags.map((t) => t.toLowerCase().trim()).join(','),
  ]
  const url = SEARCH_DOMAIN + '/search?' + params.join('&')
  const response = await fetch(url).then((res) => res.json())
  return response
}

export async function getHomeDishes(
  lat: number,
  lng: number,
  distance: number
): Promise<TopCuisine[]> {
  const params = ['lon=' + lng, 'lat=' + lat, 'distance=' + distance]
  const response = await fetch(
    SEARCH_DOMAIN + '/top_dishes?' + params.join('&')
  ).then((res) => res.json())
  return response
}
