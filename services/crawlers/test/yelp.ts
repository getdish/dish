import test from 'ava'

import { Scrape } from '@dish/models'
import { Yelp } from '../src/yelp/Yelp'

const ID = 'qs7FgJ-UXgpbAMass0Oojg'

test.beforeEach(async () => {
  await Scrape.deleteAllBy('id_from_source', ID)
})

test.skip('Gets and persists a restaurant', async (t) => {
  const yelp = new Yelp()
  await yelp.getRestaurants(
    [37.759065, -122.412375],
    [37.758865, -122.412175],
    0
  )
  const scrape = new Scrape()
  await scrape.findOne('id_from_source', ID)

  t.is(scrape.data.data_from_map_search.name, 'Flour + Water')
  t.deepEqual(scrape.location.coordinates, [-122.412283, 37.758933])
  t.is(
    scrape.data.data_from_html_embed.bizContactInfoProps.phoneNumber,
    '(415) 826-7000'
  )
  t.assert(scrape.data.photosp1.length > 25)
  t.assert(scrape.data.reviewsp0.length > 15)
})
