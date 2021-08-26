import { deleteAllBy } from '@dish/graph'
import test from 'ava'

import { deleteAllScrapesBySourceID, scrapeFindOneBySourceID } from '../../src/scrape-helpers'
import { Yelp, YelpScrape } from '../../src/yelp/Yelp'

const name = 'Flour + Water'
const BIZ_ID = 'qs7FgJ-UXgpbAMass0Oojg'

test.beforeEach(async () => {
  console.log('deleting scrape', BIZ_ID)
  await deleteAllScrapesBySourceID(BIZ_ID)
  await deleteAllBy('restaurant', 'name', name)
})

// Skipped only because it's flakey
test.skip('Gets and persists a restaurant', async (t) => {
  console.log('get and persist')
  const yelp = new Yelp()
  await yelp.getRestaurants({
    top_right: [37.759065, -122.412375],
    bottom_left: [37.758865, -122.412175],
    start: 0,
    onlyRestaurant: {
      name,
      address: '2401 Harrison St',
      telephone: '(415) 826-7000',
    },
  })
  const scrape = (await scrapeFindOneBySourceID('yelp', BIZ_ID)) as YelpScrape
  t.assert(scrape.data.data_from_search_list_item.name.includes('Flour + Water'))
  t.deepEqual(scrape.location, { lon: -122.4122826, lat: 37.7589326 })
  t.is(scrape.data.data_from_search_list_item.phone, '(415) 826-7000')
  t.assert(scrape.data?.photos?.['dishpage-1']?.length > 25)
  t.assert(scrape.data?.reviews?.['dishpage-0']?.length > 9)
})
