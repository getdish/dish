import { Restaurant } from '@dish/models'

import { Yelp } from './Yelp'

async function main() {
  const t = new Yelp()
  await t.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function one() {
  const name = 'Fresh Brew Coffee'
  const t = new Yelp()
  const restaurant = new Restaurant()
  await t.runOnWorker('getRestaurants', [
    [37.79, -122.411],
    [37.788, -122.413],
    0,
    name,
  ])
  await restaurant.findOne('name', name)
  console.log(restaurant)
}

one()
