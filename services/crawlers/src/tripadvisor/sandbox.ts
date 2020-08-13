import { Restaurant, findOne } from '@dish/graph'

import { Tripadvisor } from './Tripadvisor'

const FLOUR =
  '/Restaurant_Review-g32655-d4642715-Reviews-Kowloon_Dimsum-Los_Angeles_California.html'

async function one() {
  const t = new Tripadvisor()
  await t.runOnWorker('getRestaurant', [FLOUR])
  const restaurant = await findOne<Restaurant>('restaurant', {
    name: 'Kowloon Dimsum',
  })
  console.log(restaurant)
}

one()
