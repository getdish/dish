import './_debug'

import anyTest, { TestInterface } from 'ava'

import { Scrape, deleteAllBy, insert, scrapeMergeData } from '../src'

interface Context {
  scrape: Scrape
}

const test = anyTest as TestInterface<Context>

const scrape_fixture: Scrape = {
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
  // @ts-ignore
  t.is(t.context.scrape.data.more, undefined)
  const updated = await scrapeMergeData(t.context.scrape.id, {
    more: 'better',
  })
  t.is(updated.data.stuff, 'good')
  t.is(updated.data.more, 'better')
})
