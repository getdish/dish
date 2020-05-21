import { Restaurant, Scrape } from '@dish/models'
import test from 'ava'

import { Google } from '../../src/google/Google'

const name = 'Fresh Brew Coffee'

const ID = '0x8085808d932ad877:0x6b0a1f17813a870d'

test.beforeEach(async () => {
  await Scrape.deleteAllBy('id_from_source', ID)
})

test('Gets and persists a restaurant', async (t) => {
  let restaurant = new Restaurant()
  await restaurant.findOne('name', name)
  const google = new Google()
  await google.boot()
  await google.getRestaurant(restaurant)
  const scrape = new Scrape()
  await scrape.findOne('id_from_source', ID)
  console.log(scrape.data.synopsis)
  t.assert(
    scrape.data.synopsis.includes(
      'Snug cafe offering American & Vietnamese sandwiches'
    )
  )
  t.assert(scrape.data.reviews.length > 10)
})
