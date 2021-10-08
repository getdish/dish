import test from 'ava'

import { Infatuation } from '../../src/infatuation/Infatuation'
import { deleteAllScrapesBySourceID, scrapeFindOneBySourceID } from '../../src/scrape-helpers'

const ID = '438'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
})

test('Gets and persists a restaurant', async (t) => {
  let infatuation = new Infatuation()
  infatuation.longest_radius = 10
  await infatuation.getRestaurants([37.758866, -122.412447])
  const scrape = await scrapeFindOneBySourceID('infatuation', ID)
  t.is(scrape.data.data_from_search_list_item.name, 'Flour + Water')
  t.deepEqual(scrape.location, { lon: -122.412447, lat: 37.758866 })
})
