import { Scrape } from '@dish/models'
import test from 'ava'

import { Michelin } from '../../src/michelin/Michelin'

const ID = '7877'

test.beforeEach(async () => {
  await Scrape.deleteAllBy('id_from_source', ID)
})

test('Gets and persists a restaurant', async (t) => {
  let michelin = new Michelin()
  await michelin.allForRegion('pl')
  const scrape = new Scrape()
  await scrape.findOne('id_from_source', ID)

  t.is(scrape.data.main.name, 'atelier Amaro')
  t.deepEqual(scrape.location.coordinates, [21.03768, 52.21708])
})
