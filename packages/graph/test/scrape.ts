import anyTest, { TestInterface } from 'ava'

import {
  Scrape,
  deleteAllBy,
  insert,
  scrapeMergeData,
  startLogging,
} from '../src'

// startLogging()

interface Context {
  scrape: Scrape
}

const test = anyTest as TestInterface<Context>

const scrape_fixture: Partial<Scrape> = {
  source: 'Yelp',
  id_from_source: 'abc123',
  data: { stuff: 'good' },
}

test.beforeEach(async (t) => {
  await deleteAllBy('scrape', 'id_from_source', 'abc123')
  const [scrape] = await insert<Scrape>('scrape', [scrape_fixture])
  t.context.scrape = scrape
})

test('Inserting a scrape', async (t) => {
  t.assert(t.context.scrape.id != undefined)
  t.is(t.context.scrape.source, 'Yelp')
  t.is(t.context.scrape.data.stuff, 'good')
})

test('Merging data into an existing scrape', async (t) => {
  t.is(t.context.scrape.data.more, undefined)
  const updated = await scrapeMergeData(t.context.scrape.id, {
    more: 'better',
  })
  t.is(updated.data.stuff, 'good')
  t.is(updated.data.more, 'better')
})
