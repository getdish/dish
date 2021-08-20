import { deleteAllBy } from '@dish/graph'
import test from 'ava'

import { Michelin } from '../../src/michelin/Michelin'
import { deleteAllScrapesBySourceID, scrapeFindOneBySourceID } from '../../src/scrape-helpers'

const name = 'Yue Huang'
const ID = '35470'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
  await deleteAllBy('restaurant', 'name', name)
})

test('Gets and persists a restaurant', async (t) => {
  let michelin = new Michelin()
  await michelin.all(0, 100, name)
  const scrape = await scrapeFindOneBySourceID('michelin', ID)
  t.is(scrape.data.main.name, name)
  t.deepEqual(scrape.location, {
    lon: -121.5040297,
    lat: 38.6380533,
  })
})
