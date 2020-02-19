import { Restaurant } from '@dish/models'
import { Self } from './Self'

const name = 'El Toro Taqueria'

async function one() {
  const restaurant = new Restaurant()
  await restaurant.findOne('name', name)
  const dish = new Self()
  await dish.mergeAll(restaurant.id)
  await restaurant.findOne('name', name)
  console.log(restaurant)
}

async function all() {
  const dish = new Self()
  await dish.main()
}

one()
