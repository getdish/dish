import test from 'ava'

import {
  deleteAllScrapesBySourceID,
  scrapeFindOneBySourceID,
} from '../../src/scrape-helpers'
import { Yelp } from '../../src/yelp/Yelp'

const ID = 'qs7FgJ-UXgpbAMass0Oojg'

test.beforeEach(async () => {
  await deleteAllScrapesBySourceID(ID)
})

test('Gets and persists a restaurant', async (t) => {
  const yelp = new Yelp()
  await yelp.getRestaurants(
    [37.759065, -122.412375],
    [37.758865, -122.412175],
    0
  )
  const scrape = await scrapeFindOneBySourceID('yelp', ID)
  t.assert(scrape.data.data_from_map_search.name.includes('Flour + Water'))
  t.deepEqual(scrape.location, { lon: -122.412283, lat: 37.758933 })
  t.is(
    scrape.data.data_from_html_embed.bizContactInfoProps.phoneNumber,
    '(415) 826-7000'
  )
  t.assert(scrape.data.photosp0.length > 25)
  t.assert(scrape.data.reviewsp0.length > 15)
})
