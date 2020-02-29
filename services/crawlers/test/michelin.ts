import test from 'ava'

import { Scrape } from '@dish/models'
import { Michelin } from '../src/michelin/Michelin'

const ID = '7876'

test.beforeEach(async () => {
  await Scrape.deleteAllBy('id_from_source', ID)
})

test('Gets and persists a restaurant', async t => {
  let michelin = new Michelin()
  await michelin.allForRegion('pl')
  const scrape = new Scrape()
  await scrape.findOne('id_from_source', ID)

  t.is(scrape.data.main.name, 'Amarylis')
  t.deepEqual(scrape.location.coordinates, [19.94302, 50.053806])
})
