import test from 'ava'

import { Restaurant } from '../src/Restaurant'

test('Adding a restaurant', async t => {
  const restaurant = new Restaurant()
  const response = await restaurant.upsert({
    name: 'Test Restaurant',
    description: 'Not a real restaurant :(',
    longitude: 1.123,
    latitude: 3.21,
    address: 'No 1 Non-existent Street',
    city: 'Mars',
    state: 'Denial',
    zip: 123,
    image: 'https://imgur.com/123abc',
  })
  t.is(response.data.errors, undefined)
  t.is(response.status, 200)
})
