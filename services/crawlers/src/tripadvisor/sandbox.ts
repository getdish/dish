import { Restaurant, findOne } from '@dish/graph'

import { Tripadvisor } from './Tripadvisor'

const FLOUR =
  '/Restaurant_Review-g60713-d1516973-Reviews-Flour_Water-San_Francisco_California.html'

async function one() {
  const t = new Tripadvisor()
  await t.runOnWorker('getRestaurant', [FLOUR])
  const restaurant = await findOne<Restaurant>('restaurant', {
    name: 'Flour + Water',
  })
}

one()
