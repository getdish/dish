import '@dish/helpers/polyfill'

import { restaurantFindOne } from '@dish/graph'

import { Yelp } from './Yelp'

async function two(slug: string) {
  try {
    if (!slug) {
      console.warn('no slug')
      return
    }
    const restaurant = await restaurantFindOne({
      slug,
    })
    if (!restaurant || !restaurant.name) {
      console.warn('no restaurant/name found', restaurant)
      return
    }
    const range = 0.001
    const name = restaurant.name
    const coords = restaurant.location.coordinates
    const topLeft = [coords[1] - range, coords[0] - range] as const
    const bottomRight = [coords[1] + range, coords[0] + range] as const
    const t = new Yelp()
    await t.getRestaurants(topLeft, bottomRight, 0, name)
    console.log('done')
  } catch (err) {
    console.error('error', err)
  }
}

two(process.env.SLUG || '').then(() => {
  process.exit(0)
})
