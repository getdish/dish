import { flushTestData, restaurantInsert, restaurant_fixture } from '@dish/graph'
import test from 'ava'

import { Self } from '../../src/self/Self'

test.beforeEach(async (__t) => {
  await flushTestData()
})

test('Check if restaurant is out of business', async (t) => {
  const [restaurant] = await restaurantInsert([restaurant_fixture])
  const self = new Self()
  self.restaurant = restaurant
  self.restaurant.sources = {
    yelp: { url: 'https://www.yelp.com/biz/flour-water-san-francisco' },
  }
  await self.checkIfClosed()
  t.is(self.restaurant.is_out_of_business, null)
  self.restaurant.sources = {
    yelp: { url: 'https://www.yelp.com/biz/lucca-ravioli-co-san-francisco' },
  }
  await self.checkIfClosed()
  t.assert(self.restaurant.is_out_of_business)
})
