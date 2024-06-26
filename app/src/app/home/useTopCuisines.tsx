import { getDistanceForZoom, snapCoordsToTileCentre } from '../../helpers/mapHelpers'
import { useQueryLoud } from '../../helpers/useQueryLoud'
import { getMapZoom } from '../getMap'
import { DISH_API_ENDPOINT, LngLat, TopCuisine } from '@dish/graph'
import { sortBy, uniqBy } from 'lodash'

export const useTopCuisines = (center?: LngLat | null) => {
  return useQueryLoud(`topcuisine-${JSON.stringify(center)}`, () => getHomeCuisines(center), {
    suspense: false,
  })
}

const getHomeCuisines = async (center?: LngLat | null) => {
  if (!center) {
    return null
  }
  const zoom = (await getMapZoom()) ?? 11
  const cuisineItems = await getHomeDishes(center.lng, center.lat, zoom)
  const all: TopCuisine[] = []
  for (const item of cuisineItems) {
    const existing = all.find((x) => x.country === item.country)
    if (existing) {
      const allTopRestaurants = [...existing.top_restaurants, ...item.top_restaurants]
      const sortedTopRestaurants = sortBy(allTopRestaurants, (x) => -(x.rating ?? 0))
      existing.top_restaurants = uniqBy(sortedTopRestaurants, (x) => x.id).slice(0, 10)
    } else {
      all.push(item)
    }
  }
  return sortBy(all, (x) => -x.avg_score)
}

async function getHomeDishes(lng: number, lat: number, zoom: number): Promise<TopCuisine[]> {
  const snapped = snapCoordsToTileCentre(lng, lat, zoom)
  lng = snapped[0]
  lat = snapped[1]
  const distance = getDistanceForZoom(zoom + 1)
  const response = await fetch(`${DISH_API_ENDPOINT}/top`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lon: lng,
      lat,
      distance,
    }),
  })
  return await response.json()
}
