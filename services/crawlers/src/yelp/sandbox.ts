import { Restaurant } from '@dish/models'

import { Yelp } from './Yelp'

async function main() {
  const t = new Yelp()
  await t.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function one() {
  const name = 'Nopa'
  const coords = [37.774834, -122.437469]
  const t = new Yelp()
  const restaurant = new Restaurant()
  await t.runOnWorker('getRestaurants', [
    [coords[0] - 0.001, coords[1] + 0.001],
    [coords[0] + 0.001, coords[1] - 0.001],
    0,
    name,
  ])
  await restaurant.findOne('name', name)
  console.log(restaurant)
}

one()
