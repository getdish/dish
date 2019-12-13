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
      console.log('got', x)
      found.push(x)
    })
    .onEndCrawl()

  t.is(found.length, 10)
})
