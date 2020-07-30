import test from 'ava'

import {
  deleteAllScrapesBySourceID,
  scrapeFindOneBySourceID,
} from '../../src/scrape-helpers'
import { Tripadvisor } from '../../src/tripadvisor/Tripadvisor'

const ID = '1516973'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
})

test('Gets and persists a restaurant', async (t) => {
  const ta = new Tripadvisor()
  ta.MAPVIEW_SIZE = 350
  ta.SEARCH_RADIUS_MULTIPLIER = 1
  ta._TESTS__LIMIT_GEO_SEARCH = true
  await ta.getRestaurants(37.759125, -122.41235)
  const scrape = await scrapeFindOneBySourceID(ID)

  t.is(scrape.data.overview.name, 'Flour + Water, California')
  t.deepEqual(scrape.location, {
    lon: -122.41235,
    lat: 37.759125,
  })
  t.is(scrape.data.overview.contact.phone, '+1 415-826-7000')
  t.assert(scrape.data.photos.length > 19)
  t.assert(scrape.data.reviewsp0.length > 9)
  t.assert(scrape.data.reviewsp1.length > 9)
})
