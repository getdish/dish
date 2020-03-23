import test from 'ava'

import { Scrape } from '@dish/models'
import { Infatuated } from '../src/infatuated/Infatuated'

const ID = '438'

test.beforeEach(async () => {
  await Scrape.deleteAllBy('id_from_source', ID)
})

test.skip('Gets and persists a restaurant', async (t) => {
  let infatuated = new Infatuated()
  infatuated.longest_radius = 10
  await infatuated.getRestaurants([37.758866, -122.412447])
  const scrape = new Scrape()
  await scrape.findOne('id_from_source', ID)

  t.is(scrape.data.data_from_map_search.name, 'Flour + Water')
  t.deepEqual(scrape.location.coordinates, [-122.412447, 37.758866])
})
