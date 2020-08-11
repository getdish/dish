import { restaurantFindOne } from '@dish/graph'

import { Yelp } from './Yelp'

async function main() {
  const t = new Yelp()
  await t.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function one() {
  const range = 0.001
  const name = 'Solstice'
  const coords = [37.797519, -122.4314282]
  const t = new Yelp()
  await t.getRestaurants(
    [coords[0] - range, coords[1] - range],
    [coords[0] + range, coords[1] + range],
    0,
    name
  )
  const restaurant = await restaurantFindOne({ name })
  console.log('restaurant', restaurant)
}

one()
