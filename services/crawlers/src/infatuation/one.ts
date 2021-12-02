import { Infatuation } from './Infatuation'
import { restaurantFindOne } from '@dish/graph'

export async function one(slug: string) {
  const restaurant = await restaurantFindOne({ slug })
  if (!restaurant) throw new Error('no rest')
  const infatuation = new Infatuation()
  const coords = restaurant.location.coordinates as [number, number]
  const stores = await infatuation.getRestaurants({
    center: [coords[1], coords[0]],
    returnResults: true,
  })
  const foundStore = stores.find((x) =>
    x.name.toLowerCase().includes(restaurant.name?.toLowerCase())
  )
  if (!foundStore) {
    console.warn('⚠️ no infatuation result found', stores)
    return
  }
  console.log('found store', foundStore)
  const id = await infatuation.saveDataFromMapSearch(foundStore)
  console.log('inserted infatuation scrape', id)
  return id
}

if (process.env.RUN && process.env.SLUG) {
  one(process.env.SLUG)
}
