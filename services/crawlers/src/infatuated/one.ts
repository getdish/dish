import { restaurantFindOne } from '@dish/graph'

import { Infatuated } from '../infatuated/Infatuated'

export async function one(slug: string) {
  const restaurant = await restaurantFindOne({ slug })
  const infatuated = new Infatuated()
  const coords = restaurant.location.coordinates as [number, number]
  const stores = await infatuated.getRestaurants({ center: coords, returnResults: true })
  const foundStore = stores.find((x) => x.name.toLowerCase().includes(restaurant.name))
  if (!foundStore) {
    console.warn('⚠️ no infatuated result found')
  }
  const id = await infatuated.saveDataFromMapSearch(foundStore)
  console.log('inserted infatuated scrape', id)
}

if (process.env.RUN && process.env.SLUG) {
  one(process.env.SLUG)
}
