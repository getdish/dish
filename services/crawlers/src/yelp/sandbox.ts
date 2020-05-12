import { Restaurant } from '@dish/models'

import { Yelp } from './Yelp'

async function main() {
  const t = new Yelp()
  await t.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function one() {
  const range = 0.001
  const name = 'La Boulangerie de San Francisco'
  const coords = [37.797519, -122.4314282]
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
