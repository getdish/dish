import { restaurantFindOne } from '@dish/graph'

import { DoorDash } from './DoorDash'

// async function main() {
//   const dd = new DoorDash()
//   await dd.runOnWorker('allForCity', ['San Francisco, CA'])
// }

export async function one(slug: string) {
  const restaurant = await restaurantFindOne({ slug })
  const doordash = new DoorDash()
  const coords = restaurant.location.coordinates as number[]
  const stores = await doordash.search(coords[1], coords[0], restaurant.name)
  if (!stores) {
    console.warn('⚠️ no doordash result found')
    return
  }
  const firstStore = stores[Object.keys(stores)[0]]
  if (!firstStore) {
    console.warn('⚠️ no doordash result found')
    return
  }
  const id = await doordash.getStore(firstStore)
  console.log('inserted scrape', id)
  return id
}

if (process.env.RUN && process.env.SLUG) {
  one(process.env.SLUG)
}
