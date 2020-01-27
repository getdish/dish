import test from 'ava'

import { Restaurant } from '../src/Restaurant'

test('Adding a restaurant', async t => {
  const restaurant = new Restaurant()
  const response = await restaurant.upsert({
    id: '',
    name: 'Test Restaurant',
    description: 'Not a real restaurant :(',
    location: {
      type: 'Point',
      coordinates: [50, 0],
    },
    address: 'No 1 Non-existent Street',
    city: 'Mars',
    state: 'Denial',
    zip: 123,
    image: 'https://imgur.com/123abc',
  })
  t.is(response.data.errors, undefined)
  t.is(response.status, 200)
})
