import { Restaurant } from '@dish/models'

import { Self } from './Self'

async function one() {
  const restaurant = new Restaurant()
  await restaurant.findOne('slug', process.env.SLUG || '')
  const merger = new Self()
  await merger.mergeAll(restaurant.id)
}

async function all() {
  const internal = new Self()
  await internal.main()
}

if (process.env.SLUG) {
  one()
} else {
  all()
}

