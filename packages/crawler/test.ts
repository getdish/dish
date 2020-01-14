import test from 'ava'
import puppeteer from 'puppeteer'

import { Crawler } from './src'

test('crawls a page', async t => {
  const crawler = new Crawler({
    entry: 'https://tryorbit.com/',
  })

  let found: puppeteer.Page[] = []

  await crawler
    .start()
    .onPage(x => {
      console.log(x.url())
      found.push(x)
    })
    .onEndCrawl()

  t.assert(found.length > 0)
})
