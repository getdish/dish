import { deleteAllBy, scrapeFindOne } from '@dish/graph'
import test from 'ava'

import { Michelin } from '../../src/michelin/Michelin'

const ID = '7877'

test.beforeEach(async () => {
  await deleteAllBy('scrape', 'id_from_source', ID)
})

test('Gets and persists a restaurant', async (t) => {
  let michelin = new Michelin()
  await michelin.allForRegion('pl')
  const scrape = await scrapeFindOne({ id_from_source: ID })
  t.is(scrape.data.main.name, 'atelier Amaro')
  t.deepEqual(scrape.location.coordinates, [21.03768, 52.21708])
})
