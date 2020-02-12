import test from 'ava'

import { UberEats } from '../src/ubereats/UberEats'
import { Restaurant, Scrape } from '@dish/models'

const ID = '03b6b762-fc01-4547-a81f-87bb7af42c6a'

test.beforeEach(async () => {
  await Scrape.deleteAllBy('id_from_source', ID)
})

test('gets and persists a restaurant and its dishes', async t => {
  const title = "Empanada Mama - Hell's Kitchen"
  const ue = new UberEats()
  await ue.getRestaurant(ID)
  const scrape = await Restaurant.getLatestScrape('ubereats', {
    main: { title: title },
  })
  t.is(scrape.data.main.title, title)
  t.is(scrape.data.main.location.address, '765 9th Ave, New York, NY 10019')
  t.deepEqual(scrape.location.coordinates, [-73.9886096, 40.7643916])
  t.assert(scrape.data.dishes.length > 50)
  const names = scrape.data.dishes.map((dish: any) => {
    return dish.title
  })
  t.assert(names.includes('Passion Goya Bottle'))
})
