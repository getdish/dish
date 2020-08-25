import test from 'ava'

import { DoorDash } from '../../src/doordash/DoorDash'
import {
  deleteAllScrapesBySourceID,
  scrapeFindOneBySourceID,
} from '../../src/scrape-helpers'

const store = { id: '34003', lat: 37.7069206237793, lng: -122.45873260498 }

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(store.id)
})

test('gets and persists a restaurant and its dishes', async (t) => {
  const dd = new DoorDash()
  await dd.getStore(store)
  const scrape = await scrapeFindOneBySourceID('doordash', store.id)
  t.is(scrape.data.main.name, 'FrosTea (Daly City)')
  t.deepEqual(scrape.location, {
    lon: store.lng,
    lat: store.lat,
  })
  t.is(scrape.data.main.averageRating, 4.7)
  t.assert(scrape.data.menus.allMenus.length == 1)
})
