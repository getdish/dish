import { restaurantFindOne } from '@dish/graph'

import { GrubHub } from '../grubhub/GrubHub'

export async function one(slug: string) {
  const restaurant = await restaurantFindOne({ slug })
  const grubhub = new GrubHub()
  const coords = restaurant.location.coordinates as number[]
  const stores = await grubhub.search(coords[1], coords[0])
  const foundStore = stores.find((x) => x.name.toLowerCase().includes(restaurant.name))
  if (!foundStore) {
    console.warn('⚠️ no grubhub result found')
  }
  const id = await grubhub.getRestaurant(foundStore)
  console.log('inserted grubhub scrape', id)
}

if (process.env.RUN && process.env.SLUG) {
  one(process.env.SLUG)
}
