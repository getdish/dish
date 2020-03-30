import { Restaurant } from '@dish/models'

import { Self } from './Self'

const name = 'Boulevard, California'

async function one() {
  const restaurant = new Restaurant()
  await restaurant.findOne('name', name)
  const merger = new Self()
  const updated = await merger.mergeAll(restaurant.id)
  console.log(updated)
}

async function all() {
  const internal = new Self()
  await internal.main()
}

all()
