import { deleteAllBy, scrapeFindOne } from '@dish/graph'
import test from 'ava'

import { GrubHub } from '../../src/grubhub/GrubHub'

const ID = '548837'

test.beforeEach(async () => {
  await deleteAllBy('scrape', 'id_from_source', ID)
})

test('gets and persists a restaurant', async (t) => {
  const dd = new GrubHub()
  await dd.getRestaurant(ID)
  const scrape = await scrapeFindOne({ id_from_source: ID })
  t.is(scrape.data.main.name, 'Squat & Gobble West Portal')
  t.deepEqual(scrape.location.coordinates, [-122.46569062, 37.74062347])
  t.assert(scrape.data.reviews.length > 10)
  t.assert(scrape.data.main.menu_category_list.length > 5)
  t.assert(scrape.data.main.rating_bayesian_half_point.rating_value > 4)
})
