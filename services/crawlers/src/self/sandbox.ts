import { Restaurant } from '@dish/models'
import { Self } from './Self'

const name = 'Flour + Water, California'

async function one() {
  const restaurant = new Restaurant()
  await restaurant.findOne('name', name)
  const merger = new Self()
  await merger.mergeAll(restaurant.id)
  await restaurant.findOne('name', name)
  console.log(restaurant)
}

async function all() {
  const internal = new Self()
  await internal.main()
}

one()
