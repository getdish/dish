import { LngLat, SEARCH_DOMAIN, TopCuisine } from '@dish/graph'
import { sortBy, uniqBy } from 'lodash'

import {
  getDistanceForZoom,
  snapCoordsToTileCentre,
} from '../../helpers/mapHelpers'
import { useQueryLoud } from '../../helpers/useQueryLoud'
import { getMapZoom } from '../getMap'

export const useTopCuisines = (center: LngLat) => {
  return useQueryLoud('topcuisine', () => getHomeCuisines(center), {
    suspense: false,
  })
}

const getHomeCuisines = async (center: LngLat) => {
  const cuisineItems = await getHomeDishes(
    center.lng,
    center.lat,
    (await getMapZoom()) ?? 11
  )
  console.log('got them', cuisineItems)
  let all: TopCuisine[] = []
  for (const item of cuisineItems) {
    const existing = all.find((x) => x.country === item.country)
    if (existing) {
      const allTopRestaurants = [
        ...existing.top_restaurants,
        ...item.top_restaurants,
      ]
      const sortedTopRestaurants = sortBy(
        allTopRestaurants,
        (x) => -(x.rating ?? 0)
      )
      existing.top_restaurants = uniqBy(
        sortedTopRestaurants,
        (x) => x.id
      ).slice(0, 10)
    } else {
      all.push(item)
    }
  }
  return sortBy(all, (x) => -x.avg_score)
}

async function getHomeDishes(
  lng: number,
  lat: number,
  zoom: number
): Promise<TopCuisine[]> {
  const snapped = snapCoordsToTileCentre(lng, lat, zoom)
  lng = snapped[0]
  lat = snapped[1]
  const params = [
    'lon=' + lng,
    'lat=' + lat,
    // + 1 zoom because its a bit off
    'distance=' + getDistanceForZoom(zoom + 1),
  ]
  const url = SEARCH_DOMAIN + '/top_cuisines?' + params.join('&')
  const response = await fetch(url).then((res) => res.json())
  return response
}
