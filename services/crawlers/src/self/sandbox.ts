import { Restaurant } from '@dish/models'

import { Self } from './Self'

const slug = 'nopa-560-divisadero-st'

async function one() {
  const restaurant = new Restaurant()
  await restaurant.findOne('slug', slug)
  const merger = new Self()
  const updated = await merger.mergeAll(restaurant.id)
}

async function all() {
  const internal = new Self()
  await internal.main()
}

one()
