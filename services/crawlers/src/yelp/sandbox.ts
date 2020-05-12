import { Restaurant } from '@dish/models'

import { Yelp } from './Yelp'

async function main() {
  const t = new Yelp()
  await t.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function one() {
  const range = 0.003
  const name = 'La Folie01'
  const coords = [37.798144, -122.4241967]
  const t = new Yelp()
  const restaurant = new Restaurant()
  await t.runOnWorker('getRestaurants', [
    [coords[0] - range, coords[1] - range],
    [coords[0] + range, coords[1] + range],
    0,
    name,
  ])
  await restaurant.findOne('name', name)
}

one()
