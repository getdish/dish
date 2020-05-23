import { Restaurant, findOne } from '@dish/graph'

import { Self } from './Self'

async function one() {
  const restaurant = await findOne<Restaurant>('restaurant', {
    slug: process.env.SLUG || '',
  })
  if (restaurant) {
    const merger = new Self()
    await merger.mergeAll(restaurant.id)
  }
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
