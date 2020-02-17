import { Restaurant } from '@dish/models'
import { Self } from './Self'

const name = 'L’Ardoise Bistro'

async function one() {
  const restaurant = new Restaurant()
  await restaurant.findOne('name', name)
  const dish = new Self()
  await dish.mergeAll(restaurant)
  await restaurant.findOne('name', name)
  console.log(restaurant)
}

async function batch() {
  const dish = new Self()
  await dish.main()
}

batch()
