import { deleteAllFuzzyBy } from '@dish/graph'
import test from 'ava'

import { GrubHub } from '../../src/grubhub/GrubHub'
import {
  deleteAllScrapesBySourceID,
  scrapeFindOneBySourceID,
} from '../../src/scrape-helpers'

const ID = '548837'
const name = 'Squat & Gobble West Portal'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
  await deleteAllFuzzyBy('restaurant', name)
})

test('gets and persists a restaurant', async (t) => {
  const dd = new GrubHub()
  await dd.getRestaurant(ID)
  const scrape = await scrapeFindOneBySourceID('grubhub', ID)
  t.is(scrape.data.main.name, name)
  t.deepEqual(scrape.location, { lon: -122.46569062, lat: 37.74062347 })
  t.assert(scrape.data.reviews.length > 10)
  t.assert(scrape.data.main.menu_category_list.length > 5)
  t.assert(scrape.data.main.rating_bayesian_half_point.rating_value > 4)
})
