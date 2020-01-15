import test from 'ava'

import { UberEats } from '../src/UberEats'
import { Restaurant } from '@dish/models'

test('gets and stores a restaurant and its dishes', async t => {
  const ue = new UberEats()
  await ue.getRestaurant('03b6b762-fc01-4547-a81f-87bb7af42c6a')
  const restaurant = new Restaurant()
  const response = await restaurant.find(
    'name',
    "Empanada Mama - Hell's Kitchen"
  )
  const data = response.data.data.restaurant[0]
  t.is(data.address, '765 9th Ave, New York, NY 10019')
})
