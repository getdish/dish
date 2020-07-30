import test from 'ava'

import { Michelin } from '../../src/michelin/Michelin'
import {
  deleteAllScrapesBySourceID,
  scrapeFindOneBySourceID,
} from '../../src/scrape-helpers'

const ID = '34525'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
})

test('Gets and persists a restaurant', async (t) => {
  let michelin = new Michelin()
  await michelin.allForRegion('pl')
  const scrape = await scrapeFindOneBySourceID(ID)
  t.is(scrape.data.main.name, 'Pod Nosem')
  t.deepEqual(scrape.location, {
    lon: 19.93711,
    lat: 50.055751,
  })
})
